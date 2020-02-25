import { StyleSheet, TouchableWithoutFeedback, View as RNView } from 'react-native'
import React from 'reactn'
import {
  decodeHTMLString,
  readableDate,
  removeHTMLFromString
} from '../lib/utility'
import { PV } from '../resources'
import { FastImage, IndicatorDownload, MoreButton, Text, View } from './'

type Props = {
  description?: string
  handleMorePress?: any
  handleNavigationPress?: any
  hasZebraStripe?: boolean
  hideImage?: boolean
  id: string
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
      hasZebraStripe,
      hideImage,
      podcastImageUrl,
      podcastTitle
    } = this.props
    let { description = '', title } = this.props
    description = removeHTMLFromString(description)
    description = decodeHTMLString(description)

    const { downloadedEpisodeIds, downloadsActive } = this.global

    const isDownloading = downloadsActive[id]
    const isDownloaded = downloadedEpisodeIds[id]

    if (!title) title = 'untitled episode'

    const innerTopView = (
      <RNView style={styles.innerTopView}>
        {!!podcastImageUrl && (
            <FastImage
              isSmall={true}
              source={podcastImageUrl}
              styles={styles.image} />
        )}
        <RNView style={styles.textWrapper}>
          {!!podcastTitle && (
            <Text
              isSecondary={true}
              numberOfLines={1}
              style={styles.podcastTitle}>
              {podcastTitle}
            </Text>
          )}
          <Text numberOfLines={6} style={styles.title}>
            {title}
          </Text>
          <RNView style={styles.textWrapperBottomRow}>
            <Text isSecondary={true} style={styles.pubDate}>
              {readableDate(pubDate)}
            </Text>
            {isDownloaded && (
              <IndicatorDownload />
            )}
          </RNView>
        </RNView>
      </RNView>
    )

    const descriptionStyle = hideImage ? [styles.description, { paddingLeft: 0 }] : styles.description

    const bottomText = (
      <Text
        isSecondary={true}
        numberOfLines={4}
        style={descriptionStyle}>
        {description}
      </Text>
    )

    return (
      <View hasZebraStripe={hasZebraStripe} style={styles.wrapper}>
        <RNView style={styles.wrapperTop}>
          {handleNavigationPress ? (
            <TouchableWithoutFeedback onPress={handleNavigationPress}>
              {innerTopView}
            </TouchableWithoutFeedback>
          ) : (
            innerTopView
          )}
          {handleMorePress &&
            <MoreButton
              handleShowMore={handleMorePress}
              height={hideImage ? 46 : 64}
              isLoading={isDownloading} />
          }
        </RNView>
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
    lineHeight: PV.Fonts.sizes.md + 2,
    marginTop: 10,
    paddingLeft: 76
  },
  image: {
    flex: 0,
    height: 64,
    marginRight: 12,
    width: 64
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
    lineHeight: PV.Fonts.sizes.md,
    marginTop: 1
  },
  pubDate: {
    flex: 0,
    fontSize: PV.Fonts.sizes.sm,
    lineHeight: PV.Fonts.sizes.sm,
    marginTop: 7
  },
  textWrapper: {
    flex: 1
  },
  textWrapperBottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: PV.Fonts.sizes.xl,
    fontWeight: PV.Fonts.weights.bold,
    marginTop: 3
  },
  wrapper: {
    paddingBottom: 14,
    paddingHorizontal: 8,
    paddingTop: 16
  },
  wrapperTop: {
    flexDirection: 'row'
  }
})
