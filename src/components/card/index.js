/*eslint camelcase: 0*/
import {Component, PropTypes} from 'preact'

export class Card extends Component {

  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    fork: PropTypes.string,
    stargazers_count: PropTypes.string,
    updated_at: PropTypes.string,
    language: PropTypes.string,
    onClick: PropTypes.func
  }

  render() {
    const {name, description, fork, stargazers_count, updated_at, language, onClick} = this.props
    return (
      <div onClick={onClick}>
        <div>{name}</div>
        <div>{description}</div>
        <div>{fork}</div>
        <div>{stargazers_count}</div>
        <div>{updated_at}</div>
        <div>{language}</div>
        <br/>
        <br/>
      </div>
    )
  }
}
