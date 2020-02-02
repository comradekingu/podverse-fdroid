import { StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React from 'reactn'
import {
  decodeHTMLString,
  readableDate,
  removeHTMLFromString
} from '../lib/utility'
import { PV } from '../resources'
import { button } from '../styles'
import { ActivityIndicator, FastImage, Icon, Text, View } from './'

type Props = {
  description?: string
  handleMorePress?: any
  handleNavigationPress?: any
  id: string
  moreButtonAlignToTop?: boolean
  podcastImageUrl?: string
  podcastTitle?: string
  pubDate?: string
  title?: string
}

export class EpisodeTableCell extends React.PureComponent<Props> {
  render() {
    const {
      id,
      pubDate = '',
      handleMorePress,
      handleNavigationPress,
      podcastImageUrl,
      podcastTitle
    } = this.props
    let { description = '', title } = this.props
    description = removeHTMLFromString(description)
    description = decodeHTMLString(description)

    const { downloadedEpisodeIds, downloadsActive } = this.global

    const showPodcastInfo = !!podcastImageUrl && !!podcastTitle

    const isDownloading = downloadsActive[id]
    const isDownloaded = downloadedEpisodeIds[id]

    if (!description) description = 'No show notes available'
    if (!title) title = 'untitled episode'

    const innerTopView = (
      <View style={styles.innerTopView}>
        {!!podcastImageUrl && (
          <FastImage
            isSmall={true}
            source={podcastImageUrl}
            styles={styles.image} />
        )}
        <View style={styles.textWrapper}>
          {!!podcastTitle && (
            <Text
              isSecondary={true}
              numberOfLines={1}
              style={styles.podcastTitle}>
              {podcastTitle}
            </Text>
          )}
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          <View style={styles.textWrapperBottomRow}>
            <Text isSecondary={true} style={styles.pubDate}>
              {readableDate(pubDate)}
            </Text>
            {isDownloaded && (
              <Icon
                isSecondary={true}
                name='download'
                size={13}
                style={styles.downloadedIcon}
              />
            )}
          </View>
        </View>
      </View>
    )

    const bottomText = (
      <Text numberOfLines={4} style={styles.description}>
        {description}
      </Text>
    )

    const moreButton = (
      <Icon
        name='ellipsis-h'
        onPress={handleMorePress}
        size={32}
        style={showPodcastInfo ? button.iconOnlyMedium : button.iconOnlySmall}
      />
    )

    return (
      <View style={styles.wrapper}>
        <View style={styles.wrapperTop}>
          {handleNavigationPress ? (
            <TouchableWithoutFeedback onPress={handleNavigationPress}>
              {innerTopView}
            </TouchableWithoutFeedback>
          ) : (
            innerTopView
          )}
          {!isDownloading && handleMorePress && moreButton}
          {isDownloading && (
            <ActivityIndicator
              onPress={handleMorePress}
              styles={
                showPodcastInfo ? button.iconOnlyMedium : button.iconOnlySmall
              }
            />
          )}
        </View>
        {!!description && handleNavigationPress && (
          <TouchableWithoutFeedback onPress={handleNavigationPress}>
            {bottomText}
          </TouchableWithoutFeedback>
        )}
        {!!description && !handleNavigationPress && bottomText}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  description: {
    fontSize: PV.Fonts.sizes.md,
    lineHeight: PV.Fonts.sizes.md + 2
  },
  downloadedIcon: {
    flex: 0,
    marginLeft: 8,
    marginTop: 3
  },
  image: {
    flex: 0,
    height: 60,
    marginRight: 12,
    width: 60
  },
  innerTopView: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 4
  },
  podcastTitle: {
    flex: 0,
    fontSize: PV.Fonts.sizes.md,
    justifyContent: 'flex-start',
    lineHeight: PV.Fonts.sizes.md + 2,
    marginTop: 1
  },
  pubDate: {
    flex: 0,
    fontSize: PV.Fonts.sizes.sm,
    lineHeight: PV.Fonts.sizes.sm + 2,
    marginTop: 3
  },
  textWrapper: {
    flex: 1
  },
  textWrapperBottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: PV.Fonts.sizes.md,
    fontWeight: PV.Fonts.weights.semibold,
    lineHeight: PV.Fonts.sizes.md + 2,
    marginTop: 2
  },
  wrapper: {
    paddingBottom: 12,
    paddingHorizontal: 8,
    paddingTop: 12
  },
  wrapperTop: {
    flexDirection: 'row',
    marginBottom: 10
  }
})
