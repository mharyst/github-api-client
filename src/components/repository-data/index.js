/*eslint camelcase: 0*/
import {Component, PropTypes} from 'preact'
import css from './style.css'
import _ from 'lodash'

export class RepositoryData extends Component {

  static propTypes = {
    languages: PropTypes.object,
    contributors: PropTypes.object,
    url: PropTypes.string,
    html_url: PropTypes.string,
    name: PropTypes.string,
    fork: PropTypes.bool,
    pulls: PropTypes.object
  }

  render() {
    const {languages, contributors, pulls, url, name, fork, html_url} = this.props
    return (
      <div class={css.repository}>
        <h2><a href={html_url}>{name}</a></h2>
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
        {fork &&
          <div>
            <h3>Forked from:</h3>
            <a href={url} target={'_blank'}>{url}</a>
          </div>
        }
        {pulls.length
          ? <div>
            <h3>Pull requests:</h3>
            {_.map(_.take(pulls, 5), ({html_url, title}) => (
              <div key={html_url}>
                <a href={html_url} target={'_blank'}>{title}</a>
              </div>
            ))}
          </div>
          : null
        }
      </div>
    )
  }
}
