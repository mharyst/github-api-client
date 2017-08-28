/*eslint camelcase: 0*/
import {Component} from 'preact'
import css from './style'
import {Search, Card, Window, RepositoryData} from '../../components'

export default class Home extends Component {

  state = {
    allLoaded: false,
    repositories: []
  }

  search = (value, page = 1) => {
    fetch(`https://api.github.com/users/${value}/repos?page=${page}`)
      .then(response => response.json())
      .then(repositories => {
        let newState = {
          repositories: [
            ...this.state.repositories,
            ...repositories
          ], value}
        if (repositories.length / 30 % 1 !== 0) {
          newState = {
            ...newState,
            allLoaded: true}
        }
        if (page === 1) {
          newState = {repositories, value, allLoaded: false}
        }
        this.setState(newState)
      })
  }

  loadMore = () => {
    const page = Math.round(this.state.repositories.length / 30) + 1
    this.search(this.state.value, page)
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
            !allLoaded && <button onClick={this.loadMore}>Load more</button>
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
