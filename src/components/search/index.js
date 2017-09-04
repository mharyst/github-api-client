import {h, Component} from 'preact'
import {route} from 'preact-router'
import PropTypes from 'proptypes'
// import css from './style.scss'

export class Search extends Component {

  static propTypes = {
    value: PropTypes.string
  }

  state = {
    value: this.props.value
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
