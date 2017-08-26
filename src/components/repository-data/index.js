/*eslint camelcase: 0*/
import {Component, PropTypes} from 'preact'
import css from './style.css'
import _ from 'lodash'

export class RepositoryData extends Component {

  static propTypes = {
    data: PropTypes.object
  }

  render() {
    const {data: {languages, contributors}} = this.props
    return (
      <div class={css.repository}>
        {languages &&
          <div>
            <h3>Languages:</h3>
            {_.map(languages, (language, size) => (
              <div key={language}>{`${language} – ${size}`}</div>
            ))}
          </div>
        }
        {contributors &&
          <div>
            <h3>Contributors:</h3>
            {_.map(_.take(contributors, 3), ({login, contributions, html_url}) => (
              <div key={login}>
                <a href={html_url} target={'_blank'}>{login}</a>
                <span>{` – ${contributions}`}</span>
              </div>
            ))}
          </div>
        }
      </div>
    )
  }
}
