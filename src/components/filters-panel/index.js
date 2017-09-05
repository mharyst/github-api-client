import {h} from 'preact'
import PropTypes from 'proptypes'
import css from './style.scss'

const typeFilter = [
  'All',
  'Forks',
  'Sources'
]

export const FiltersPanel = ({filters: {hasIssues, hasTopics, starred, updated, type, language},
  changeFilter, languages}) => (
  <div class={css.filterPanel}>

    <div class={css.filter}>
      <label for="issues">Issues</label>
      <input id={'issues'} type={'checkbox'} onChange={() => changeFilter('hasIssues', !hasIssues)}
        checked={hasIssues}/>
    </div>

    <div class={css.filter}>
      <label for="topics">Topics</label>
      <input id={'topics'} type={'checkbox'} onChange={() => changeFilter('hasTopics', !hasTopics)}
        checked={hasTopics}/>
    </div>

    <div class={css.filter}>
      <label>Stars</label>
      <input type={'number'} onChange={event => changeFilter('starred', event.target.value)} value={starred}/>
    </div>

    <div class={css.filter}>
      <label>Updated</label>
      <input type={'date'} onChange={event => changeFilter('updated', event.target.value)} value={updated}/>
    </div>

    <div class={css.filter}>
      <label>Type</label>
      <select onChange={event => changeFilter('type', event.target.value)}>
        {typeFilter.map(value => (
          <option value={value} selected={type === value} key={value}>{value}</option>
        ))}
      </select>
    </div>

    {languages.length &&
      <div class={css.filter}>
        <label>Language</label>
        <select onChange={event => changeFilter('language', event.target.value)}>
          {languages.map(value => (
            <option value={value} selected={language === value} key={value}>{value}</option>
          ))}
        </select>
      </div>
    }

  </div>
)

FiltersPanel.propTypes = {
  filters: PropTypes.object.isRequired,
  languages: PropTypes.array,
  changeFilter: PropTypes.func.isRequired
}
