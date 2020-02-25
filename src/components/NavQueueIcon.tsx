import React from 'react'
import { View } from 'react-native'
import { PV } from '../resources'
import { navHeader } from '../styles'
import { Icon } from './'

type Props = {
  navigation: any
}

export const NavQueueIcon = (props: Props) => {
  const { navigation } = props

  return (
    <View style={navHeader.buttonWrapper}>
      <Icon
        color='#fff'
        name='list'
        onPress={() => navigation.navigate(PV.RouteNames.QueueScreen)}
        size={PV.Icons.NAV}
        style={navHeader.buttonIcon} />
    </View>
  )
}
