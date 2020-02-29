import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { getGlobal } from 'reactn'
import { PV } from '../resources'
import { hidePickerIconOnAndroid } from '../styles'

type Props = {
  items: any[]
  onValueChange?: any
  placeholder: any
  selectedItemKey: string | null
}

export const HeaderTitleSelector = (props: Props) => {
  const { items, onValueChange, placeholder, selectedItemKey } = props
  const selectedItem = items.find((x) => x.value === selectedItemKey) || {}

  const { fontScaleMode } = getGlobal()

  const textStyle = [styles.text]
  if (fontScaleMode === PV.Fonts.fontScale.larger) {
    textStyle.push({ fontSize: PV.Fonts.largeSizes.xs })
  } else if (fontScaleMode === PV.Fonts.fontScale.largest) {
    textStyle.push({ fontSize: PV.Fonts.largeSizes.tiny })
  }

  const textNode = (
    <View style={styles.wrapper}>
      <Text style={textStyle}>
        {selectedItem.label || (placeholder && placeholder.label)}
      </Text>
      <Icon
        color='#fff'
        name='angle-down'
        size={16}
        style={styles.angleDown}
      />
    </View>
  )

  return (
    <View>
      {onValueChange ? (
        <RNPickerSelect
          items={items}
          onValueChange={onValueChange}
          placeholder={placeholder}
          style={hidePickerIconOnAndroid}
          useNativeAndroidPickerStyle={false}
          value={selectedItemKey}>
          {textNode}
        </RNPickerSelect>
      ) : (
        textNode
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  angleDown: {
    height: 44,
    paddingLeft: 4
  },
  text: {
    color: PV.Colors.white,
    fontWeight: 'bold'
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 44
  }
})
