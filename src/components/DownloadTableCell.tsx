import React from 'react'
import { Image, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Slider } from 'react-native-elements'
import { PV } from '../resources'
import { getDownloadStatusText } from '../state/actions/downloads';
import { Text, View } from './'

type Props = {
  bytesTotal: string
  bytesWritten: string
  completed?: boolean
  episodeTitle: string
  key: string
  onPress?: any
  percent: number
  podcastImageUrl?: string
  podcastTitle: string
  status?: string
}

export const DownloadTableCell = (props: Props) => {
  const { bytesTotal = '---', bytesWritten = '---', completed, episodeTitle = 'Untitled episode', onPress, percent,
    podcastImageUrl = PV.Images.SQUARE_PLACEHOLDER, podcastTitle = 'Untitled podcast', status } = props
  const per = completed ? 1 : percent
  const statusText = getDownloadStatusText(status)

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.wrapper}>
        <Image
          source={{ uri: podcastImageUrl }}
          style={styles.image} />
        <View style={styles.textWrapper}>
          <View style={styles.textWrapperTop}>
            <Text
              numberOfLines={1}
              style={styles.episodeTitle}>
              {episodeTitle}
            </Text>
            <Text
              isSecondary={true}
              numberOfLines={1}
              style={styles.podcastTitle}>
              {podcastTitle}
            </Text>
          </View>
          <View style={styles.textWrapperBottom}>
            <Slider
              minimumValue={0}
              maximumValue={1}
              style={styles.slider}
              thumbStyle={{ height: 0, width: 0 }}
              thumbTouchSize={{ height: 0, width: 0 }}
              value={per} />
            <View style={styles.textWrapperBottomText}>
              <Text>{statusText}</Text>
              {
                completed ?
                  <Text>{bytesTotal}</Text> :
                  <Text>{`${bytesWritten} / ${bytesTotal}`}</Text>
              }
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  episodeTitle: {
    flex: 1,
    fontSize: PV.Fonts.sizes.md,
    fontWeight: PV.Fonts.weights.semibold
  },
  image: {
    flex: 0,
    height: PV.Table.cells.podcast.image.height,
    marginRight: 12,
    width: PV.Table.cells.podcast.image.width
  },
  podcastTitle: {
    flex: 1,
    fontSize: PV.Fonts.sizes.md,
    marginTop: 3
  },
  slider: {
    height: 4
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 4,
    paddingRight: 8,
    paddingTop: 6
  },
  textWrapperBottom: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  textWrapperTop: {
    flex: 1
  },
  textWrapperBottomText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  thumbStyle: {
    display: 'none'
  },
  wrapper: {
    flexDirection: 'row',
    height: PV.Table.cells.podcast.image.height
  }
})