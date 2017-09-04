/*eslint no-console: 0*/
import {h, Component} from 'preact'
import {Router} from 'preact-router'
import {Search, Window, RepositoryData, Loading, Error} from './index.js'
import {Header} from './header'
import Stream from '../routes/stream'
import style from './app.scss'
import {ParseGithubLink} from '../utils/githubLinkParser'
import {checkStatus} from '../utils/checkFetchStatus'


const headers = {'Accept': 'application/vnd.github.mercy-preview+json'}

export default class App extends Component {

  state = {
    allLoaded: false,
    reposLoading: false,
    repositories: []
  }

  handleRoute = e => {
    this.currentUrl = e.url
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

  render() {
    const {searchError, dialogError, reposLoading, allLoaded, repositories, showModal, repositoryData,
      repositoryInfoLoading} = this.state

    return (
      <div id="app">
        <Header />
        <div class={style.app}>
          <p>Enter owner (organization or user) name.</p>

          <Router onChange={this.handleRoute}>
            <Stream
              path="/:user"
              repositories={repositories}
              search={this.search}
              openRepoDetails={this.openRepoDetails}/>
          </Router>

          <Error status={searchError}/>

          {repositories.length && !allLoaded && !reposLoading
            ? <div class={style.loadMore} onClick={this.loadNext}>Load more</div>
            : null
          }

          {reposLoading && <div class={style.loadingWrapper}><Loading /></div>}

          {showModal &&
            <Window close={this.closeModal}>
              {dialogError && <div class={style.error}>Error getting information about repository</div>}
              {repositoryInfoLoading && !dialogError && <Loading />}
              {!repositoryInfoLoading && !dialogError && <RepositoryData {...repositoryData}/>}
            </Window>
          }
        </div>
      </div>
    )
  }
}
