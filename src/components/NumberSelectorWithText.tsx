import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useGlobal } from 'reactn'
import { convertSecToHHMMSS, testProps } from '../lib/utility'
import { PV } from '../resources'
import { Text, TextInput } from './'

type Props = {
  editable?: boolean
  handleChangeText?: any
  handleSubmitEditing?: any
  isHHMMSS?: boolean
  isSmallText?: boolean
  selectedNumber?: number | string | null
  subText?: string
  testID: string
  text: string
  textInputOnPress?: any
  textInputStyle?: any
}

export const NumberSelectorWithText = (props: Props) => {
  const { editable, handleChangeText, handleSubmitEditing, isHHMMSS, isSmallText,
    selectedNumber = 0, subText, testID, text, textInputOnPress, textInputStyle = {} } = props
  const [globalTheme] = useGlobal('globalTheme')

  let strNum = ''
  const parsedNumber =
    typeof selectedNumber === 'string' ? parseInt(selectedNumber, 10) : selectedNumber
  if (parsedNumber || parsedNumber === 0) {
    strNum = isHHMMSS ? convertSecToHHMMSS(parsedNumber) : parsedNumber.toString()
  }

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.innerWrapper}>
        <TextInput
          autoCompleteType='off'
          editable={editable}
          fontSizeLargestScale={PV.Fonts.largeSizes.md}
          keyboardType='numeric'
          onChangeText={handleChangeText}
          onPress={textInputOnPress}
          onSubmitEditing={handleSubmitEditing}
          placeholderTextColor={globalTheme.placeholderText.color}
          returnKeyType='done'
          style={[styles.textInput, textInputStyle]}
          testID={testID}
          value={strNum}
          wrapperStyle={{ marginBottom: 0 }}
        />
        <Text fontSizeLargestScale={PV.Fonts.largeSizes.md} style={isSmallText ? styles.smallText : styles.text}>
          {text}
        </Text>
      </View>
      {subText && (
        <Text
          fontSizeLargestScale={PV.Fonts.largeSizes.sm}
          style={[globalTheme.textSecondary, styles.subText]}
          {...(testID ? testProps(`${testID}_sub_text`) : {})}>
          {subText}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  innerWrapper: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  outerWrapper: {},
  smallText: {
    flex: 1,
    marginHorizontal: 12
  },
  subText: {
    marginTop: 12,
    fontSize: PV.Fonts.sizes.md
  },
  text: {
    flex: 1,
    fontSize: PV.Fonts.sizes.lg,
    fontWeight: PV.Fonts.weights.bold,
    marginHorizontal: 12
  },
  textInput: {
    fontSize: PV.Fonts.sizes.xxl,
    justifyContent: 'center',
    textAlign: 'center',
    width: 44,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0
  }
})
