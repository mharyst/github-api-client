import {h, Component} from 'preact'
import {route} from 'preact-router'
// import css from './style.scss'
import {path} from '../../utils/getDomainPath'

export class Search extends Component {

  state = {
    value: window.location.pathname.split('/').pop()
  }

  search = event => {
    event.preventDefault()
    console.log(`${path}${this.state.value}`)
    route(`${path}${this.state.value}`)
  }

  onChange = ({target: {value}}) => {
    this.setState({value})
  }

  render() {
    return (
      <form onSubmit={this.search}>
        <input onChange={this.onChange} value={this.state.value}/>
        <button>Search</button>
      </form>
    )
  }
}
