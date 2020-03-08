import React from 'react'
import { BottomTabBar } from 'react-navigation-tabs'
import { useGlobal } from 'reactn'
import { View } from '../components'
import { PV } from '../resources'
import { GlobalTheme } from '../resources/Interfaces'
import { darkTheme } from '../styles'
import { MiniPlayer } from './MiniPlayer'

type Props = {
  navigation: any
}

export const PVTabBar = (props: Props) => {
  const { navigation } = props
  const [player] = useGlobal<any>('player')
  const [globalTheme] = useGlobal<GlobalTheme>('globalTheme')
  // include downloadsActive so the More tab downloading badge will re-render on downloadsActive updates
  const [downloadsActive] = useGlobal('downloadsActive')

  const isDarkMode = globalTheme === darkTheme

  return (
    <View>
      {player && player.showMiniPlayer && player.nowPlayingItem && <MiniPlayer navigation={navigation} />}
      <BottomTabBar
        {...props}
        activeTintColor={isDarkMode ? PV.Colors.blueLighter : PV.Colors.blueDarker}
        inactiveTintColor={isDarkMode ? PV.Colors.grayLighter : PV.Colors.grayDarker}
        labelStyle={{
          fontSize: PV.Fonts.sizes.tiny
        }}
        style={globalTheme.tabbar}
      />
    </View>
  )
}
