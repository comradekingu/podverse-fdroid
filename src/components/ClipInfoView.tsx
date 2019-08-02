import { StyleSheet, View } from 'react-native'
import React from 'reactn'
import { readableClipTime, readableDate } from '../lib/utility'
import { PV } from '../resources'
import { PVTrackPlayer } from '../services/player'
import { button, core } from '../styles'
import { ActivityIndicator, Divider, Icon, ScrollView, TableSectionHeader, Text, TextLink } from './'

type Props = {
  createdAt: string
  endTime?: number
  handleClosePress: any
  isLoading?: boolean
  navigation: any
  ownerId?: string
  ownerIsPublic?: boolean
  ownerName?: string
  startTime: number
  title?: string
}

type State = {}

export class ClipInfoView extends React.PureComponent<Props, State> {

  _navToProfileScreen = () => {
    const { navigation, ownerId, ownerName } = this.props
    const user = {
      id: ownerId,
      name: ownerName
    }

    navigation.navigate(
      PV.RouteNames.ProfileScreen, {
        user,
        navigationTitle: 'Profile'
      }
    )
  }

  _handleEditPress = async () => {
    const { navigation } = this.props
    const initialProgressValue = await PVTrackPlayer.getPosition()
    navigation.navigate(PV.RouteNames.MakeClipScreen, {
      initialProgressValue,
      isEditing: true
    })
  }

  render() {
    const { createdAt, endTime, handleClosePress, isLoading, ownerIsPublic, ownerId, ownerName = 'anonymous',
      startTime, title } = this.props
    const { globalTheme, session } = this.global
    const userId = session.userInfo.id

    return (
      <View style={[styles.wrapper, globalTheme.view]}>
        {
          isLoading && <ActivityIndicator />
        }
        {
          !isLoading &&
            <View style={styles.wrapper}>
                <TableSectionHeader
                  handleClosePress={handleClosePress}
                  title='Clip Info' />
                <ScrollView style={styles.scrollView}>
                  <View style={core.row}>
                    <View style={styles.topText}>
                      <Text style={styles.title}>{title}</Text>
                      <Text style={styles.time}>{readableClipTime(startTime, endTime)}</Text>
                    </View>
                    {
                      userId === ownerId &&
                        <View style={styles.topEditButtonWrapper}>
                          <Icon
                            name='pencil-alt'
                            onPress={() => this._handleEditPress()}
                            size={26}
                            style={button.iconOnlySmall} />
                        </View>
                    }
                  </View>
                  <Divider style={styles.divider} />
                  <Text style={styles.text}>Created: {readableDate(createdAt)}</Text>
                  <View style={core.row}>
                    <Text style={styles.inlineText}>By: </Text>
                    {
                      ownerIsPublic ?
                        <TextLink
                          onPress={this._navToProfileScreen}
                          style={styles.link}>
                          {ownerName}
                        </TextLink> :
                        <Text style={styles.inlineText}>anonymous</Text>
                    }
                  </View>
                </ScrollView>
              </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  divider: {
    marginBottom: 8
  },
  inlineText: {
    flex: 0,
    fontSize: PV.Fonts.sizes.lg,
    marginBottom: 8
  },
  link: {
    flex: 0,
    fontSize: PV.Fonts.sizes.lg
  },
  scrollView: {
    flex: 1,
    padding: 8
  },
  text: {
    fontSize: PV.Fonts.sizes.md,
    marginBottom: 8
  },
  time: {
    fontSize: PV.Fonts.sizes.lg,
    marginBottom: 8
  },
  title: {
    fontSize: PV.Fonts.sizes.lg,
    fontWeight: PV.Fonts.weights.bold,
    marginBottom: 8
  },
  topEditButtonWrapper: {
    flex: 0,
    marginLeft: 4
  },
  topText: {
    flex: 1
  },
  wrapper: {
    flex: 1
  }
})