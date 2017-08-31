/*eslint camelcase: 0*/
import {Component} from 'preact'
import css from './style'
import {Search, Card, Window, RepositoryData} from '../../components'
import {ParseGithubLink} from '../../utils/githubLinkParser'

const checkStatus = response => {
  const {statusText, status} = response
  if (status === 404) {
    throw new Error(statusText)
  }
  if (status === 403) {
    throw new Error(statusText)
  }
  return response
}

export default class Home extends Component {

  state = {
    allLoaded: false,
    repositories: []
  }

  search = value => {
    const url = `https://api.github.com/users/${value}/repos`
    fetch(url)
      .then(checkStatus)
      .then(response => {
        const {next, last} = ParseGithubLink(response.headers.get('Link'))
        this.setState({next, last, allLoaded: !last, searchError: false})
        return response.json()
      })
      .then(repositories => {
        this.setState({repositories, value})
      })
      .catch(errorText => {
        console.log(errorText)
        this.setState({searchError: true, repositories: []})
      })
  }

  loadNext = () => {
    const {next, last} = this.state
    fetch(next)
      .then(response => response.json())
      .then(repositories => {
        this.setState({
          repositories: [
            ...this.state.repositories,
            ...repositories
          ],
          allLoaded: next === last
        })
      })
  }

  openRepoDetails = key => {
    const {name, owner: {login}, url, html_url, fork} = this.state.repositories[key]
    const urls = [
      `https://api.github.com/repos/${login}/${name}/contributors`,
      `https://api.github.com/repos/${login}/${name}/languages`,
      `https://api.github.com/repos/${login}/${name}/pulls?state=open&sort=popularity&direction=desc`
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
          repositoryInfoLoading: false
        })
      })
  }

  getData = urls => (
    urls.map(url => (
      fetch(url)
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
    const {searchError, allLoaded, repositories, showModal, repositoryData, repositoryInfoLoading} = this.state
    return (
      <div class={css.home}>
        <h1>Home</h1>
        <p>Enter owner (organization or user) name.</p>
        <Search onSubmit={this.search}/>

        {searchError && <div style={{color: 'red'}}>Error while searching</div>}

        {repositories.length
          ? [
            repositories.map((repository, key) => (
              <Card
                {...repository}
                onClick={() => this.openRepoDetails(key)}
                key={repository.id}
              />
            )),
            !allLoaded && <button onClick={this.loadNext}>Load more</button>
          ]
          : null
        }


        {showModal &&
          <Window close={this.closeModal}>
            {repositoryInfoLoading
              ? <div class={css.loading}>loading...</div>
              : <RepositoryData {...repositoryData}/>}
          </Window>
        }

      </div>
    )
  }
}
