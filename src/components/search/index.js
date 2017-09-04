import {h, Component} from 'preact'
import {route} from 'preact-router'
// import css from './style.scss'

export class Search extends Component {

  state = {
    value: window.location.pathname.split('/')[1]
  }

  search = event => {
    event.preventDefault()
    route(`/${this.state.value}`)
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
