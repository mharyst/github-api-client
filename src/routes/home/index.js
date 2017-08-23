import {Component} from 'preact'
import style from './style'
import Search from '../../components/search'
import Card from '../../components/card'

export default class Home extends Component {

  search = value => {
    fetch(`https://api.github.com/users/${value}/repos`)
      .then(response => response.json())
      .then(result => {
        this.setState({result})
      })
  }

  render() {
    const {result} = this.state
    return (
      <div class={style.home}>
        <h1>Home</h1>
        <p>Enter owner (organization or user) name.</p>
        <Search onSubmit={this.search}/>

        {result &&
          result.map(repository => (
            <Card key={repository.id} {...repository}/>
          ))
        }

      </div>
    )
  }
}
