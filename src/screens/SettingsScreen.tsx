/* eslint-disable max-len */
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { Alert, StyleSheet } from 'react-native'
import Config from 'react-native-config'
import Dialog from 'react-native-dialog'
import RNPickerSelect from 'react-native-picker-select'
import React from 'reactn'
import {
  ActivityIndicator,
  Button,
  Divider,
  Icon,
  NumberSelectorWithText,
  ScrollView,
  SwitchWithText,
  Text,
  View
} from '../components'
import {
  setDownloadedEpisodeLimitGlobalCount,
  setDownloadedEpisodeLimitGlobalDefault,
  updateAllDownloadedEpisodeLimitCounts,
  updateAllDownloadedEpisodeLimitDefaults
} from '../lib/downloadedEpisodeLimiter'
import { removeAllDownloadedPodcasts } from '../lib/downloadedPodcast'
import { refreshDownloads } from '../lib/downloader'
import { translate } from '../lib/i18n'
import { PV } from '../resources'
import { deleteLoggedInUser } from '../services/user'
import { logoutUser } from '../state/actions/auth'
import * as DownloadState from '../state/actions/downloads'

import {
  saveCustomAPIDomain,
  saveCustomWebDomain,
  setCensorNSFWText,
  setCustomAPIDomainEnabled,
  setCustomWebDomainEnabled,
  setErrorReportingEnabled,
  setOfflineModeEnabled
} from '../state/actions/settings'
import { clearHistoryItems } from '../state/actions/userHistoryItem'
import { core, darkTheme, hidePickerIconOnAndroidTransparent, lightTheme } from '../styles'

type Props = {
  navigation: any
}

type State = {
  autoDeleteEpisodeOnEnd?: boolean
  deleteAccountDialogText: string
  deleteAccountDialogConfirmed?: boolean
  downloadedEpisodeLimitCount: any
  downloadedEpisodeLimitDefault: any
  downloadingWifiOnly?: boolean
  hasLoaded?: boolean
  isLoading?: boolean
  maximumSpeedOptionSelected?: any
  offlineModeEnabled: any
  showDeleteAccountDialog?: boolean
  showDeleteDownloadedEpisodesDialog?: boolean
  showSetAllDownloadDialog?: boolean
  showSetAllDownloadDialogIsCount?: boolean
}

const testIDPrefix = 'settings_screen'

export class SettingsScreen extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    const { downloadedEpisodeLimitCount, downloadedEpisodeLimitDefault, offlineModeEnabled } = this.global

    const maximumSpeedSelectOptions = PV.Player.maximumSpeedSelectOptions
    this.state = {
      deleteAccountDialogText: '',
      downloadedEpisodeLimitCount,
      downloadedEpisodeLimitDefault,
      maximumSpeedOptionSelected: maximumSpeedSelectOptions[1],
      offlineModeEnabled
    }
  }

  static navigationOptions = () => ({
    title: translate('Settings')
  })

  async componentDidMount() {
    const downloadingWifiOnly = await AsyncStorage.getItem(PV.Keys.DOWNLOADING_WIFI_ONLY)
    const autoDeleteEpisodeOnEnd = await AsyncStorage.getItem(PV.Keys.AUTO_DELETE_EPISODE_ON_END)
    const downloadedEpisodeLimitCount = await AsyncStorage.getItem(PV.Keys.DOWNLOADED_EPISODE_LIMIT_GLOBAL_COUNT)
    const downloadedEpisodeLimitDefault = await AsyncStorage.getItem(PV.Keys.DOWNLOADED_EPISODE_LIMIT_GLOBAL_DEFAULT)
    const maximumSpeed = await AsyncStorage.getItem(PV.Keys.PLAYER_MAXIMUM_SPEED)
    const maximumSpeedSelectOptions = PV.Player.maximumSpeedSelectOptions
    const maximumSpeedOptionSelected = maximumSpeedSelectOptions.find((x: any) => x.value === Number(maximumSpeed))
    const offlineModeEnabled = await AsyncStorage.getItem(PV.Keys.OFFLINE_MODE_ENABLED)
    

    this.setState(
      {
        autoDeleteEpisodeOnEnd: !!autoDeleteEpisodeOnEnd,
        downloadedEpisodeLimitCount,
        downloadedEpisodeLimitDefault,
        downloadingWifiOnly: !!downloadingWifiOnly,
        maximumSpeedOptionSelected: maximumSpeedOptionSelected || maximumSpeedSelectOptions[1],
        offlineModeEnabled
      },
      () => this.setState({ hasLoaded: true })
    )
  }

  _toggleTheme = async () => {
    const darkModeEnabled = await AsyncStorage.getItem(PV.Keys.DARK_MODE_ENABLED)
    const newDarkModeSetting = darkModeEnabled === 'TRUE'
    this.setGlobal({ globalTheme: !newDarkModeSetting ? darkTheme : lightTheme }, async () => {
      !newDarkModeSetting
        ? await AsyncStorage.setItem(PV.Keys.DARK_MODE_ENABLED, 'TRUE')
        : await AsyncStorage.setItem(PV.Keys.DARK_MODE_ENABLED, 'FALSE')
    })
  }

  _toggleDownloadingWifiOnly = async () => {
    const downloadingWifiOnly = await AsyncStorage.getItem(PV.Keys.DOWNLOADING_WIFI_ONLY)
    const newValue = downloadingWifiOnly !== 'TRUE'

    NetInfo.fetch().then((state) => {
      if (!newValue && state.type === 'cellular') {
        refreshDownloads()
      }
    })

    this.setState({ downloadingWifiOnly: newValue }, () => {
      (async () => {
        newValue
          ? await AsyncStorage.setItem(PV.Keys.DOWNLOADING_WIFI_ONLY, 'TRUE')
          : await AsyncStorage.removeItem(PV.Keys.DOWNLOADING_WIFI_ONLY)
      })()
    })
  }

  _toggleAutoDeleteEpisodeOnEnd = (value: boolean) => {
    this.setState({ autoDeleteEpisodeOnEnd: value }, () => {
      (async () => {
        value
          ? await AsyncStorage.setItem(PV.Keys.AUTO_DELETE_EPISODE_ON_END, 'TRUE')
          : await AsyncStorage.removeItem(PV.Keys.AUTO_DELETE_EPISODE_ON_END)
      })()
    })
  }

  _setMaximumSpeed = (value: string) => {
    const maximumSpeedSelectOptions = PV.Player.maximumSpeedSelectOptions
    const maximumSpeedOptionSelected = maximumSpeedSelectOptions.find((x: any) => x.value === value) || placeholderItem
    this.setState({ maximumSpeedOptionSelected }, () => {
      (async () => {
        value
          ? await AsyncStorage.setItem(PV.Keys.PLAYER_MAXIMUM_SPEED, value.toString())
          : await AsyncStorage.removeItem(PV.Keys.PLAYER_MAXIMUM_SPEED)
      })()
    })
  }

  _handleChangeDownloadedEpisodeLimitCountText = (value: number) => {
    this.setState({ downloadedEpisodeLimitCount: value })
  }

  _handleSetGlobalDownloadedEpisodeLimitCount = async () => {
    const { downloadedEpisodeLimitCount } = this.state
    await setDownloadedEpisodeLimitGlobalCount(downloadedEpisodeLimitCount)
    this._handleToggleSetAllDownloadDialog(true)
    this.setGlobal({ downloadedEpisodeLimitCount })
  }

  _handleSelectDownloadedEpisodeLimitDefault = () => {
    const newDownloadedEpisodeLimitDefault = !this.state.downloadedEpisodeLimitDefault
    this.setState({ downloadedEpisodeLimitDefault: newDownloadedEpisodeLimitDefault }, () => {
      (async () => {
        await setDownloadedEpisodeLimitGlobalDefault(newDownloadedEpisodeLimitDefault)
        this._handleToggleSetAllDownloadDialog()
        this.setGlobal({ downloadedEpisodeLimitDefault: newDownloadedEpisodeLimitDefault })
      })()
    })
  }

  _handleToggleSetAllDownloadDialog = (isCount?: boolean) => {
    this.setState({
      showSetAllDownloadDialog: !this.state.showSetAllDownloadDialog,
      showSetAllDownloadDialogIsCount: isCount
    })
  }

  _handleUpdateAllDownloadedEpiosdeLimitCount = async () => {
    await updateAllDownloadedEpisodeLimitCounts(this.state.downloadedEpisodeLimitCount)
    this.setState({ showSetAllDownloadDialog: false })
  }

  _handleUpdateAllDownloadedEpiosdeLimitDefault = async () => {
    await updateAllDownloadedEpisodeLimitDefaults(this.state.downloadedEpisodeLimitDefault)
    this.setState({ showSetAllDownloadDialog: false })
  }

  _handleToggleNSFWText = async () => {
    const censorNSFWText = await AsyncStorage.getItem(PV.Keys.CENSOR_NSFW_TEXT)
    setCensorNSFWText(!censorNSFWText)
  }

  _handleToggleErrorReporting = async () => {
    const errorReportingEnabled = await AsyncStorage.getItem(PV.Keys.ERROR_REPORTING_ENABLED)
    setErrorReportingEnabled(!errorReportingEnabled)
  }

  _handleToggleOfflineMode = () => {
    const { offlineModeEnabled } = this.state
    this.setState({ offlineModeEnabled: !offlineModeEnabled }, () => {
      setOfflineModeEnabled(!offlineModeEnabled)
    })
    this.setGlobal({ offlineModeEnabled: !offlineModeEnabled })
  }

  _handleCustomAPIDomainToggle = () => {
    const { customAPIDomainEnabled } = this.global
    setCustomAPIDomainEnabled(!customAPIDomainEnabled)
  }

  _handleCustomAPIDomainDialogSave = async () => {
    const { customAPIDomain } = this.global
    await saveCustomAPIDomain(customAPIDomain)
  }

  _handleCustomWebDomainToggle = () => {
    const { customWebDomainEnabled } = this.global
    setCustomWebDomainEnabled(!customWebDomainEnabled)
  }

  _handleCustomWebDomainDialogTextChange = async (text: string) => this.setGlobal({ customWebDomain: text })

  _handleCustomWebDomainDialogSave = async () => {
    const { customWebDomain } = this.global
    await saveCustomWebDomain(customWebDomain)
  }

  _handleClearHistory = () => {
    Alert.alert(translate('Clear History'), translate('Are you sure you want to clear your history'), [
      {
        text: translate('Cancel'),
        style: translate('cancel')
      },
      {
        text: translate('Yes'),
        onPress: () => {
          this.setState(
            {
              isLoading: true
            },
            () => {
              (async () => {
                try {
                  await clearHistoryItems()
                  this.setState({ isLoading: false })
                } catch (error) {
                  this.setState({ isLoading: false })
                }
              })()
            }
          )
        }
      }
    ])
  }

  _handleToggleDeleteDownloadedEpisodesDialog = () => {
    this.setState({
      showDeleteDownloadedEpisodesDialog: !this.state.showDeleteDownloadedEpisodesDialog
    })
  }

  _handleDeleteDownloadedEpisodes = () => {
    this.setState(
      {
        isLoading: true,
        showDeleteDownloadedEpisodesDialog: false
      },
      () => {
        (async () => {
          try {
            await removeAllDownloadedPodcasts()
          } catch (error) {
            //
          }
          DownloadState.updateDownloadedPodcasts()
          this.setState({ isLoading: false })
        })()
      }
    )
  }

  _handleToggleDeleteAccountDialog = () => {
    this.setState({
      deleteAccountDialogText: '',
      deleteAccountDialogConfirmed: false,
      showDeleteAccountDialog: !this.state.showDeleteAccountDialog
    })
  }

  _handleDeleteAccountDialogTextChange = (text: string) => {
    this.setState({
      deleteAccountDialogConfirmed: !!text && text.toUpperCase() === translate('DELETE'),
      deleteAccountDialogText: text
    })
  }

  _handleDeleteAccount = async () => {
    const { deleteAccountDialogText } = this.state

    try {
      if (deleteAccountDialogText && deleteAccountDialogText.toUpperCase() === translate('DELETE')) {
        await deleteLoggedInUser()
        await logoutUser()
        this.setState({ showDeleteAccountDialog: false })
      }
    } catch (error) {
      this.setState({ showDeleteAccountDialog: false }, () => {
        setTimeout(() => {
          Alert.alert(
            PV.Alerts.SOMETHING_WENT_WRONG.title,
            PV.Alerts.SOMETHING_WENT_WRONG.message,
            PV.Alerts.BUTTONS.OK
          )
        }, 1500)
      })
    }
  }

  render() {
    const {
      deleteAccountDialogConfirmed,
      deleteAccountDialogText,
      downloadedEpisodeLimitCount,
      downloadedEpisodeLimitDefault,
      downloadingWifiOnly,
      isLoading,
      maximumSpeedOptionSelected,
      offlineModeEnabled,
      showDeleteAccountDialog,
      showSetAllDownloadDialog,
      showSetAllDownloadDialogIsCount,
      showDeleteDownloadedEpisodesDialog
    } = this.state
    const {
      censorNSFWText,
      customAPIDomain,
      customAPIDomainEnabled,
      customWebDomain,
      customWebDomainEnabled,
      errorReportingEnabled,
      globalTheme,
      session
    } = this.global
    const { isLoggedIn } = session

    const isDarkMode = globalTheme === darkTheme

    return (
      <ScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        style={styles.wrapper}
        testID={`${testIDPrefix}_view`}>
        {isLoading && <ActivityIndicator fillSpace testID={testIDPrefix} />}
        {!isLoading && (
          <View>
            <View style={styles.itemWrapper}>
              <SwitchWithText
                accessibilityHint={translate('Offline mode can save battery life and improve performance')}
                accessibilityLabel={translate('Offline Mode')}
                onValueChange={this._handleToggleOfflineMode}
                subText={translate('Offline mode can save battery life and improve performance')}
                testID={`${testIDPrefix}_offline_mode`}
                text={translate('Offline Mode')}
                value={!!offlineModeEnabled}
              />
            </View>
            <Divider style={styles.divider} />
            {!Config.DISABLE_CRASH_LOGS && (
              <View>
                <View style={styles.itemWrapper}>
                  <SwitchWithText
                    accessibilityHint={translate('Error Reporting subtext')}
                    accessibilityLabel={errorReportingEnabled
                      ? translate('Error Reporting Enabled') : translate('Error Reporting Disabled')}
                    onValueChange={this._handleToggleErrorReporting}
                    subText={translate('Error Reporting subtext')}
                    testID={`${testIDPrefix}_error_reporting`}
                    text={errorReportingEnabled
                      ? translate('Error Reporting Enabled') : translate('Error Reporting Disabled')}
                    value={!!errorReportingEnabled}
                  />
                </View>
                <Divider style={styles.divider} />
              </View>
            )}
            {!Config.DISABLE_THEME_SWITCH && (
              <View style={styles.itemWrapper}>
                <SwitchWithText
                  accessible={false}
                  accessibilityHint={translate('ARIA HINT - change the colors of the user interface')}
                  accessibilityLabel={`${globalTheme === darkTheme ? translate('Dark Mode') : translate('Light Mode')}`}
                  onValueChange={this._toggleTheme}
                  testID={`${testIDPrefix}_dark_mode`}
                  text={`${globalTheme === darkTheme ? translate('Dark Mode') : translate('Light Mode')}`}
                  value={globalTheme === darkTheme}
                />
              </View>
            )}
            <View style={styles.itemWrapper}>
              <SwitchWithText
                onValueChange={this._toggleDownloadingWifiOnly}
                accessibilityLabel={translate('Only allow downloading episodes when connected to Wifi')}
                testID={`${testIDPrefix}_only_allow_downloading_when_connected_to_wifi`}
                text={translate('Only allow downloading episodes when connected to Wifi')}
                value={!!downloadingWifiOnly}
              />
            </View>
            <View style={styles.itemWrapper}>
              <SwitchWithText
                accessibilityLabel={translate('Censor NSFW text')}
                onValueChange={this._handleToggleNSFWText}
                testID={`${testIDPrefix}_censor_nsfw_text`}
                text={translate('Censor NSFW text')}
                value={!!censorNSFWText}
              />
            </View>
            <View style={styles.itemWrapperReducedHeight}>
              <RNPickerSelect
                fixAndroidTouchableBug
                items={PV.Player.maximumSpeedSelectOptions}
                onValueChange={this._setMaximumSpeed}
                placeholder={placeholderItem}
                style={hidePickerIconOnAndroidTransparent(isDarkMode)}
                useNativeAndroidPickerStyle={false}
                value={maximumSpeedOptionSelected.value}>
                <View
                  accessible
                  accessibilityHint={`${translate('ARIA HINT - Max playback speed')}`}
                  accessibilityLabel={`${translate('Max playback speed')} ${maximumSpeedOptionSelected.label}`}
                  importantForAccessibility='yes'
                  style={core.selectorWrapper}>
                  <View
                    accessible={false}
                    importantForAccessibility='no-hide-descendants'
                    style={core.selectorWrapperLeft}>
                    <Text fontSizeLargestScale={PV.Fonts.largeSizes.md} style={[styles.pickerSelect, globalTheme.text]}>
                      {maximumSpeedOptionSelected.label}
                    </Text>
                    <Icon name='angle-down' size={14} style={[styles.pickerSelectIcon, globalTheme.text]} />
                  </View>
                  <View
                    accessible={false}
                    importantForAccessibility='no-hide-descendants'
                    style={core.selectorWrapperRight}>
                    <Text
                      fontSizeLargestScale={PV.Fonts.largeSizes.md}
                      style={[styles.pickerSelect, globalTheme.text]}>
                      {translate('Max playback speed')}
                    </Text>
                  </View>
                </View>
              </RNPickerSelect>
            </View>
            {/* <SwitchWithText
              onValueChange={this._toggleAutoDeleteEpisodeOnEnd}
              text='Delete downloaded episodes after end is reached'
              value={!!autoDeleteEpisodeOnEnd} /> */}
            <View style={styles.itemWrapper}>
              <SwitchWithText
                accessibilityLabel={translate('Limit the number of downloaded episodes for each podcast by default')}
                onValueChange={this._handleSelectDownloadedEpisodeLimitDefault}
                testID={`${testIDPrefix}_limit_the_number_of_downloaded_episodes`}
                text={translate('Limit the number of downloaded episodes for each podcast by default')}
                value={!!downloadedEpisodeLimitDefault}
              />
            </View>
            <View style={styles.itemWrapper}>
              <NumberSelectorWithText
                // eslint-disable-next-line max-len
                accessibilityHint={translate('ARIA HINT - set the maximum number of downloaded episodes to save from each podcast on your device')}
                // eslint-disable-next-line max-len
                accessibilityLabel={`${translate('Default downloaded episode limit for each podcast')}`}
                handleChangeText={this._handleChangeDownloadedEpisodeLimitCountText}
                handleSubmitEditing={this._handleSetGlobalDownloadedEpisodeLimitCount}
                selectedNumber={downloadedEpisodeLimitCount}
                testID={`${testIDPrefix}_default_downloaded_episode_limit`}
                text={translate('Default downloaded episode limit for each podcast')}
              />
            </View>
            {!Config.DISABLE_CUSTOM_DOMAINS && (
              <View>
                <Divider style={styles.divider} />
                <View style={styles.itemWrapper}>
                  <SwitchWithText
                    accessibilityHint={translate('Custom web domain subtext')}
                    accessibilityLabel={translate('Use custom API domain')}
                    inputAutoCorrect={false}
                    inputEditable={customAPIDomainEnabled}
                    inputEyebrowTitle={translate('Custom API domain')}
                    inputHandleBlur={this._handleCustomAPIDomainDialogSave}
                    inputHandleSubmit={this._handleCustomAPIDomainDialogSave}
                    inputHandleTextChange={(text?: string) => this.setGlobal({ customAPIDomain: text })}
                    inputPlaceholder={PV.URLs.apiDefaultBaseUrl}
                    inputShow={customAPIDomainEnabled}
                    inputText={customAPIDomain}
                    onValueChange={this._handleCustomAPIDomainToggle}
                    text={translate('Use custom API domain')}
                    testID={`${testIDPrefix}_custom_api_domain`}
                    value={!!customAPIDomainEnabled}
                  />
                </View>
                <View style={styles.itemWrapper}>
                  <SwitchWithText
                    accessibilityHint={translate('Custom web domain subtext')}
                    accessibilityLabel={translate('Use custom web domain')}
                    inputAutoCorrect={false}
                    inputEditable={customWebDomainEnabled}
                    inputEyebrowTitle={translate('Custom web domain')}
                    inputHandleBlur={this._handleCustomWebDomainDialogSave}
                    inputHandleSubmit={this._handleCustomWebDomainDialogSave}
                    inputHandleTextChange={(text?: string) => this.setGlobal({ customWebDomain: text })}
                    inputPlaceholder={PV.URLs.webDefaultBaseUrl}
                    inputShow={customWebDomainEnabled}
                    inputText={customWebDomain}
                    onValueChange={this._handleCustomWebDomainToggle}
                    subText={translate('Custom web domain subtext')}
                    testID={`${testIDPrefix}_custom_web_domain`}
                    text={translate('Use custom web domain')}
                    value={!!customWebDomainEnabled}
                  />
                </View>
              </View>
            )}
            <Divider style={styles.divider} />
            <Button
              accessibilityLabel={translate('Clear History')}
              onPress={this._handleClearHistory}
              testID={`${testIDPrefix}_clear_history`}
              text={translate('Clear History')}
              wrapperStyles={styles.button}
            />
            <Button
              accessibilityLabel={translate('Delete Downloaded Episodes')}
              onPress={this._handleToggleDeleteDownloadedEpisodesDialog}
              testID={`${testIDPrefix}_delete_downloaded_episodes`}
              text={translate('Delete Downloaded Episodes')}
              wrapperStyles={styles.button}
            />
            {isLoggedIn && (
              <Button
                accessibilityLabel={translate('Delete Account')}
                isWarning
                onPress={this._handleToggleDeleteAccountDialog}
                testID={`${testIDPrefix}_delete_account`}
                text={translate('Delete Account')}
                wrapperStyles={styles.button}
              />
            )}
          </View>
        )}
        <Dialog.Container visible={showSetAllDownloadDialog}>
          <Dialog.Title>{translate('Global Update')}</Dialog.Title>
          <Dialog.Description>
            {translate('Do you want to update the download limit for all of your currently subscribed podcasts')}
          </Dialog.Description>
          <Dialog.Button
            label={translate('No')}
            onPress={this._handleToggleSetAllDownloadDialog}
            {...(testIDPrefix ? { testID: `${testIDPrefix}_dialog_update_download_limit_no_button`.prependTestId() } : {})}
          />
          <Dialog.Button
            label={translate('Yes')}
            onPress={
              showSetAllDownloadDialogIsCount
                ? this._handleUpdateAllDownloadedEpiosdeLimitCount
                : this._handleUpdateAllDownloadedEpiosdeLimitDefault
            }
            {...(testIDPrefix ? { testID: `${testIDPrefix}_dialog_update_download_limit_yes_button`.prependTestId() } : {})}
          />
        </Dialog.Container>

        <Dialog.Container visible={showDeleteDownloadedEpisodesDialog}>
          <Dialog.Title>{translate('Delete All Downloaded Episodes')}</Dialog.Title>
          <Dialog.Description>
            {translate('Are you sure you want to delete all of your downloaded episodes')}
          </Dialog.Description>
          <Dialog.Button
            label={translate('No')}
            onPress={this._handleToggleDeleteDownloadedEpisodesDialog}
            {...(testIDPrefix ? { testID: `${testIDPrefix}_dialog_delete_downloaded_episodes_no`.prependTestId() } : {})}
          />
          <Dialog.Button
            label={translate('Yes')}
            onPress={this._handleDeleteDownloadedEpisodes}
            {...(testIDPrefix ? { testID: `${testIDPrefix}_dialog_delete_downloaded_episodes_yes`.prependTestId() } : {})}
          />
        </Dialog.Container>

        <Dialog.Container visible={showDeleteAccountDialog}>
          <Dialog.Title>{translate('Delete Account')}</Dialog.Title>
          <Dialog.Description>{translate('Are you sure you want to delete your account')}</Dialog.Description>
          <Dialog.Description>{translate('Type DELETE in the input below to confirm')}</Dialog.Description>
          <Dialog.Input
            onChangeText={this._handleDeleteAccountDialogTextChange}
            placeholder=''
            {...(testIDPrefix ? { testID: `${testIDPrefix}_dialog_delete_account_input`.prependTestId() } : {})}
            value={deleteAccountDialogText}
          />
          <Dialog.Button
            label={translate('Cancel')}
            onPress={this._handleToggleDeleteAccountDialog}
            {...(testIDPrefix ? { testID: `${testIDPrefix}_dialog_delete_account_cancel`.prependTestId() } : {})}
          />
          <Dialog.Button
            bold={deleteAccountDialogConfirmed}
            color={deleteAccountDialogConfirmed ? PV.Colors.redDarker : PV.Colors.grayDark}
            disabled={!deleteAccountDialogConfirmed}
            label={translate('Delete')}
            onPress={this._handleDeleteAccount}
            {...(testIDPrefix ? { testID: `${testIDPrefix}_dialog_delete_account_delete`.prependTestId() } : {})}
          />
        </Dialog.Container>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
    paddingTop: 40
  },
  button: {
    marginHorizontal: 12,
    marginBottom: 24,
    marginTop: 0,
    borderRadius: 8
  },
  divider: {
    marginBottom: 24
  },
  itemWrapper: {
    marginBottom: 24
  },
  itemWrapperReducedHeight: {
    marginTop: -4,
    marginBottom: 16
  },
  pickerSelect: {
    flex: 0,
    fontSize: PV.Fonts.sizes.xl,
    fontWeight: PV.Fonts.weights.bold,
    marginVertical: 14
  },
  pickerSelectIcon: {
    flex: 0,
    paddingHorizontal: 4
  },
  scrollViewContentContainer: {
    paddingBottom: 48
  },
  textInputWrapper: {
    marginVertical: 20
  },
  wrapper: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 12
  }
})

const placeholderItem = {
  label: 'Select',
  value: null
}
