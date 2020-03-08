import { Alert, Linking, StyleSheet } from 'react-native'
import React from 'reactn'
import packageJson from '../../package.json'
import { Divider, ScrollView, Text, View } from '../components'
import { PV } from '../resources'
import { gaTrackPageView } from '../services/googleAnalytics'

type Props = {}

type State = {}

export class TermsOfServiceScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: 'Terms of Service'
  }

  componentDidMount() {
    gaTrackPageView('/terms', 'Terms of Service Screen')
  }

  showLeavingAppAlert = (url: string) => {
    Alert.alert(PV.Alerts.LEAVING_APP.title, PV.Alerts.LEAVING_APP.message, [
      { text: 'Cancel' },
      { text: 'Yes', onPress: () => Linking.openURL(url) }
    ])
  }

  render() {
    return (
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text fontSizeLargestScale={PV.Fonts.largeSizes.md} style={styles.text}>
            Podverse will never sell or share private user data.
            {'\n\n'}
            We will never put advertisements next to or within a podcast's content without that podcast's permission.
            {'\n\n'}
            All audio files found on podverse.fm load from the podcaster's own public server. We do not host podcast
            audio files ourselves.
            {'\n\n'}
            All clips hosted on podverse.fm are crowd-sourced and unofficial, unless otherwise noted by the podcaster.
            {'\n\n'}
            Clips load within the full episode's media file, so the user always has access to the full recording.
            {'\n\n'}
            We host podcast links and content from third-party podcast feeds and sites. These have their own independent
            privacy policies, and we have no responsibility for their content or activities.
          </Text>
          <Divider style={styles.divider} />
          <Text fontSizeLargestScale={PV.Fonts.largeSizes.md} style={styles.sectionTitle}>
            Third Party Libraries
          </Text>
          {Object.keys(packageJson.dependencies).map((license) => {
            return (
              <Text key={license} style={styles.text}>
                {license}
              </Text>
            )
          })}
          <Divider style={styles.divider} />
          <Text
            style={styles.copyRight}
            onPress={() => this.showLeavingAppAlert('https://www.gnu.org/licenses/agpl-3.0.en.html')}>
            copyleft ©
          </Text>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  divider: {
    marginVertical: 24
  },
  scrollViewContent: {
    padding: 15
  },
  sectionTitle: {
    marginBottom: 15,
    fontSize: PV.Fonts.sizes.xl,
    fontWeight: PV.Fonts.weights.bold
  },
  copyRight: {
    marginBottom: 15,
    fontSize: PV.Fonts.sizes.xl,
    fontWeight: PV.Fonts.weights.bold
  },
  text: {
    fontSize: PV.Fonts.sizes.md
  }
})
