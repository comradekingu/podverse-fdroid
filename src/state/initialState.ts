import { PV } from '../resources'
import { InitialState } from '../resources/Interfaces'

const initialTheme: InitialState = {
  globalTheme: {},
  fontScale: 1,
  fontScaleMode: null,
  autoDownloadSettings: {},
  downloadsArray: [],
  downloadsActive: {},
  downloadedEpisodeIds: {},
  downloadedEpisodeLimitCount: 5,
  downloadedEpisodeLimitDefault: null,
  downloadedPodcastEpisodeCounts: {},
  downloadedPodcasts: [],
  censorNSFWText: true,
  customAPIDomain: '',
  customAPIDomainEnabled: false,
  customWebDomain: '',
  customWebDomainEnabled: false,
  offlineModeEnabled: false,
  overlayAlert: {
    shouldShowAlert: false
  },
  parser: {
    addByRSSPodcastAuthModal: {
      feedUrl: ''
    }
  },
  player: {
    currentChapter: null,
    currentChapters: [],
    hasErrored: false,
    isPlaying: false,
    nowPlayingItem: null,
    playbackRate: 1,
    shouldContinuouslyPlay: false,
    showMakeClip: false,
    showMiniPlayer: false,
    sleepTimer: {
      defaultTimeRemaining: PV.Player.defaultSleepTimerInSeconds,
      isActive: false,
      timeRemaining: PV.Player.defaultSleepTimerInSeconds
    }
  },
  playlists: {
    myPlaylists: [],
    subscribedPlaylists: []
  },
  profile: {
    flatListData: [],
    user: null
  },
  profiles: {
    flatListData: [],
    flatListDataTotalCount: null
  },
  purchase: {
    isLoading: true,
    message: '',
    productId: '',
    purchaseToken: '',
    showContactSupportLink: false,
    showDismissLink: false,
    showRetryLink: false,
    title: '',
    transactionId: '',
    transactionReceipt: ''
  },
  screenPlayer: {
    endOfResultsReached: false,
    flatListData: [],
    flatListDataTotalCount: null,
    isLoading: false,
    isLoadingMore: false,
    isQuerying: false,
    queryFrom: PV.Filters._fromThisEpisodeKey,
    queryPage: 1,
    querySort: PV.Filters._topPastWeek,
    selectedFromLabel: '',
    showFullClipInfo: false,
    showHeaderActionSheet: false,
    showMoreActionSheet: false,
    showNoInternetConnectionMessage: false,
    showShareActionSheet: false
  },
  screenPlaylist: {
    flatListData: [],
    flatListDataTotalCount: null,
    playlist: null
  },
  session: {
    userInfo: {
      addByRSSPodcastFeedUrls: [],
      email: '',
      freeTrialExpiration: '',
      historyItems: [],
      id: '',
      membershipExpiration: '',
      name: '',
      playlists: [],
      queueItems: [],
      subscribedPlaylistIds: [],
      subscribedPodcastIds: [],
      subscribedUserIds: []
    },
    isLoggedIn: false
  },
  subscribedPodcasts: [],
  subscribedPodcastsTotalCount: 0,
  urlsAPI: null,
  urlsWeb: null,
  userAgent: ''
}

export default initialTheme
