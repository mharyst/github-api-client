/*eslint camelcase: 0*/
import {h} from 'preact'
import PropTypes from 'proptypes'
import css from './style.scss'

const units = {
  0: 'Kb',
  1: 'Mb',
  2: 'Gb'
}

export const RepositoryData = ({languages, contributors, pulls, url, name, fork, html_url}) => {
  const optimizeSize = (size, unitNumber = 0) => {
    const result = size / 1024
    if (result >= 1024) {
      return optimizeSize(result, unitNumber + 1)
    }
    return `${Math.round(result)} ${units[unitNumber]}`
  }
  const filteredLanguages = Object.entries(languages).filter(([lang, size]) => size > 1024)

  return (
    <div class={css.repository}>
      <h2><a href={html_url}>{name}</a></h2>
      {filteredLanguages &&
        <div>
          <h3>Languages:</h3>
          {filteredLanguages.map(([language, size]) => (
            <div key={language}>{`${language} – ${optimizeSize(size)}`}</div>
          ))}
        </div>
      }
      {contributors &&
        <div>
          <h3>Contributors:</h3>
          {contributors.map(({login, contributions, html_url}) => (
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
          {pulls.map(({html_url, title}) => (
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

RepositoryData.propTypes = {
  languages: PropTypes.object,
  contributors: PropTypes.object,
  url: PropTypes.string,
  html_url: PropTypes.string,
  name: PropTypes.string,
  fork: PropTypes.bool,
  pulls: PropTypes.object
}
