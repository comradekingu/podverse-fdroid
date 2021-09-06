import { useState } from 'react';
import { Animated, Dimensions, View } from 'react-native'
import { Slider } from 'react-native-elements'
import React from 'reactn'
import { useProgress } from 'react-native-track-player'
import { translate } from '../lib/i18n';
import { convertSecToHHMMSS } from '../lib/utility'
import { PV } from '../resources'
import { setPlaybackPosition } from '../services/player'
import { loadChapterPlaybackInfo } from '../state/actions/playerChapters'
import { sliderStyles } from '../styles'
import { Text } from '.'


type Props = {
  backupDuration?: number | null
  clipEndTime?: number | null
  clipStartTime?: number | null
  globalTheme: any
  isLoading?: boolean
  isMakeClipScreen?: boolean
  value: number
}

let parentScopeDuration = 0

export function PlayerProgressBar(props: Props) {
  let isAnimationRunning = false;

  const [localState, setLocalState] = useState({   
    clipColorAnimation: new Animated.Value(0),
    slidingPositionOverride: 0
  })

  const _handleAnimation = () => {
    if (isAnimationRunning) return
    isAnimationRunning = true

    Animated.timing(localState.clipColorAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false
    }).start(() => {
      Animated.timing(localState.clipColorAnimation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: false
      }).start(() => {
        _handleAnimation()
      })
    })
  }

  const { backupDuration, clipEndTime, clipStartTime, isLoading, isMakeClipScreen } = props;
  const { slidingPositionOverride } = localState
  const { position } = useProgress()
  const { duration } = useProgress()

  const backgroundColorInterpolator = localState.clipColorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [PV.Colors.skyLight + '99', PV.Colors.yellow + '99']
  })

  // If no item is currently in the TrackPlayer, fallback to use the
  // last loaded item's duration (backupDuration).
  parentScopeDuration = duration > 0 ? duration : backupDuration || 0

  const pos = slidingPositionOverride || position
  const newProgressValue = parentScopeDuration > 0 ? pos / parentScopeDuration : 0

  let clipStartTimePosition = 0
  const sliderWidth = Dimensions.get('screen').width - sliderStyles.wrapper.marginHorizontal * 2

  if (parentScopeDuration && clipStartTime) {
    clipStartTimePosition = sliderWidth * (clipStartTime / parentScopeDuration)
  }

  let clipWidthBar = sliderWidth - clipStartTimePosition
  if (isMakeClipScreen && !clipEndTime) {
    clipWidthBar = 0
  } else if (parentScopeDuration && clipEndTime) {
    const endPosition = sliderWidth * (clipEndTime / parentScopeDuration)
    clipWidthBar = endPosition - clipStartTimePosition
  }

  return (
    <View style={sliderStyles.wrapper}>
      <Slider
        minimumValue={0}
        maximumValue={isLoading ? 0 : 1}
        minimumTrackTintColor={PV.Colors.skyDark}
        maximumTrackTintColor={PV.Colors.gray}
        onSlidingStart={(newProgressValue) => {
          const slidingPositionOverride = newProgressValue * parentScopeDuration
          setLocalState({ ...localState, slidingPositionOverride })
        }}
        onSlidingComplete={async (newProgressValue) => {
          const position = newProgressValue * parentScopeDuration
          await setPlaybackPosition(position)

          /*
            Calling TrackPlayer.seekTo(position) in setPlaybackPosition causes the progress bar
            to re-render with the *last* position, before finally seeking to the new position
            and then re-rendering with the new correct position. To workaround this, I am adding
            a 1.5 second delay before clearing the slidingPositionOverride from local state.
          */
          setTimeout(() => {
            setLocalState({ ...localState, slidingPositionOverride: 0 })
          }, 1500)

          loadChapterPlaybackInfo()
        }}
        onValueChange={(newProgressValue) => {
          const slidingPositionOverride = newProgressValue * parentScopeDuration
          setLocalState({ ...localState, slidingPositionOverride })
        }}
        thumbStyle={sliderStyles.thumbStyle}
        thumbTintColor={PV.Colors.white}
        value={isLoading ? 0 : newProgressValue}
      />
      {!isLoading ? (
        <View style={sliderStyles.timeRow}>
          <Text
            accessibilityHint={translate('ARIA HINT - Current playback time')}
            accessibilityLabel={convertSecToHHMMSS(slidingPositionOverride || position)}
            fontSizeLargerScale={PV.Fonts.largeSizes.lg}
            fontSizeLargestScale={PV.Fonts.largeSizes.md}
            style={sliderStyles.time}>
            {convertSecToHHMMSS(slidingPositionOverride || position)}
          </Text>
          <Text
            accessibilityHint={translate('ARIA HINT - episode duration')}
            accessibilityLabel={duration > 0 ? convertSecToHHMMSS(parentScopeDuration) : translate('Unknown duration')}
            fontSizeLargerScale={PV.Fonts.largeSizes.lg}
            fontSizeLargestScale={PV.Fonts.largeSizes.md}
            style={sliderStyles.time}>
            {parentScopeDuration > 0 ? convertSecToHHMMSS(parentScopeDuration) : '--:--'}
          </Text>
        </View>
      ) : (
        <View style={sliderStyles.timeRow}>
          <Text
            accessibilityHint={translate('ARIA HINT - Current playback time')}
            accessibilityLabel={
              parentScopeDuration > 0 ? convertSecToHHMMSS(parentScopeDuration) : translate('Unknown duration')}
            fontSizeLargerScale={PV.Fonts.largeSizes.lg}
            fontSizeLargestScale={PV.Fonts.largeSizes.md}
            style={sliderStyles.time}>
            {'--:--'}
          </Text>
          <Text
            accessibilityHint={translate('ARIA HINT - episode duration')}
            accessibilityLabel={
              parentScopeDuration > 0 ? convertSecToHHMMSS(parentScopeDuration) : translate('Unknown duration')}
            fontSizeLargerScale={PV.Fonts.largeSizes.lg}
            fontSizeLargestScale={PV.Fonts.largeSizes.md}
            style={sliderStyles.time}>
            {'--:--'}
          </Text>
        </View>
      )}
      {!!clipStartTimePosition && !!clipEndTime && (
        <Animated.View
          style={[
            sliderStyles.clipBarStyle,
            {
              backgroundColor: backgroundColorInterpolator,
              width: clipWidthBar,
              left: clipStartTimePosition
            }
          ]}
          onLayout={() => {
            _handleAnimation()
          }}
        />
      )}
    </View>
  )
}