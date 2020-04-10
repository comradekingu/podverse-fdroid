import React from 'react'
import { PV } from '../resources'
import { navHeader } from '../styles'
import { Icon, NavItemWrapper } from './'

type Props = {
  navigation: any
  showBackButton?: boolean
}

export const NavQueueIcon = (props: Props) => {
  const { navigation, showBackButton } = props

  const handlePress = () => {
    navigation.navigate({ routeName: PV.RouteNames.QueueScreen, params: { showBackButton } })
  }

  return (
    <NavItemWrapper handlePress={handlePress}>
      <Icon color='#fff' name='list' size={PV.Icons.NAV} style={navHeader.buttonIcon} />
    </NavItemWrapper>
  )
}
