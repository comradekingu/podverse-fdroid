import React from 'react'
import { StyleSheet } from 'react-native'
import { PV } from '../resources'
import { Text, View } from './'

type Props = {
  hasZebraStripe?: boolean
  name?: string
  onPress?: any
}

export class ProfileTableCell extends React.PureComponent<Props> {
  render() {
    const { hasZebraStripe, name, onPress } = this.props

    return (
      <View
        hasZebraStripe={hasZebraStripe}
        style={styles.wrapper}>
        <Text
          onPress={onPress}
          style={styles.name}>
          {name || 'anonymous'}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  name: {
    flex: 1,
    fontSize: PV.Fonts.sizes.xl,
    fontWeight: PV.Fonts.weights.bold
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: PV.Table.cells.standard.height,
    paddingLeft: 8,
    paddingRight: 8
  }
})
