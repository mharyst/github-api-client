/*eslint camelcase: 0*/
import {h} from 'preact'
import PropTypes from 'proptypes'
import css from './style.scss'
import {formatDate} from '../../utils/formatDate'
import {formatStars} from '../../utils/format-stars'
import forkSvg from './icons/fork.svg'
import starSvg from './icons/star.svg'
import {colors} from '../../utils/github-colors'

export const Card = ({name, description, fork, stargazers_count, pushed_at, language, onClick}) => (
  <div class={css.card} onClick={onClick}>
    {fork && <div class={css.fork}><img src={forkSvg} width={15}/></div>}
    <div class={css.container}>
      <div class={css.name}>{name}</div>
      <div class={css.description}>{description}</div>
      <div class={css.bottom}>
        {language && <div class={css.language}><span style={{backgroundColor: `${colors[language]}`}}/>{language}</div>}
        <div class={css.stars}><img src={starSvg} width={15}/> {formatStars(stargazers_count)}</div>
        <div>Updated {formatDate(new Date(pushed_at))}</div>
      </div>
    </div>
  </div>
)

Card.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  fork: PropTypes.bool,
  stargazers_count: PropTypes.string,
  pushed_at: PropTypes.string,
  language: PropTypes.string,
  onClick: PropTypes.func
}
