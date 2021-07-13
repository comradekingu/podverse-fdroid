import { Alert, Linking, StyleSheet, TouchableOpacity, View as RNView } from 'react-native'
import React from 'reactn'
import { translate } from '../lib/i18n'
import { readableClipTime, readableDate, testProps } from '../lib/utility'
import { PV } from '../resources'
import { IndicatorDownload } from './IndicatorDownload'
import { TimeRemainingWidget } from './TimeRemainingWidget'
import { FastImage, Text, View } from './'

type Props = {
  handleMorePress: any
  hideImage?: boolean
  item: any
  loadTimeStampOnPlay?: boolean
  showChapterInfo?: boolean
  showEpisodeInfo?: boolean
  showPodcastInfo?: boolean
  testID: string
  transparent?: boolean
}

export class ClipTableCell extends React.PureComponent<Props> {
  handleChapterLinkPress = (url: string) => {
    Alert.alert(PV.Alerts.LEAVING_APP.title, PV.Alerts.LEAVING_APP.message, [
      { text: translate('Cancel') },
      { text: translate('Yes'), onPress: () => Linking.openURL(url) }
    ])
  }

  render() {
    const { handleMorePress, hideImage, item, loadTimeStampOnPlay,
      showChapterInfo, showEpisodeInfo, showPodcastInfo, testID, transparent } = this.props

    const episodePubDate = item?.episode?.pubDate || ''
    const episodeId = item?.episode?.id || ''
    const podcastImageUrl = item?.episode?.podcast?.shrunkImageUrl || item?.episode?.podcast?.imageUrl
    const chapterImageUrl = item?.imageUrl
    const hasChapterCustomImage = item?.hasCustomImage
    const startTime = item.startTime
    const endTime = item.endTime
    const title = item?.title?.trim() || translate('Untitled Clip')
    const episodeTitle = item?.episode?.title?.trim() || translate('Untitled Episode')
    const podcastTitle = item?.episode?.podcast?.title?.trim() || translate('Untitled Podcast')
    const clipTime = readableClipTime(startTime, endTime)
    const { downloadsActive, downloadedEpisodeIds, fontScaleMode } = this.global
    const isDownloaded = downloadedEpisodeIds[episodeId]
    const episodeDownloading = item?.episode?.id && !!downloadsActive[item.episode.id]
    const chapterImageStyle = item?.linkUrl
      ? [styles.chapterImage, styles.chapterImageBorder]
      : styles.chapterImage


    const innerTopView = (
      <RNView style={styles.innerTopView} {...(testID ? testProps(`${testID}_top_view_nav`) : {})}>
        <RNView style={{ flex: 1, flexDirection: 'column' }}>
          {(showEpisodeInfo || showPodcastInfo) && (
            <RNView style={styles.imageAndTopRightTextWrapper}>
              {showPodcastInfo && !!podcastImageUrl && !hideImage && (
                <FastImage isSmall source={podcastImageUrl} styles={styles.image} />
              )}
              <RNView style={styles.textWrapper}>
                {showPodcastInfo && podcastTitle && (
                  <Text
                    fontSizeLargestScale={PV.Fonts.largeSizes.sm}
                    isSecondary
                    numberOfLines={1}
                    style={styles.podcastTitle}
                    testID={`${testID}_podcast_title`}>
                    {podcastTitle.trim()}
                  </Text>
                )}
                {showEpisodeInfo && PV.Fonts.fontScale.largest !== fontScaleMode && episodeTitle && (
                  <Text numberOfLines={2} style={styles.episodeTitle} testID={`${testID}_episode_title`}>
                    {episodeTitle.trim()}
                  </Text>
                )}
                {showEpisodeInfo && !!episodePubDate && (
                  <RNView style={styles.textWrapperBottomRow}>
                    <Text
                      fontSizeLargerScale={PV.Fonts.largeSizes.md}
                      fontSizeLargestScale={PV.Fonts.largeSizes.sm}
                      isSecondary
                      numberOfLines={1}
                      style={styles.episodePubDate}
                      testID={`${testID}_episode_pub_date`}>
                      {readableDate(episodePubDate)}
                    </Text>
                    {isDownloaded && <IndicatorDownload />}
                  </RNView>
                )}
              </RNView>
            </RNView>
          )}
          <Text
            fontSizeLargestScale={PV.Fonts.largeSizes.md}
            numberOfLines={4}
            style={styles.title}
            testID={`${testID}_title`}>
            {title}
          </Text>
        </RNView>
      </RNView>
    )

    return (
      <View style={styles.wrapper} transparent={transparent}>
        <View style={styles.wrapperInner} transparent={transparent}>
          <RNView style={styles.wrapperTop}>
            {innerTopView}
          </RNView>
          <TimeRemainingWidget
            clipTime={clipTime}
            episodeDownloading={episodeDownloading}
            handleMorePress={handleMorePress}
            item={item}
            loadTimeStampOnPlay={loadTimeStampOnPlay}
            testID={testID}
            transparent={transparent}
          />
        </View>
        {showChapterInfo && (chapterImageUrl || hasChapterCustomImage) && (
          <TouchableOpacity
            activeOpacity={1}
            {...(item?.linkUrl ? { onPress: () => this.handleChapterLinkPress(item.linkUrl) } : {})}>
            <FastImage isSmall source={chapterImageUrl || podcastImageUrl} styles={chapterImageStyle} />
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  chapterImage: {
    height: 64,
    marginLeft: 12,
    width: 64
  },
  chapterImageBorder: {
    borderColor: PV.Colors.skyDark,
    borderWidth: 4
  },
  episodePubDate: {
    fontSize: PV.Fonts.sizes.sm,
    fontWeight: PV.Fonts.weights.semibold,
    color: PV.Colors.skyLight,
    marginTop: 3,
    marginRight: 10
  },
  episodeTitle: {
    fontSize: PV.Fonts.sizes.xxl,
    fontWeight: PV.Fonts.weights.thin
  },
  image: {
    height: 64,
    marginRight: 12,
    width: 64
  },
  imageAndTopRightTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center'
  },
  innerTopView: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 4
  },
  playlistClipTitle: {
    fontSize: PV.Fonts.sizes.md,
    fontWeight: PV.Fonts.weights.bold
  },
  podcastTitle: {
    fontSize: PV.Fonts.sizes.lg,
    fontWeight: PV.Fonts.weights.bold,
    justifyContent: 'flex-start'
  },
  textWrapper: {
    flex: 1,
    marginRight: 4
  },
  textWrapperBottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {
    fontSize: PV.Fonts.sizes.lg,
    fontWeight: PV.Fonts.weights.bold,
    color: PV.Colors.white
  },
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 16
  },
  wrapperInner: {
    flex: 1
  },
  wrapperTop: {
    flexDirection: 'row',
    marginBottom: 8
  }
})
