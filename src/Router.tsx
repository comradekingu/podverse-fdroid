import { Image, Platform, View } from 'react-native'
import Config from 'react-native-config'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator, NavigationStackOptions } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import React from 'reactn'
import { DownloadsActiveBadge, NavSearchIcon, PVTabBar, TabBarLabel } from './components'
import { PV } from './resources'
import {
  AboutScreen,
  AddPodcastByRSSScreen,
  AuthScreen,
  ClipsScreen,
  CryptoConsentScreen,
  CryptoPreviewScreen,
  CryptoSetupScreen,
  DownloadsScreen,
  EditPlaylistScreen,
  EditProfileScreen,
  EmailVerificationScreen,
  EpisodeMediaRefScreen,
  EpisodeScreen,
  EpisodesScreen,
  FAQScreen,
  FilterScreen,
  FundingScreen,
  HistoryScreen,
  MakeClipScreen,
  MembershipScreen,
  MoreScreen,
  MyLibraryScreen,
  OnboardingScreen,
  PlayerScreen,
  PlaylistsAddToScreen,
  PlaylistScreen,
  PlaylistsScreen,
  PodcastScreen,
  PodcastsScreen,
  PrivacyPolicyScreen,
  ProfileScreen,
  ProfilesScreen,
  QueueScreen,
  SearchScreen,
  SettingsScreen,
  SleepTimerScreen,
  TermsOfServiceScreen,
  LNPaySignupScreen,
  WebPageScreen
} from './screens'
import { darkTheme } from './styles'

const tabTestProps = (id: string) => {
  return { tabBarTestID: id, tabBarAccessibilityLabel: id }
}

const defaultNavigationOptions = ({ navigation }) => {
  return {
    headerStyle: { backgroundColor: PV.Colors.ink, shadowColor: 'transparent' },
    title: PV.Tabs.Podcasts.title,
    headerTintColor: darkTheme.text.color,
    headerTitleStyle: {
      fontWeight: 'bold'
    },
    headerRight: () => <NavSearchIcon navigation={navigation} />,
    // Prevent white screen flash on navigation on Android
    ...(Platform.OS === 'android' ? { animationEnabled: false } : {}),
    ...(Platform.OS === 'android' ? { backgroundColor: 'transparent' } : {})
  } as NavigationStackOptions
}

const AuthNavigator = createStackNavigator(
  {
    [PV.RouteNames.AuthScreen]: AuthScreen
  },
  {
    defaultNavigationOptions
  }
)

const PodcastsNavigator = createStackNavigator(
  {
    [PV.RouteNames.PodcastsScreen]: {
      screen: PodcastsScreen,
      path: PV.DeepLinks.Podcasts.path
    },
    [PV.RouteNames.PodcastScreen]: {
      screen: PodcastScreen,
      path: PV.DeepLinks.Podcast.path
    },
    [PV.RouteNames.EpisodeScreen]: {
      screen: EpisodeScreen,
      path: PV.DeepLinks.Episode.path
    },
    [PV.RouteNames.EpisodeMediaRefScreen]: {
      screen: EpisodeMediaRefScreen
    }
  },
  {
    defaultNavigationOptions,
    initialRouteName: PV.RouteNames.PodcastsScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }: { tintColor: any }) => (
        <Image source={PV.Tabs.Podcasts.icon} style={{ tintColor }} resizeMode={'contain'} />
      ),
      tabBarLabel: (props) => <TabBarLabel {...props} title={PV.Tabs.Podcasts.title} />,
      ...tabTestProps('tab_podcasts_screen')
    }
  }
)

const EpisodesNavigator = createStackNavigator(
  {
    [PV.RouteNames.EpisodesScreen]: EpisodesScreen,
    [PV.RouteNames.EpisodeScreen]: EpisodeScreen,
    [PV.RouteNames.EpisodeMediaRefScreen]: {
      screen: EpisodeMediaRefScreen
    }
  },
  {
    defaultNavigationOptions,
    navigationOptions: {
      tabBarIcon: ({ tintColor }: { tintColor: any }) => (
        <Image source={PV.Tabs.Episodes.icon} style={{ tintColor }} resizeMode={'contain'} />
      ),
      tabBarLabel: (props) => <TabBarLabel {...props} title={PV.Tabs.Episodes.title} />,
      ...tabTestProps('tab_episodes_screen')
    }
  }
)

const ClipsNavigator = createStackNavigator(
  {
    [PV.RouteNames.ClipsScreen]: ClipsScreen
  },
  {
    defaultNavigationOptions,
    navigationOptions: {
      tabBarIcon: ({ tintColor }: { tintColor: any }) =>
        <Image source={PV.Tabs.Clips.icon} style={{ tintColor }} resizeMode={'contain'} />,
      tabBarLabel: (props) => <TabBarLabel {...props} title={PV.Tabs.Clips.title} />,
      ...tabTestProps('tab_clips_screen')
    }
  }
)

const SearchNavigator = createStackNavigator(
  {
    [PV.RouteNames.SearchScreen]: { screen: SearchScreen, path: '' }
  },
  {
    defaultNavigationOptions
  }
)

const FilterNavigator = createStackNavigator(
  {
    [PV.RouteNames.FilterScreen]: { screen: FilterScreen, path: '' }
  },
  {
    defaultNavigationOptions
  }
)

const MoreNavigator = createStackNavigator(
  {
    [PV.RouteNames.MoreScreen]: MoreScreen,
    [PV.RouteNames.SettingsScreen]: SettingsScreen,
    [PV.RouteNames.MembershipScreen]: MembershipScreen,
    [PV.RouteNames.AboutScreen]: AboutScreen,
    [PV.RouteNames.TermsOfServiceScreen]: TermsOfServiceScreen,
    [PV.RouteNames.LNPaySignupScreen]: LNPaySignupScreen,
    [PV.RouteNames.PrivacyPolicyScreen]: PrivacyPolicyScreen,
    [PV.RouteNames.FAQScreen]: FAQScreen,
    [PV.RouteNames.CryptoSetupScreen]: CryptoSetupScreen
  },
  {
    defaultNavigationOptions,
    navigationOptions: {
      tabBarIcon: ({ tintColor }: { tintColor: any }) => {
        return (
          <View>
            <Image source={PV.Tabs.More.icon} style={{ tintColor }} resizeMode={'contain'} />
          </View>
        )
      },
      tabBarLabel: (props) => <TabBarLabel {...props} title='More' />,
      ...tabTestProps('tab_more_screen')
    }
  }
)

const MyLibraryNavigator = createStackNavigator(
  {
    [PV.RouteNames.MyLibraryScreen]: MyLibraryScreen,
    [PV.RouteNames.HistoryScreen]: HistoryScreen,
    [PV.RouteNames.DownloadsScreen]: DownloadsScreen,
    [PV.RouteNames.PlaylistScreen]: {
      screen: PlaylistScreen,
      path: PV.DeepLinks.Playlist.path
    },
    [PV.RouteNames.QueueScreen]: QueueScreen,
    [PV.RouteNames.MyProfileScreen]: ProfileScreen,
    [PV.RouteNames.EditProfileScreen]: EditProfileScreen,
    [PV.RouteNames.PlaylistsScreen]: {
      screen: PlaylistsScreen,
      path: PV.DeepLinks.Playlists.path
    },
    [PV.RouteNames.EditPlaylistScreen]: EditPlaylistScreen,
    [PV.RouteNames.ProfilesScreen]: {
      screen: ProfilesScreen,
      path: PV.DeepLinks.Profiles.path
    },
    [PV.RouteNames.ProfileScreen]: {
      screen: ProfileScreen,
      path: PV.DeepLinks.Profile.path
    }
  },
  {
    initialRouteName: PV.RouteNames.MyLibraryScreen,
    defaultNavigationOptions,
    navigationOptions: {
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }: { tintColor: any }) => {
        return (
          <View>
            <Image source={PV.Tabs.Queue.icon} style={{ tintColor }} resizeMode={'contain'} />
            <DownloadsActiveBadge />
          </View>
        )
      },
      tabBarLabel: (props) => <TabBarLabel {...props} title='My Library' />,
      ...tabTestProps('tab_my_library_screen')
    }
  }
)

const OnboardingNavigator = createStackNavigator(
  {
    [PV.RouteNames.OnboardingScreen]: OnboardingScreen,
    [PV.RouteNames.AuthNavigator]: AuthNavigator
  },
  {
    initialRouteName: PV.RouteNames.OnboardingScreen,
    mode: 'modal',
    headerMode: 'none'
  }
)

const allTabs = {
  Podcasts: { screen: PodcastsNavigator, path: '' },
  Episodes: EpisodesNavigator,
  'My Library': { screen: MyLibraryNavigator, path: '' },
  Clips: ClipsNavigator,
  More: { screen: MoreNavigator, path: PV.DeepLinks.Search.path }
}

const tabsList = Config.NAV_STACK_TABS.split(',')

const tabs = {}
tabsList.forEach((tabName: string) => {
  tabs[tabName] = allTabs[tabName]
})

const TabNavigator = createBottomTabNavigator(tabs, {
  tabBarComponent: (props: any) => <PVTabBar {...props} />
})

const PlayerNavigator = createStackNavigator(
  {
    [PV.RouteNames.PlayerScreen]: {
      screen: PlayerScreen,
      path: PV.DeepLinks.Clip.path
    },
    [PV.RouteNames.MakeClipScreen]: { screen: MakeClipScreen, navigationOptions: { gesturesEnabled: false } },
    [PV.RouteNames.QueueScreen]: QueueScreen,
    [PV.RouteNames.PlayerFAQScreen]: FAQScreen,
    [PV.RouteNames.PlayerMyProfileScreen]: ProfileScreen,
    [PV.RouteNames.PlayerMembershipScreen]: MembershipScreen
  },
  {
    defaultNavigationOptions
  }
)

const PlaylistsAddToNavigator = createStackNavigator(
  {
    [PV.RouteNames.PlaylistsAddToScreen]: PlaylistsAddToScreen
  },
  {
    defaultNavigationOptions
  }
)

const SleepTimerNavigator = createStackNavigator(
  {
    [PV.RouteNames.SleepTimerScreen]: SleepTimerScreen
  },
  {
    defaultNavigationOptions
  }
)

const WebPageNavigator = createStackNavigator(
  {
    [PV.RouteNames.WebPageScreen]: WebPageScreen
  },
  {
    defaultNavigationOptions
  }
)

const EmailVerificationNavigator = createStackNavigator(
  {
    [PV.RouteNames.EmailVerificationScreen]: EmailVerificationScreen
  },
  {
    defaultNavigationOptions
  }
)

const AddPodcastByRSSURLNavigator = createStackNavigator(
  {
    [PV.RouteNames.AddPodcastByRSSScreen]: {
      screen: AddPodcastByRSSScreen,
      path: PV.DeepLinks.AddByRSSPodcastFeedUrl.path
    }
  },
  {
    defaultNavigationOptions
  }
)

const FundingScreenNavigator = createStackNavigator(
  {
    [PV.RouteNames.FundingScreen]: {
      screen: FundingScreen
    },
  },
  {
    defaultNavigationOptions
  }
)

const CryptoOnboardingNavigator = createStackNavigator(
  {
    [PV.RouteNames.CryptoPreviewScreen]: {
      screen: CryptoPreviewScreen
    },
    [PV.RouteNames.CryptoConsentScreen]: {
      screen: CryptoConsentScreen
    }
  },
  {
    defaultNavigationOptions
  }
)

const MainApp = createStackNavigator(
  {
    [PV.RouteNames.TabNavigator]: { screen: TabNavigator, path: '' },
    [PV.RouteNames.AuthNavigator]: AuthNavigator,
    [PV.RouteNames.PlayerNavigator]: { screen: PlayerNavigator, path: '' },
    PlaylistsAddToNavigator,
    SearchNavigator,
    FilterNavigator,
    SleepTimerNavigator,
    WebPageNavigator,
    EmailVerificationNavigator,
    FundingScreenNavigator,
    [PV.RouteNames.AddPodcastByRSSScreen]: {
      screen: AddPodcastByRSSURLNavigator,
      path: ''
    },
    CryptoOnboardingNavigator
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

const SwitchNavigator = createSwitchNavigator(
  {
    MainApp: { screen: MainApp, path: '' },
    Onboarding: OnboardingNavigator
  },
  {
    initialRouteName: PV.RouteNames.MainApp
  }
)

const App = createAppContainer(SwitchNavigator)
const prefix = PV.DeepLinks.prefix

export default () => <App uriPrefix={prefix} />
