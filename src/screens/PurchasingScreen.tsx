import { Linking, Platform, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'reactn'
import { ActivityIndicator, SafeAreaView, Text, View } from '../components'
import { createEmailLinkUrl } from '../lib/utility'
import { PV } from '../resources'
import { gaTrackPageView } from '../services/googleAnalytics'
import { androidHandleStatusCheck } from '../state/actions/purchase.android'
import { iosHandlePurchaseStatusCheck } from '../state/actions/purchase.ios'

type Props = {
  navigation?: any
}

type State = {}

export class PurchasingScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: 'Processing',
    headerRight: null
  }

  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    gaTrackPageView('/purchasing', 'Purchasing Screen')
  }

  _handleContactSupportPress = async () => {
    const subject = 'Podverse Checkout Issue'
    const body = "Please explain your issue below and we'll get back to you as soon as we can:"
    const emailLinkUrl = createEmailLinkUrl(PV.Emails.SUPPORT, subject, body)
    Linking.openURL(emailLinkUrl)
  }

  _handleRetryProcessing = async () => {
    const purchase = this.global.purchase || {}
    const { productId, purchaseToken, transactionId, transactionReceipt } = purchase
    if (Platform.OS === 'android') {
      await androidHandleStatusCheck(productId, transactionId, purchaseToken)
    } else if (Platform.OS === 'ios') {
      await iosHandlePurchaseStatusCheck(productId, transactionId, transactionReceipt)
    }
  }

  _handleDismiss = async () => {
    this.props.navigation.dismiss()
  }

  render() {
    const { globalTheme, purchase } = this.global
    const { isLoading, message, showContactSupportLink, showDismissLink, showRetryLink, title } = purchase

    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.view}>
          <Text style={[globalTheme.text, styles.title]}>{title}</Text>
          {!!isLoading && <ActivityIndicator styles={styles.activityIndicator} />}
          {!!message && <Text style={[globalTheme.text, styles.message]}>{message}</Text>}
          {!isLoading && showRetryLink && (
            <TouchableOpacity onPress={this._handleRetryProcessing}>
              <Text style={[globalTheme.text, styles.button]}>Retry</Text>
            </TouchableOpacity>
          )}
          {!isLoading && showContactSupportLink && (
            <TouchableOpacity onPress={this._handleContactSupportPress}>
              <Text style={[globalTheme.text, styles.button]}>Contact Support</Text>
            </TouchableOpacity>
          )}
          {!isLoading && showDismissLink && (
            <TouchableOpacity onPress={this._handleDismiss}>
              <Text style={[globalTheme.text, styles.button]}>Close</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
    backgroundColor: 'transparent',
    flex: 0,
    marginVertical: 16
  },
  button: {
    fontSize: PV.Fonts.sizes.xl,
    textDecorationLine: 'underline',
    fontWeight: PV.Fonts.weights.bold,
    minHeight: 44,
    marginHorizontal: 16,
    marginVertical: 12
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 8
  },
  message: {
    fontSize: PV.Fonts.sizes.lg,
    marginHorizontal: 16,
    marginVertical: 16,
    textAlign: 'center'
  },
  safeAreaView: {
    backgroundColor: PV.Colors.brandColor
  },
  title: {
    fontSize: PV.Fonts.sizes.xl,
    fontWeight: PV.Fonts.weights.bold,
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: -22,
    textAlign: 'center'
  },
  view: {
    alignItems: 'center',
    backgroundColor: PV.Colors.brandColor,
    flex: 1,
    justifyContent: 'center'
  }
})
