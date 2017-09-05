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
        <div class={css.ico}>
          <img src={svg} width="20"/>
        </div>
        <input class={css.input}
          onChange={this.onChange}
          value={this.state.value}
          placeholder="type username or organization here"/>
      </form>
    )
  }
}
