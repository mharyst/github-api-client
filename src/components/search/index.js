import {h, Component} from 'preact'
import PropTypes from 'proptypes'
// import css from './style.scss'

export class Search extends Component {

  static propTypes = {
    onSubmit: PropTypes.func
  }

  state = {
    value: 'facebook'
  }

  onChange = ({target: {value}}) => {
    this.setState({value})
  }

  search = event => {
    event.preventDefault()
    this.props.onSubmit(this.state.value)
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
