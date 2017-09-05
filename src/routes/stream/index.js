/*eslint camelcase: 0*/
import {h, Component} from 'preact'
import style from './style.scss'
import {Card, FiltersPanel, SortPanel} from '../../components'
import PropTypes from 'proptypes'
import _ from 'lodash'
import {filtersNormalizer, sortNormalizer} from '../../utils/urlParamsNormalize'

class Stream extends Component {

  static propTypes = {
    repositories: PropTypes.array,
    openRepoDetails: PropTypes.func,
    user: PropTypes.string,
    matches: PropTypes.object,
    search: PropTypes.func
  }

  state = {
    filters: {
      updated: '',
      type: 'All',
      language: 'All'
    }
  }

  componentWillMount() {
    const {user, search, matches} = this.props
    search(user)
    this.setState({
      filters: {
        ...this.state.filters,
        ...filtersNormalizer(matches)
      },
      ...sortNormalizer(matches)
    })
  }

  componentWillReceiveProps(nextProps) {
    const {user, search, matches} = this.props
    user !== nextProps.user && search(nextProps.user)
    this.setState({
      filters: {
        ...this.state.filters,
        ...filtersNormalizer(matches)
      },
      ...sortNormalizer(matches)
    })
  }

  handleScroll = ({target: {scrollTop, scrollHeight, offsetHeight}}) => {
    const {allLoaded, reposLoading, loadNext} = this.props
    if (allLoaded || reposLoading) {
      return
    }
    const scrollValue = scrollTop + offsetHeight
    const scrollDelta = scrollHeight - scrollValue
    scrollDelta < 350 && loadNext()
  }

  getLanguages = repos => {
    const languages = repos.map(({language}) => language).filter(language => language !== null)
    const result = languages.reduce((uniqueLanguages, lang) => {
      if (!uniqueLanguages.includes(lang)) {
        uniqueLanguages.push(lang)
      }
      return uniqueLanguages
    }, ['All'])
    return result
  }

  changeFilter = (name, value) => {
    const {filters} = this.state
    this.setState({filters: {...filters, [name]: value}})
  }

  changeSorting = sortType => {
    this.setState({sortBy: sortType})
  }

  changeSortOrder = () => {
    const sortOrder = this.state.sortOrder === 'asc'
      ? 'desc'
      : 'asc'
    this.setState({sortOrder})
  }

  filterRepo = ({open_issues_count, topics, stargazers_count, pushed_at, fork, language}) => {
    const {filters} = this.state
    const filterTypes = {
      hasIssues: value => value ? open_issues_count > 0 : true,
      hasTopics: value => value ? topics.length > 0 : true,
      starred: value => stargazers_count >= value,
      updated: value => value === '' ? true : new Date(pushed_at) > new Date(value),
      type: value => {
        if (value === 'Forks') {
          return fork
        }
        if (value === 'Sources') {
          return !fork
        }
        return true
      },
      language: value => value === 'All' ? true : language === value
    }

    const result = _.map(filters, (value, name) => filterTypes[name](value))
    return result.every(value => value)
  }

  getSortFunction = (repo1, repo2) => {
    const {sortBy} = this.state
    const sortTypes = {
      'Repo name': () => {
        const text1 = repo1.name.toUpperCase()
        const text2 = repo2.name.toUpperCase()
        if (text1 < text2) {
          return -1
        }
        if (text1 > text2) {
          return 1
        }
        return 0
      },
      'Stars count': () => repo2.stargazers_count - repo1.stargazers_count,
      'Open issues count': () => repo2.open_issues_count - repo1.open_issues_count,
      'Updated date': () => new Date(repo2.updated_at) - new Date(repo1.updated_at)
    }
    return sortTypes[sortBy]()
  }

  render({openRepoDetails, repositories}, {sortOrder, filters, sortBy}) {
    repositories.sort(this.getSortFunction)
    sortOrder === 'asc' && repositories.reverse()
    const filteredRepos = repositories.filter(repo => this.filterRepo(repo))
    return (
      <div class={style.stream}>

        <div class={style.left}>
          {repositories.length !== 0 &&
            <FiltersPanel
              filters={filters}
              languages={this.getLanguages(repositories)}
              changeFilter={this.changeFilter}/>
          }
        </div>

        <div class={style.repositories}>
          {repositories.length !== 0 &&
            <SortPanel
              sortBy={sortBy}
              changeSorting={this.changeSorting}
              changeSortOrder={this.changeSortOrder}
              sortOrder={sortOrder}/>
          }

          <div class={style.scroll} onScroll={this.handleScroll} onTouch={this.handleScroll}>
            {filteredRepos.length !== 0 &&
              <div class={style.cards}>
                {filteredRepos.map((repository, key) => (
                  <Card
                    {...repository}
                    onClick={() => openRepoDetails(key)}
                    key={repository.id}
                  />
                ))}
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}


export default Stream
