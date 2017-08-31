/*eslint camelcase: 0*/
import {Component} from 'preact'
import css from './style'
import {Search, Card, Window, RepositoryData} from '../../components'
import {ParseGithubLink} from '../../utils/githubLinkParser'

export default class Home extends Component {

  state = {
    allLoaded: false,
    repositories: []
  }

  search = value => {
    const url = `https://api.github.com/users/${value}/repos`
    fetch(url)
      .then(response => {
        const {next, last} = ParseGithubLink(response.headers.get('Link'))
        this.setState({next, last, allLoaded: !last})
        return response.json()
      })
      .then(repositories => {
        this.setState({repositories, value})
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
    this.openModal()
    this.setState({repositoryInfoLoading: true})
    Promise.all([
      this.getContributors(name, login),
      this.getLanguages(name, login),
      this.getPulls(name, login)
    ])
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

  getContributors = (repoName, user) => (
    fetch(`https://api.github.com/repos/${user}/${repoName}/contributors`)
      .then(response => response.json())
  )

  getLanguages = (repoName, user) => (
    fetch(`https://api.github.com/repos/${user}/${repoName}/languages`)
      .then(response => response.json())
  )

  getPulls = (repoName, user) => (
    fetch(`https://api.github.com/repos/${user}/${repoName}/pulls?state=open&sort=popularity&direction=desc`)
      .then(response => response.json())
  )

  openModal = () => {
    this.setState({showModal: true})
  }

  closeModal = () => {
    this.setState({showModal: false})
  }

  render() {
    const {allLoaded, repositories, showModal, repositoryData, repositoryInfoLoading} = this.state
    return (
      <div class={css.home}>
        <h1>Home</h1>
        <p>Enter owner (organization or user) name.</p>
        <Search onSubmit={this.search}/>

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
