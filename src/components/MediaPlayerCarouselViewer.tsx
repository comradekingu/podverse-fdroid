import { Alert, Linking, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View as RNView } from 'react-native'

import React from 'reactn'
import { translate } from '../lib/i18n'
import { readableClipTime } from '../lib/utility'
import { PV } from '../resources'
import { loadChapterPlaybackInfo } from '../state/actions/playerChapters'
import { ActivityIndicator, FastImage, Text, TextTicker } from './'

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
    const { player, screenPlayer } = this.global
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
      <RNView style={[styles.outerWrapper, { width }]}>
        <RNView style={styles.carouselTextTopWrapper}>
          {isLoading ? (
            <ActivityIndicator fillSpace />
          ) : (
            !!nowPlayingItem && (
              <RNView style={styles.episodeTitleWrapper}>
                <TextTicker allowFontScaling={false} bounce loop textLength={nowPlayingItem?.episodeTitle?.length}>
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={styles.episodeTitle}
                    testID='media_player_carousel_viewer_episode_title'>
                    {nowPlayingItem.episodeTitle}
                  </Text>
                </TextTicker>
                <Text
                  allowFontScaling={false}
                  isSecondary
                  numberOfLines={1}
                  style={styles.podcastTitle}
                  testID='media_player_carousel_viewer_podcast_title'>
                  {nowPlayingItem.podcastTitle}
                </Text>
              </RNView>
            )
          )}
        </RNView>
        <RNView style={[styles.carouselImageWrapper, { width: width * 0.9 }]}>
          <TouchableOpacity
            activeOpacity={1}
            {...(clipUrl ? { onPress: () => this.handleChapterLinkPress(clipUrl) } : {})}
            style={styles.imageContainer}>
            <FastImage key={podcastImageUrl} source={podcastImageUrl} styles={imageStyles} />
          </TouchableOpacity>
        </RNView>
        {!!clipId && (
          <RNView style={styles.carouselChapterWrapper}>
            <TouchableWithoutFeedback onPress={handlePressClipInfo}>
              <RNView style={styles.clipWrapper}>
                <TextTicker
                  allowFontScaling={false}
                  bounce
                  loop
                  styles={styles.clipTitle}
                  textLength={clipTitle?.length}>
                  {`${clipTitle}`}
                </TextTicker>
                <Text allowFontScaling={false} style={styles.clipTime} testID='media_player_carousel_viewer_time'>
                  {readableClipTime(clipStartTime, clipEndTime)}
                </Text>
              </RNView>
            </TouchableWithoutFeedback>
          </RNView>
        )}
      </RNView>
    )
  }
}

const styles = StyleSheet.create({
  outerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  carouselTextTopWrapper: {
    justifyContent: 'flex-end',
    marginBottom: 12
  },
  carouselImageWrapper: {
    alignItems: 'center',
    height: '65%'
  },
  carouselChapterWrapper: {},
  imageContainer: {
    width: '100%',
    height: '100%'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  clipWrapper: {
    alignItems: 'center',
    marginTop: 12
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
