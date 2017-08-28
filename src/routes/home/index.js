/*eslint camelcase: 0*/
import {Component} from 'preact'
import css from './style'
import {Search, Card, Window, RepositoryData} from '../../components'

export default class Home extends Component {

  search = value => {
    fetch(`https://api.github.com/users/${value}/repos`)
      .then(response => response.json())
      .then(repositories => {
        this.setState({repositories})
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
    const {repositories, showModal, repositoryData, repositoryInfoLoading} = this.state
    return (
      <div class={css.home}>
        <h1>Home</h1>
        <p>Enter owner (organization or user) name.</p>
        <Search onSubmit={this.search}/>

        {repositories &&
          repositories.map((repository, key) => (
            <Card
              {...repository}
              onClick={() => this.openRepoDetails(key)}
              key={repository.id}
            />
          ))
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
