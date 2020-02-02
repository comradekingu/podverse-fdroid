import { StyleSheet, Switch } from 'react-native'
import React from 'reactn'
import { PV } from '../resources'
import { core } from '../styles'
import {
  ActivityIndicator,
  FastImage,
  Icon,
  SettingsButton,
  SubscribeButton,
  Text,
  View
} from './'

type Props = {
  autoDownloadOn?: boolean
  handleToggleAutoDownload?: any
  handleToggleSettings: any
  handleToggleSubscribe: any
  isLoading?: boolean
  isNotFound?: boolean
  isSubscribed?: boolean
  isSubscribing?: boolean
  podcastImageUrl?: string
  podcastTitle: string
  showSettings?: boolean
}

export const PodcastTableHeader = (props: Props) => {
  const {
    autoDownloadOn,
    handleToggleAutoDownload,
    handleToggleSettings,
    handleToggleSubscribe,
    isLoading,
    isNotFound,
    isSubscribed,
    isSubscribing,
    podcastImageUrl,
    podcastTitle = 'untitled podcast',
    showSettings
  } = props

  return (
    <View style={core.row}>
      {isLoading && (
        <View style={[styles.wrapper, core.view]}>
          <ActivityIndicator />
        </View>
      )}
      {!isLoading && !isNotFound && (
        <View style={styles.wrapper}>
          <FastImage
            source={podcastImageUrl}
            styles={styles.image} />
          <View style={styles.textWrapper}>
            <View style={styles.textWrapperTop}>
              <Text numberOfLines={2} style={styles.title}>
                {podcastTitle}
              </Text>
              <SubscribeButton
                handleToggleSubscribe={handleToggleSubscribe}
                isSubscribed={isSubscribed}
                isSubscribing={isSubscribing}
              />
            </View>
            <View style={styles.textWrapperBottom}>
              <View style={styles.textWrapperBottomLeft}>
                {isSubscribed && !showSettings && (
                  <SettingsButton handleToggleSettings={handleToggleSettings} />
                )}
                {isSubscribed && showSettings && (
                  <SettingsButton
                    handleToggleSettings={handleToggleSettings}
                    showCheckmark={true}
                  />
                )}
              </View>
              <View style={styles.textWrapperBottomRight}>
                <Text isSecondary={true} style={styles.autoDownloadText}>
                  Auto
                </Text>
                <Icon
                  isSecondary={true}
                  name='download'
                  size={13}
                  style={styles.autoDownloadIcon}
                />
                <Switch
                  onValueChange={handleToggleAutoDownload}
                  value={autoDownloadOn}
                />
              </View>
            </View>
          </View>
        </View>
      )}
      {!isLoading && isNotFound && (
        <View style={[styles.wrapper, core.view]}>
          <Text style={styles.notFoundText}>Podcast Not Found</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  autoDownloadIcon: {
    marginRight: 8
  },
  autoDownloadText: {
    fontSize: PV.Fonts.sizes.sm,
    fontWeight: PV.Fonts.weights.semibold,
    marginRight: 6,
    marginTop: 2
  },
  buttonView: {
    alignItems: 'center',
    flex: 0,
    justifyContent: 'center',
    marginLeft: 8
  },
  image: {
    flex: 0,
    height: PV.Table.cells.podcast.image.height,
    marginRight: 12,
    width: PV.Table.cells.podcast.image.width
  },
  notFoundText: {
    fontSize: PV.Fonts.sizes.lg,
    fontWeight: PV.Fonts.weights.bold
  },
  textWrapper: {
    flex: 1,
    paddingBottom: 4,
    paddingRight: 8,
    paddingTop: 6
  },
  textWrapperBottom: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textWrapperBottomLeft: {
    flexDirection: 'row'
  },
  textWrapperBottomRight: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  textWrapperTop: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    flex: 1,
    fontSize: PV.Fonts.sizes.lg,
    fontWeight: PV.Fonts.weights.semibold,
    lineHeight: PV.Fonts.sizes.lg + 2
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    height: PV.Table.cells.podcast.wrapper.height
  }
})
