import React from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { useGlobal } from 'reactn'
import { PV } from '../resources'
import { darkTheme, navHeader } from '../styles'
import { View } from './'

type Props = {
  children?: any
  imageUrl?: string
}

export const OpaqueBackground = (props: Props) => {
  const { children, imageUrl } = props
  const [globalTheme] = useGlobal('globalTheme')

  const bgImageSource = imageUrl ? { uri: imageUrl } : {}
  const backdropColor =
    globalTheme === darkTheme ? { backgroundColor: PV.Colors.ink } : { backgroundColor: PV.Colors.white }

  return (
    <ImageBackground blurRadius={65} source={bgImageSource} style={styles.imageBackground}>
      <View style={[styles.viewBackdrop, backdropColor, navHeader.headerHeight]} transparent>
        <SafeAreaView
          forceInset={{ bottom: 'always', top: 'always' }}
          style={{
            backgroundColor: 'transparent',
            flex: 1
          }}>
          {children}
        </SafeAreaView>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1
  },
  viewBackdrop: {
    flex: 1
  }
})
