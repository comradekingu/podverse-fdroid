import debounce from 'lodash/debounce'
import { Platform } from 'react-native'
import { NowPlayingItem } from '../lib/NowPlayingItem'
import { PV } from '../resources'
import { setNowPlayingItem } from '../state/actions/player'
import { addOrUpdateHistoryItem, checkIfPlayingFromHistory } from './history'
import {
  getClipHasEnded,
  getNowPlayingItem,
  getNowPlayingItemFromQueueOrHistoryByTrackId,
  getPlaybackSpeed,
  handleResumeAfterClipHasEnded,
  playerJumpBackward,
  playerJumpForward,
  PVTrackPlayer,
  setClipHasEnded,
  setPlaybackPositionWhenDurationIsAvailable,
  updateUserPlaybackPosition
} from './player'
import PlayerEventEmitter from './playerEventEmitter'

const debouncedSetPlaybackPosition = debounce(
  setPlaybackPositionWhenDurationIsAvailable,
  1000,
  {
    leading: true,
    trailing: false
  }
)

// Sometimes when there is poor internet connectivity, the addOrUpdateHistoryItem request will fail.
// This will result in the current item mising from the user's history, and the next time they open
// the app, it will load with an old history item instead of the last one they were listening to.
// To prevent this, we are repeatedly calling the addOrUpdateHistoryItem method on an interval until
// it succeeds. When a new item loads, it should clear out the previous interval.
// addOrUpdateHistoryItem is also called in handleNetworkChange in App.jsx on connection to wifi and cellular,
// since it is possible that this interval succeeds locally when their is no internet connection,
// and never calls to sync with the server.
let addOrUpdateRequestInterval: any
const handleAddOrUpdateRequestInterval = (nowPlayingItem: any) => {
  if (!nowPlayingItem) return

  if (addOrUpdateRequestInterval) {
    clearInterval(addOrUpdateRequestInterval)
  }

  const startInterval = async () => {
    try {
      await addOrUpdateHistoryItem(nowPlayingItem)
      await updateUserPlaybackPosition()
      clearInterval(addOrUpdateRequestInterval)
    } catch (error) {
      console.log(error)
    }
  }

  startInterval()
  addOrUpdateRequestInterval = setInterval(startInterval, 20000)
}

const handleSyncNowPlayingItem = async (
  trackId: string,
  currentNowPlayingItem: NowPlayingItem,
  isSecondTime?: boolean
) => {
  if (!currentNowPlayingItem) return
  await setNowPlayingItem(currentNowPlayingItem)

  if (!isSecondTime) {
    if (currentNowPlayingItem && currentNowPlayingItem.clipId) {
      PlayerEventEmitter.emit(PV.Events.PLAYER_CLIP_LOADED)
    }
    if (
      !currentNowPlayingItem.clipId &&
      currentNowPlayingItem.userPlaybackPosition
    ) {
      debouncedSetPlaybackPosition(
        currentNowPlayingItem.userPlaybackPosition,
        trackId
      )
    }

    const isPlayingFromHistory = await checkIfPlayingFromHistory()
    if (!isPlayingFromHistory && currentNowPlayingItem) {
      handleAddOrUpdateRequestInterval(currentNowPlayingItem)
    }
  }

  PlayerEventEmitter.emit(PV.Events.PLAYER_TRACK_CHANGED)
}

const syncNowPlayingItemWithTrack = async () => {
  // The first setTimeout is an attempt to prevent the following:
  // - Sometimes clips start playing from the beginning of the episode, instead of the start of the clip.
  // - Sometimes the debouncedSetPlaybackPosition seems to load with the previous track's playback position,
  // instead of the new track's playback position.
  // NOTE: This timeout will lead to a delay before every clip starts, where it starts playing from the episode start
  // before playing from the clip start. Hopefully we can iron this out sometime...
  // - The second timeout is called in case something was out of sync previously from getCurrentTrack
  // or getNowPlayingItemFromQueueOrHistoryByTrackId...
  async function sync(isSecondTime?: boolean) {
    const currentTrackId = await PVTrackPlayer.getCurrentTrack()
    const currentNowPlayingItem = await getNowPlayingItemFromQueueOrHistoryByTrackId(
      currentTrackId
    )

    if (currentNowPlayingItem) {
      await handleSyncNowPlayingItem(
        currentTrackId,
        currentNowPlayingItem,
        isSecondTime
      )
    }
  }

  setTimeout(sync, 1000)
  const isSecondTime = true
  setTimeout(() => sync(isSecondTime), 5000)
}

module.exports = async () => {
  PVTrackPlayer.addEventListener('playback-error', (x) =>
    console.log('playback error', x)
  )

  PVTrackPlayer.addEventListener('playback-queue-ended', async (x) => {
    console.log('playback-queue-ended', x)
    syncNowPlayingItemWithTrack()
  })

  PVTrackPlayer.addEventListener('playback-state', async (x) => {
    console.log('playback-state', x)

    // Sometimes when the app is paused, and the app switches between wifi, data, or airplane mode,
    // the TrackPlayer will be in an "idle" or "none" state when you return to the app.
    // This line is an attempt to prevent the UI from getting frozen in a buffering state.
    // NOTE: As of 10/23/19 I can't reproduce the problem...hopefully it was fixed in iOS or the TrackPlayer.
    if (
      x.state === 'idle' ||
      x.state === 0 ||
      x.state === PVTrackPlayer.STATE_NONE
    ) {
      // setTimeout(syncNowPlayingItemWithTrack, 1000)
      return
    }

    PlayerEventEmitter.emit(PV.Events.PLAYER_STATE_CHANGED)

    const clipHasEnded = await getClipHasEnded()
    const nowPlayingItem = await getNowPlayingItem()

    if (nowPlayingItem) {
      const { clipEndTime } = nowPlayingItem
      const currentPosition = await PVTrackPlayer.getPosition()
      const currentState = await PVTrackPlayer.getState()
      const isPlaying = currentState === PVTrackPlayer.STATE_PLAYING

      if (
        clipHasEnded &&
        clipEndTime &&
        currentPosition >= clipEndTime &&
        isPlaying
      ) {
        await handleResumeAfterClipHasEnded()
      }

      if (Platform.OS === 'ios') {
        if (x.state === 'paused') {
          updateUserPlaybackPosition()
        } else if (x.state === 'playing') {
          updateUserPlaybackPosition()
          const rate = await getPlaybackSpeed()
          PVTrackPlayer.setRate(rate)
        }
      } else if (Platform.OS === 'android') {
        /*
          state key for android
          NOTE: ready and pause use the same number, so there is no true ready state for Android :[
          none      0
          stopped   1
          paused    2
          playing   3
          ready     2
          buffering 6
          ???       8
        */
        if ((x.state === 2 && currentPosition > 3) || x.state === 3) {
          updateUserPlaybackPosition()
        }

        if (x.state === 3) {
          const rate = await getPlaybackSpeed()
          PVTrackPlayer.setRate(rate)
        }
      }
    }
  })

  PVTrackPlayer.addEventListener('playback-track-changed', async (x: any) => {
    console.log('playback-track-changed', x)
    syncNowPlayingItemWithTrack()
  })

  PVTrackPlayer.addEventListener('playback-error', (x: any) => {
    console.log('playback-error', x)
    // TODO: post error to our logs!
    PlayerEventEmitter.emit(PV.Events.PLAYER_PLAYBACK_ERROR)
  })

  PVTrackPlayer.addEventListener('remote-jump-backward', () =>
    playerJumpBackward(PV.Player.jumpSeconds)
  )

  PVTrackPlayer.addEventListener('remote-jump-forward', () =>
    playerJumpForward(PV.Player.jumpSeconds)
  )

  PVTrackPlayer.addEventListener('remote-pause', async () => {
    PVTrackPlayer.pause()
    PlayerEventEmitter.emit(PV.Events.PLAYER_REMOTE_PAUSE)
    updateUserPlaybackPosition()
  })

  PVTrackPlayer.addEventListener('remote-play', async () => {
    PVTrackPlayer.play()
    PlayerEventEmitter.emit(PV.Events.PLAYER_REMOTE_PLAY)
    updateUserPlaybackPosition()
  })

  PVTrackPlayer.addEventListener('remote-seek', async (data) => {
    if (data.position || data.position >= 0) {
      PVTrackPlayer.seekTo(Math.floor(data.position))
      updateUserPlaybackPosition()
    }
  })

  PVTrackPlayer.addEventListener('remote-stop', () => {
    PVTrackPlayer.pause()
    PlayerEventEmitter.emit(PV.Events.PLAYER_REMOTE_STOP)
  })

  PVTrackPlayer.addEventListener('remote-duck', (x: any) => {
    const { paused, permanent } = x
    if (permanent) {
      PVTrackPlayer.stop()
    } else if (paused) {
      PVTrackPlayer.pause()
    } else {
      PVTrackPlayer.play()
    }
  })
}

let clipEndTimeInterval: any = null

const handlePlayerClipLoaded = async () => {
  console.log('PLAYER_CLIP_LOADED event')
  const nowPlayingItem = await getNowPlayingItem()
  if (nowPlayingItem) {
    const { clipEndTime, clipId } = nowPlayingItem

    if (clipEndTimeInterval) clearInterval(clipEndTimeInterval)

    if (clipId && clipEndTime) {
      clipEndTimeInterval = setInterval(async () => {
        const currentPosition = await PVTrackPlayer.getPosition()
        if (currentPosition > clipEndTime) {
          clearInterval(clipEndTimeInterval)
          PVTrackPlayer.pause()
          await setClipHasEnded(true)
        }
      }, 250)
    }
    const resolveImmediately = true
    await debouncedSetPlaybackPosition(
      nowPlayingItem.clipStartTime,
      nowPlayingItem.clipId,
      resolveImmediately
    )
  }
}

const debouncedHandlePlayerClipLoaded = debounce(handlePlayerClipLoaded, 1000)

PlayerEventEmitter.on(
  PV.Events.PLAYER_CLIP_LOADED,
  debouncedHandlePlayerClipLoaded
)
