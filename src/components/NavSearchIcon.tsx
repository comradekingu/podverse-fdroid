import React from 'react'
import Config from 'react-native-config'
import { PV } from '../resources'
import { NavItemIcon, NavItemWrapper } from '.'

type Props = {
  navigation: any
}

export const NavSearchIcon = (props: Props) => {
  if (Config.DISABLE_SEARCH) return null

  const { navigation } = props

  const handlePress = () => {
    navigation.navigate(PV.RouteNames.SearchScreen)
  }

  return (
    <NavItemWrapper handlePress={handlePress} testID='nav_search_icon'>
      <NavItemIcon name='search' />
    </NavItemWrapper>
  )
}
