import {Component, PropTypes} from 'preact'
import css from './style.css'

export class Search extends Component {

  static propTypes = {
    onSubmit: PropTypes.func
  }

  state = {
    value: 'ttsugriy'
  }

  onChange = ({target: {value}}) => {
    this.setState({value})
  }

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      event.preventDefault()
      this.search()
    }
  }

  search = () => {
    this.props.onSubmit(this.state.value)
  }

  render() {
    return (
      <div class={css.search} onKeyDown={this.handleKeyDown}>
        <input onChange={this.onChange} value={this.state.value}/>
        <button onClick={this.search}>Search</button>
      </div>
    )
  }
}
