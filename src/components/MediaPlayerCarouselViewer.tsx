import { Alert, Linking, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View as RNView } from 'react-native'
import TextTicker from 'react-native-text-ticker'
import React from 'reactn'
import { translate } from '../lib/i18n'
import { readableClipTime } from '../lib/utility'
import { PV } from '../resources'
import { loadChapterPlaybackInfo } from '../state/actions/playerChapters'
import { ActivityIndicator, FastImage, Text, View } from './'

type Props = {
  handlePressClipInfo: any
  navigation?: any
  width: number
}

export class MediaPlayerCarouselViewer extends React.PureComponent<Props> {
  chapterInterval: NodeJS.Timeout
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    loadChapterPlaybackInfo()
    this.chapterInterval = setInterval(loadChapterPlaybackInfo, 4000)
  }

  componentWillUnmount() {
    clearInterval(this.chapterInterval)
  }

  handleChapterLinkPress = (url: string) => {
    Alert.alert(PV.Alerts.LEAVING_APP.title, PV.Alerts.LEAVING_APP.message, [
      { text: translate('Cancel') },
      { text: translate('Yes'), onPress: () => Linking.openURL(url) }
    ])
  }

  render() {
    const { handlePressClipInfo, width } = this.props
    const { fontScaleMode, player, screenPlayer } = this.global
    const { currentChapter, nowPlayingItem = {} } = player
    const { isLoading } = screenPlayer
    let { clipId, clipEndTime, clipStartTime, clipTitle, podcastImageUrl } = nowPlayingItem
    let clipUrl = ''

    // If a clip is currently playing, then load the clip info.
    // Else if a chapter is currently playing, then override with the chapter info.
    if (currentChapter && !clipId) {
      clipId = currentChapter.id
      clipEndTime = currentChapter.endTime
      clipUrl = currentChapter.linkUrl
      clipStartTime = currentChapter.startTime
      clipTitle = currentChapter.title
      podcastImageUrl = currentChapter.imageUrl || podcastImageUrl
    }

    const imageStyles = [styles.image] as any
    if (clipUrl) {
      imageStyles.push(styles.imageBorder)
    }

    return (
      <View style={[styles.outerWrapper, { width }]} transparent>
        <RNView style={styles.topWrapper}>
          <View style={styles.carouselTextTopWrapper} transparent>
            {isLoading ? (
              <ActivityIndicator fillSpace />
            ) : (
              !!nowPlayingItem && (
                <RNView style={styles.episodeTitleWrapper}>
                  <TextTicker duration={15000} loop bounce repeatSpacer={60}>
                    <Text
                      fontSizeLargestScale={PV.Fonts.largeSizes.xl}
                      numberOfLines={1}
                      style={styles.episodeTitle}
                      testID='media_player_carousel_viewer_episode_title'>
                      {nowPlayingItem.episodeTitle}
                    </Text>
                  </TextTicker>
                  {fontScaleMode !== PV.Fonts.fontScale.largest && (
                    <Text
                      fontSizeLargestScale={PV.Fonts.largeSizes.md}
                      isSecondary
                      numberOfLines={1}
                      style={styles.podcastTitle}
                      testID='media_player_carousel_viewer_podcast_title'>
                      {nowPlayingItem.podcastTitle}
                    </Text>
                  )}
                </RNView>
              )
            )}
          </View>
          <View style={styles.carouselImageWrapper} transparent>
            <TouchableOpacity
              activeOpacity={1}
              {...(clipUrl ? { onPress: () => this.handleChapterLinkPress(clipUrl) } : {})}
              style={styles.imageContainer}>
              <FastImage key={podcastImageUrl} source={podcastImageUrl} styles={imageStyles} />
            </TouchableOpacity>
          </View>
        </RNView>
        {!!clipId && (
          <RNView style={styles.bottomWrapper}>
            <TouchableWithoutFeedback onPress={handlePressClipInfo}>
              <View style={styles.clipWrapper} transparent>
                <TextTicker
                  duration={10000}
                  loop
                  bounce
                  style={styles.clipTitle}
                  repeatSpacer={50}
                  testID='media_player_carousel_viewer_title'>{`${clipTitle}`}</TextTicker>
                {fontScaleMode !== PV.Fonts.fontScale.largest && (
                  <Text style={styles.clipTime} testID='media_player_carousel_viewer_time'>
                    {readableClipTime(clipStartTime, clipEndTime)}
                  </Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          </RNView>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  outerWrapper: {
    justifyContent: 'space-between'
  },
  topWrapper: {
    flex: 1,
    marginHorizontal: 8
  },
  bottomWrapper: {},
  carouselTextTopWrapper: {
    justifyContent: 'center',
    marginVertical: 10
  },
  carouselImageWrapper: {
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  imageContainer: {
    width: '100%',
    height: '80%'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  clipWrapper: {
    alignItems: 'center',
    marginTop: 15
  },
  clipTime: {
    color: PV.Colors.skyLight,
    fontSize: PV.Fonts.sizes.sm,
    minHeight: PV.Player.carouselTextSubBottomWrapper.height,
    marginTop: PV.Player.carouselTextSubBottomWrapper.marginTop,
    textAlign: 'center'
  },
  clipTitle: {
    fontSize: PV.Fonts.sizes.xxl,
    paddingBottom: 2,
    color: PV.Colors.white
  },
  episodeTitleWrapper: {
    alignItems: 'center'
  },
  episodeTitle: {
    fontSize: PV.Fonts.sizes.xxl
  },
  imageBorder: {
    borderColor: PV.Colors.skyDark,
    borderWidth: 5
  },
  podcastTitle: {
    color: PV.Colors.skyDark,
    fontSize: PV.Fonts.sizes.md,
    fontWeight: PV.Fonts.weights.bold,
    marginTop: 2,
    textAlign: 'center'
  }
})
