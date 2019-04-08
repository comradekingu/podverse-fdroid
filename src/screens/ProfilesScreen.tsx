import { TouchableOpacity } from 'react-native'
import React from 'reactn'
import { Text, View } from '../components'
import { PV } from '../resources'
import { button, core } from '../styles'

type Props = {
  navigation?: any
}

type State = {}

export class ProfilesScreen extends React.Component<Props, State> {

  static navigationOptions = {
    title: 'Profiles'
  }

  render() {
    const { globalTheme } = this.global

    return (
      <View style={core.view}>
        <Text>Profiles</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate(PV.RouteNames.ProfileScreen)}
          style={[button.primaryWrapper, globalTheme.buttonPrimaryWrapper]}>
          <Text style={globalTheme.buttonPrimaryText}>Go to Profile</Text>
        </TouchableOpacity>
      </View>
    )
  }
}