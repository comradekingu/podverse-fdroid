import debounce from 'lodash/debounce'
import { Alert, Linking, StyleSheet } from 'react-native'
import Config from 'react-native-config'
import React from 'reactn'
import {
  ActionSheet,
  ActivityIndicator,
  ButtonGroup,
  Divider,
  FlatList,
  NavDismissIcon,
  PodcastTableCell,
  SearchBar,
  View
} from '../components'
import { translate } from '../lib/i18n'
import { navigateToPodcastScreenWithPodcast } from '../lib/navigate'
import { alertIfNoNetworkConnection } from '../lib/network'
import { isOdd, safelyUnwrapNestedVariable, testProps } from '../lib/utility'
import { PV } from '../resources'
import { getPodcasts } from '../services/podcast'
import { toggleSubscribeToPodcast } from '../state/actions/podcast'

const { _episodesKey, _clipsKey } = PV.Filters

type Props = {
  navigation?: any
}

type State = {
  endOfResultsReached?: boolean
  flatListData: any[]
  flatListDataTotalCount: number | null
  isLoading?: boolean
  isLoadingMore?: boolean
  queryPage: number
  searchBarText: string
  searchType: number
  selectedPodcast?: any
  showActionSheet: boolean
}

const testIDPrefix = 'search_screen'

export class SearchScreen extends React.Component<Props, State> {

  searchBarInput: any

  constructor(props: Props) {
    super(props)

    this.state = {
      endOfResultsReached: false,
      flatListData: [],
      flatListDataTotalCount: null,
      isLoading: false,
      isLoadingMore: false,
      queryPage: 1,
      searchBarText: '',
      searchType: 0,
      showActionSheet: false
    }

    this._handleSearchBarTextQuery = debounce(this._handleSearchBarTextQuery, PV.SearchBar.textInputDebounceTime)
  }

  static navigationOptions = ({ navigation }) => ({
    title: translate('Search'),
    headerLeft: () => <NavDismissIcon handlePress={navigation.dismiss} testID={testIDPrefix} />,
    headerRight: () => null
  })

  componentDidMount() {
    this.searchBarInput.focus()
  }

  _handleSearchBarClear = () => {
    this.setState({
      flatListData: [],
      flatListDataTotalCount: null,
      searchBarText: ''
    })
  }

  _handleSearchBarTextChange = (text: string) => {
    const shouldSearch = !!text && text.length > 1
    this.setState(
      {
        searchBarText: text,
        isLoading: shouldSearch
      },
      () => {
        this._handleSearchBarTextQuery()
      }
    )
  }

  _handleSearchBarTextQuery = (nextPage?: boolean) => {
    const shouldSearch = !!this.state.searchBarText && this.state.searchBarText.length > 1

    this.setState(
      {
        flatListData: [],
        flatListDataTotalCount: null,
        queryPage: 1,
        isLoading: shouldSearch
      },
      () => {
        (async () => {
          if (shouldSearch) {
            const state = await this._queryData(nextPage)
            this.setState(state)
          }
        })()
      }
    )
  }

  _ItemSeparatorComponent = () => <Divider />

  _onEndReached = ({ distanceFromEnd }) => {
    const { endOfResultsReached, isLoadingMore } = this.state
    if (!endOfResultsReached && !isLoadingMore) {
      if (distanceFromEnd > -1) {
        this.setState(
          {
            isLoadingMore: true
          },
          () => {
            (async () => {
              const newState = await this._queryData(true)
              this.setState(newState)
            })()
          }
        )
      }
    }
  }

  _handleSearchTypePress = (index) => this.setState({ searchType: index })

  _handleCancelPress = () => this.setState({ showActionSheet: false })

  _handleMorePress = (podcast: any) => {
    this.setState({
      selectedPodcast: podcast,
      showActionSheet: true
    })
  }

  _handleNavigationPress = (podcast: any, viewType?: string) => {
    this.setState({ showActionSheet: false })
    navigateToPodcastScreenWithPodcast(this.props.navigation, podcast, viewType)
  }

  _handleAddPodcastByRSSURLNavigation = () => {
    this.props.navigation.navigate(PV.RouteNames.AddPodcastByRSSScreen)
  }

  _renderPodcastItem = ({ item, index }) => (
    <PodcastTableCell
      hasZebraStripe={isOdd(index)}
      id={item.id}
      lastEpisodePubDate={item.lastEpisodePubDate}
      onPress={() => this._handleMorePress(item)}
      podcastImageUrl={item.shrunkImageUrl || item.imageUrl}
      {...(item.title ? { podcastTitle: item.title } : {})}
      testID={`${testIDPrefix}_podcast_item_${index}`}
    />
  )

  _moreButtons = (): any[] => {
    const { selectedPodcast } = this.state
    const subscribedPodcastIds = safelyUnwrapNestedVariable(() => this.global.session.userInfo.subscribedPodcastIds, [])
    const isSubscribed = selectedPodcast && subscribedPodcastIds.some((id: any) => id === selectedPodcast.id)

    return [
      {
        key: 'toggleSubscribe',
        text: isSubscribed ? translate('Unsubscribe') : translate('Subscribe'),
        onPress: () => selectedPodcast && this._toggleSubscribeToPodcast(selectedPodcast.id)
      },
      {
        key: 'episodes',
        text: translate('Episodes'),
        onPress: () => this._handleNavigationPress(selectedPodcast, _episodesKey)
      },
      {
        key: 'clips',
        text: translate('Clips'),
        onPress: () => this._handleNavigationPress(selectedPodcast, _clipsKey)
      },
      {
        key: 'goToPodcast',
        text: translate('Go to Podcast'),
        onPress: () => this._handleNavigationPress(selectedPodcast)
      }
    ]
  }

  _toggleSubscribeToPodcast = async (id: string) => {
    const wasAlerted = await alertIfNoNetworkConnection(translate('subscribe to this podcast'))
    if (wasAlerted) return

    try {
      await toggleSubscribeToPodcast(id)
    } catch (error) {
      Alert.alert(PV.Alerts.SOMETHING_WENT_WRONG.title, PV.Alerts.SOMETHING_WENT_WRONG.message, PV.Alerts.BUTTONS.OK)
    }
    this.setState({ showActionSheet: false })
  }

  _navToRequestPodcastForm = () => {
    Alert.alert(PV.Alerts.LEAVING_APP.title, PV.Alerts.LEAVING_APP.message, [
      { text: translate('Cancel') },
      { text: translate('Yes'), onPress: () => Linking.openURL(PV.URLs.requestPodcast) }
    ])
  }

  render() {
    const {
      flatListData,
      flatListDataTotalCount,
      isLoading,
      isLoadingMore,
      searchBarText,
      searchType,
      showActionSheet
    } = this.state

    return (
      <View style={styles.view} {...testProps('search_screen_view')}>
        <ButtonGroup buttons={buttons} onPress={this._handleSearchTypePress} selectedIndex={searchType} />
        <SearchBar
          containerStyle={styles.searchBarContainer}
          handleClear={this._handleSearchBarClear}
          inputRef={(ref: any) => (this.searchBarInput = ref)}
          onChangeText={this._handleSearchBarTextChange}
          placeholder={translate('search')}
          testID={testIDPrefix}
          value={searchBarText}
        />
        <Divider />
        {!isLoading && flatListData && (
          <FlatList
            data={flatListData}
            dataTotalCount={flatListDataTotalCount}
            disableLeftSwipe
            extraData={flatListData}
            handleNoResultsBottomAction={PV.URLs.requestPodcast ? this._navToRequestPodcastForm : null}
            handleNoResultsMiddleAction={this._handleAddPodcastByRSSURLNavigation}
            isLoadingMore={isLoadingMore}
            ItemSeparatorComponent={this._ItemSeparatorComponent}
            keyExtractor={(item: any) => item.id}
            noResultsBottomActionText={PV.URLs.requestPodcast ? translate('Request Podcast') : ''}
            noResultsMessage={searchBarText.length > 1 && translate('No podcasts found')}
            noResultsMiddleActionText={translate('Add Custom RSS Feed')}
            onEndReached={this._onEndReached}
            renderItem={this._renderPodcastItem}
            testID={testIDPrefix}
          />
        )}
        {isLoading && <ActivityIndicator fillSpace />}
        <ActionSheet
          handleCancelPress={this._handleCancelPress}
          items={this._moreButtons()}
          showModal={showActionSheet}
          testID={testIDPrefix}
        />
      </View>
    )
  }

  _queryData = async (nextPage?: boolean) => {
    const { flatListData, queryPage, searchBarText, searchType } = this.state
    const page = nextPage ? queryPage + 1 : 1

    const newState = {
      isLoading: false,
      isLoadingMore: false
    }

    const wasAlerted = await alertIfNoNetworkConnection(translate('search podcasts'))
    if (wasAlerted) return newState

    try {
      const results = await getPodcasts({
        page,
        ...(searchType === _podcastByTitle ? { searchTitle: searchBarText } : {}),
        ...(searchType === _podcastByHost ? { searchAuthor: searchBarText } : {})
      })

      const newFlatListData = [...flatListData, ...results[0]]

      return {
        ...newState,
        endOfResultsReached: newFlatListData.length >= results[1],
        flatListData: newFlatListData,
        flatListDataTotalCount: results[1],
        queryPage: page
      }
    } catch (error) {
      return newState
    }
  }
}

const _podcastByTitle = 0
const _podcastByHost = 1

const buttons = [translate('Podcast'), translate('Host')]

const styles = StyleSheet.create({
  searchBarContainer: {
    marginVertical: 12
  },
  view: {
    flex: 1,
    justifyContent: 'flex-start'
  }
})
