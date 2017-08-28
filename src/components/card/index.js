/*eslint camelcase: 0*/
import {Component, PropTypes} from 'preact'
import css from './style.css'

export class Card extends Component {

  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    fork: PropTypes.bool,
    stargazers_count: PropTypes.string,
    updated_at: PropTypes.string,
    language: PropTypes.string,
    onClick: PropTypes.func
  }

  render() {
    const {name, description, fork, stargazers_count, updated_at, language, onClick} = this.props
    return (
      <div css={css.card} onClick={onClick}>
        <div class={css.name}>{name}</div>
        <div>{description}</div>
        {fork && <div>forked</div>}
        <div>Stars: {stargazers_count}</div>
        <div>{updated_at}</div>
        <div>{language}</div>
        <br/>
        <br/>
      </div>
    )
  }
}
