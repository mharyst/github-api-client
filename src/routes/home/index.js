/*eslint camelcase: 0*/
/*eslint no-console: 0*/
/*eslint no-alert: 0*/
import {Component} from 'preact'
import css from './style'
import {Search, Card, Window, RepositoryData, FiltersPanel, SortPanel, Loading} from '../../components'
import {ParseGithubLink} from '../../utils/githubLinkParser'
import _ from 'lodash'

const checkStatus = response => {
  const {statusText, status} = response
  if (status === 404) {
    throw new Error(statusText)
  }
  if (status === 403) {
    alert('You exceed the rate limit (60/hour), please try again later')
    throw new Error(statusText)
  }
  return response
}

const headers = {'Accept': 'application/vnd.github.mercy-preview+json'}

export default class Home extends Component {

  state = {
    allLoaded: false,
    reposLoading: false,
    repositories: [],
    filters: {
      hasIssues: false,
      hasTopics: false,
      starred: 0,
      updated: '',
      type: 'All',
      language: 'All'
    },
    sortBy: 'Repo name',
    sortOrder: 'desc'
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

  setPages = response => {
    const {next, last} = ParseGithubLink(response.headers.get('Link'))
    this.setState({next, last, allLoaded: !last, searchError: false})
    return response.json()
  }

  search = value => {
    this.setState({repositories: [], reposLoading: true})
    const url = `https://api.github.com/users/${value}/repos`
    fetch(url, {headers})
      .then(checkStatus)
      .then(this.setPages)
      .then(repositories => {
        this.setState({repositories, value, reposLoading: false})
      })
      .catch(errorText => {
        console.log(errorText)
        this.setState({searchError: true, repositories: [], reposLoading: false})
      })
  }

  loadNext = () => {
    this.setState({reposLoading: true})
    const {next, last} = this.state
    fetch(next, {headers})
      .then(checkStatus)
      .then(this.setPages)
      .then(repositories => {
        this.setState({
          repositories: [
            ...this.state.repositories,
            ...repositories
          ],
          allLoaded: next === last,
          reposLoading: false
        })
      })
      .catch(errorText => {
        console.log(errorText)
        this.setState({searchError: true, repositories: [], reposLoading: false})
      })
  }

  openRepoDetails = key => {
    const {name, owner: {login}, url, html_url, fork} = this.state.repositories[key]
    const urls = [
      `https://api.github.com/repos/${login}/${name}/contributors?per_page=3`,
      `https://api.github.com/repos/${login}/${name}/languages`,
      `https://api.github.com/repos/${login}/${name}/pulls?state=open&sort=popularity&direction=desc&per_page=5`
    ]
    this.openModal()
    this.setState({repositoryInfoLoading: true})
    Promise.all(this.getData(urls))
      .then(result => {
        this.setState({
          repositoryData: {
            name,
            url,
            html_url,
            fork,
            contributors: result[0],
            languages: result[1],
            pulls: result[2]
          },
          dialogError: false,
          repositoryInfoLoading: false
        })
      })
      .catch(errorText => {
        console.log(errorText)
        this.setState({dialogError: true})
      })
  }

  getData = urls => (
    urls.map(url => (
      fetch(url)
        .then(checkStatus)
        .then(response => response.json())
    ))
  )

  openModal = () => {
    this.setState({showModal: true})
  }

  closeModal = () => {
    this.setState({showModal: false})
  }

  changeFilter = (name, value) => {
    const {filters} = this.state
    this.setState({filters: {...filters, [name]: value}})
  }

  changeSorting = sortType => {
    this.setState({sortBy: sortType})
  }

  filterRepo = ({open_issues_count, topics, stargazers_count, updated_at, fork, language}) => {
    const {filters} = this.state
    const filterTypes = {
      hasIssues: value => value ? open_issues_count > 0 : true,
      hasTopics: value => value ? topics.length > 0 : true,
      starred: value => stargazers_count >= value,
      updated: value => value === '' ? true : new Date(updated_at) > new Date(value),
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
        const textA = repo1.name.toUpperCase()
        const textB = repo2.name.toUpperCase()
        if (textA < textB) {
          return -1
        }
        if (textA > textB) {
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

  render() {
    const {searchError, dialogError, reposLoading, allLoaded, repositories, showModal, repositoryData,
      repositoryInfoLoading, filters, sortBy, sortOrder} = this.state
    repositories.sort(this.getSortFunction)
    sortOrder === 'asc' && repositories.reverse()
    const filteredRepos = repositories.filter(repo => this.filterRepo(repo))
    return (
      <div class={css.home}>
        <p>Enter owner (organization or user) name.</p>
        <Search onSubmit={this.search}/>

        {searchError && <div style={{color: 'red'}}>Error while searching</div>}

        {repositories.length
          ? <FiltersPanel filters={filters} languages={this.getLanguages(repositories)}
            changeFilter={this.changeFilter}/>
          : null
        }

        {repositories.length
          ? <SortPanel sortBy={sortBy} changeSorting={this.changeSorting}/>
          : null
        }

        {filteredRepos.length
          ? filteredRepos.map((repository, key) => (
            <Card
              {...repository}
              onClick={() => this.openRepoDetails(key)}
              key={repository.id}
            />
          ))
          : null
        }

        {repositories.length && !allLoaded && !reposLoading
          ? <button onClick={this.loadNext}>Load more</button>
          : null
        }

        {reposLoading && <Loading />}

        {showModal &&
          <Window close={this.closeModal}>
            {dialogError && <div class={css.error}>Error getting information about repository</div>}
            {repositoryInfoLoading && !dialogError && <Loading />}
            {!repositoryInfoLoading && !dialogError && <RepositoryData {...repositoryData}/>}
          </Window>
        }

      </div>
    )
  }
}
