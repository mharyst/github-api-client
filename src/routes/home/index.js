import {Component} from 'preact'
import style from './style'
import {Search, Card, Window, RepositoryData} from '../../components'

export default class Home extends Component {

  search = value => {
    fetch(`https://api.github.com/users/${value}/repos`)
      .then(response => response.json())
      .then(result => {
        this.setState({result})
      })
  }

  openRepoDetails = ({name, user}) => {
    this.openModal()
    this.setState({repositoryInfoLoading: true})
    Promise.all([
      this.getContributors(name, user),
      this.getLanguages(name, user)
    ])
      .then(result => {
        this.setState({
          repositoryData: {
            contributors: result[0],
            languages: result[1]
          },
          repositoryInfoLoading: false
        })
      })
  }

  getContributors = (repoName, user) => (
    fetch(`https://api.github.com/repos/${user}/${repoName}/contributors`)
      .then(response => response.json())
      .then(contributors => contributors)
  )

  getLanguages = (repoName, user) => (
    fetch(`https://api.github.com/repos/${user}/${repoName}/languages`)
      .then(response => response.json())
      .then(languages => languages)
  )

  openModal = () => {
    this.setState({showModal: true})
  }

  closeModal = () => {
    this.setState({showModal: false})
  }

  render() {
    const {result, showModal, repositoryData, repositoryInfoLoading} = this.state
    return (
      <div class={style.home}>
        <h1>Home</h1>
        <p>Enter owner (organization or user) name.</p>
        <Search onSubmit={this.search}/>

        {result &&
          result.map(repository => (
            <Card
              {...repository}
              onClick={() => this.openRepoDetails({name: repository.name, user: repository.owner.login})}
              key={repository.id}
            />
          ))
        }

        {showModal &&
          <Window close={this.closeModal}>
            {repositoryInfoLoading
              ? <div>loading...</div>
              : <RepositoryData data={repositoryData}/>}
          </Window>
        }

      </div>
    )
  }
}
