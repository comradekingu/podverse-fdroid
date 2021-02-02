import Config from 'react-native-config'
import React, { getGlobal } from 'reactn'
import { GlobalTheme } from '../../src/resources/Interfaces'
import { darkTheme } from '../../src/styles'
import { getMakeClipIsPublic, safelyUnwrapNestedVariable } from '../lib/utility'
import { PV } from '../resources'
import { NavItemIcon, NavItemWrapper } from './'

type Props = {
  getInitialProgressValue: any
  globalTheme: GlobalTheme
  imageHeight: number
  imageWidth: number
  navigation: any
}

export const NavMakeClipIcon = (props: Props) => {
  if (Config.DISABLE_MAKE_CLIP) return null

  const { getInitialProgressValue, imageHeight, imageWidth, navigation } = props

  const handlePress = async () => {
    const initialProgressValue = await getInitialProgressValue()
    const isPublic = await getMakeClipIsPublic()
    const { globalTheme, session } = getGlobal()
    const isLoggedIn = safelyUnwrapNestedVariable(() => session.isLoggedIn, false)

    navigation.navigate(PV.RouteNames.MakeClipScreen, {
      imageHeight,
      imageWidth,
      initialProgressValue,
      initialPrivacy: isPublic,
      isLoggedIn,
      globalTheme
    })
  }

  let color = darkTheme.text.color
  if (props.globalTheme) {
    color = props.globalTheme?.text?.color
  }

  return (
    <NavItemWrapper handlePress={handlePress} testID='nav_make_clip_icon'>
      <NavItemIcon name='cut' color={color} />
    </NavItemWrapper>
  )
}
