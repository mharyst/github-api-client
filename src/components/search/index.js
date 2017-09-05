import {h, Component} from 'preact'
import {route} from 'preact-router'
import css from './style.scss'
import {path} from '../../utils/getDomainPath'
import svg from './search.svg'

export class Search extends Component {

  state = {
    value: window.location.pathname.split('/').pop()
  }

  search = event => {
    event.preventDefault()
    route(`${path}${this.state.value}`)
  }

  onChange = ({target: {value}}) => {
    this.setState({value})
  }

  render() {
    return (
      <form class={css.submitForm} onSubmit={this.search}>
        <label class={css.ico} for="search">
          <img src={svg} alt="search" width="20"/>
        </label>
        <input class={css.input}
          id="search"
          onChange={this.onChange}
          value={this.state.value}
          placeholder="type username or organization here"/>
      </form>
    )
  }
}
