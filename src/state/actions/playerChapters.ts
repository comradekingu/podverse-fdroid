import { NowPlayingItem } from 'podverse-shared'
import { getGlobal, setGlobal } from 'reactn'
import { retrieveLatestChaptersForEpisodeId } from '../../services/episode'
import { PVTrackPlayer } from '../../services/player'

export const clearChapterPlaybackInfo = () => {
  return new Promise((resolve) => {
    const globalState = getGlobal()
    setGlobal(
      {
        player: {
          ...globalState.player,
          currentChapters: [],
          currentChapter: null
        }
      },
      () => {
        resolve(null)
      }
    )
  })
}

export const loadChaptersForEpisode = async (episode?: any) => {
  if (episode?.id) {
    const currentChapters = await retriveNowPlayingItemChapters(episode.id)
    setChaptersOnGlobalState(currentChapters)
  }
}

export const loadChaptersForNowPlayingItem = async (item?: NowPlayingItem) => {
  if (item?.episodeId) {
    const currentChapters = await retriveNowPlayingItemChapters(item.episodeId)
    setChaptersOnGlobalState(currentChapters)
  }
}

export const loadChapterPlaybackInfo = () => {
  (async () => {
    const globalState = getGlobal()
    const { currentChapters } = globalState.player
    const playerPosition = await PVTrackPlayer.getPosition()
  
    if ((playerPosition || playerPosition === 0) && Array.isArray(currentChapters)) {
      const currentChapter = currentChapters.find(
        (chapter: any) => playerPosition >= chapter.startTime && playerPosition < chapter.endTime
      )
      if (currentChapter) {
        setChapterOnGlobalState(currentChapter)
      }
    }
  })()
}

export const retriveNowPlayingItemChapters = async (episodeId: string) => {
  const [chapters] = await retrieveLatestChaptersForEpisodeId(episodeId)
  return enrichChapterDataForPlayer(chapters)
}

const enrichChapterDataForPlayer = (chapters: any[]) => {
  const enrichedChapters = []

  if (Array.isArray(chapters) && chapters.length > 0) {
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i]
      const nextChapter = chapters[i + 1]
      if (chapter && !chapter.endTime && nextChapter) {
        chapter.endTime = nextChapter.startTime
      }
      enrichedChapters.push(chapter)
    }
  }

  return enrichedChapters
}

export const setChapterOnGlobalState = (currentChapter: any) => {
  const globalState = getGlobal()
  setGlobal({
    player: {
      ...globalState.player,
      currentChapter,
      mediaRef: currentChapter
    }
  })
}

export const setChaptersOnGlobalState = (currentChapters: any[]) => {
  const globalState = getGlobal()
  setGlobal({
    player: {
      ...globalState.player,
      currentChapters
    }
  })
}
