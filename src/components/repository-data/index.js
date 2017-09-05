/*eslint camelcase: 0*/
import {h} from 'preact'
import PropTypes from 'proptypes'
import css from './style.scss'
import {colors} from '../../utils/github-colors'

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
    return `${parseFloat(result).toFixed(1)} ${units[unitNumber]}`
  }
  const filteredLanguages = Object.entries(languages).filter(([lang, size]) => size > 1024)

  return (
    <div class={css.repository}>
      <h2><a href={html_url}>{name}</a></h2>
      <div class={css.data}>
        {filteredLanguages &&
          <div class={css.section}>
            <h3>Languages:</h3>
            {filteredLanguages.map(([language, size]) => (
              <div class={css.language} key={language}>
                <div class={css.name}>
                  <span class={css.languageLabel} style={{backgroundColor: `${colors[language]}`}}/>
                  {language}
                </div>
                <div class={css.value}>{optimizeSize(size)}</div>
              </div>
            ))}
          </div>
        }
        {contributors &&
          <div class={css.section}>
            <h3>Contributors:</h3>
            {contributors.map(({login, contributions, html_url}) => (
              <div class={css.contributor} key={login}>
                <a href={html_url} target={'_blank'} class={css.name}>{login}</a>
                <span class={css.value}>{contributions} contributions</span>
              </div>
            ))}
          </div>
        }
        {fork &&
          <div class={css.section}>
            <h3>Forked from:</h3>
            <a href={url} target={'_blank'}>{url}</a>
          </div>
        }
        {pulls.length
          ? <div class={css.section}>
            <h3>Pull requests:</h3>
            {pulls.map(({html_url, title}) => (
              <div key={html_url}>
                <a href={html_url} class={css.pull} target={'_blank'}>{title}</a>
              </div>
            ))}
          </div>
          : null
        }
      </div>
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
