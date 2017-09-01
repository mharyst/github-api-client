import {Component, PropTypes} from 'preact'
import css from './style.css'

const typeFilter = [
  'All',
  'Forks',
  'Sources'
]

export class FiltersPanel extends Component {

  static propTypes = {
    filters: PropTypes.object.isRequired,
    languages: PropTypes.array,
    changeFilter: PropTypes.func.isRequired
  }

  render() {
    const {changeFilter, languages, filters: {hasIssues, hasTopics, starred, updated, type, language}} = this.props
    return (
      <div class={css.filterPanel}>

        <div class={css.issues}>
          <input id={'issues'} type={'checkbox'} onChange={() => changeFilter('hasIssues', !hasIssues)}
            checked={hasIssues}/>
          <label for="issues">Issues</label>
        </div>

        <div class={css.topics}>
          <input id={'topics'} type={'checkbox'} onChange={() => changeFilter('hasTopics', !hasTopics)}
            checked={hasTopics}/>
          <label for="topics">Topics</label>
        </div>

        <div class={css.starred}>
          <input type={'number'} onChange={event => changeFilter('starred', event.target.value)} value={starred}/>
        </div>

        <div class={css.date}>
          <input type={'date'} onChange={event => changeFilter('updated', event.target.value)} value={updated}/>
        </div>

        <div class={css.type}>
          <select onChange={event => changeFilter('type', event.target.value)}>
            {typeFilter.map(value => (
              <option value={value} selected={type === value} key={value}>{value}</option>
            ))}
          </select>
        </div>

        {languages.length &&
          <div class={css.languages}>
            <select onChange={event => changeFilter('language', event.target.value)}>
              {languages.map(value => (
                <option value={value} selected={language === value} key={value}>{value}</option>
              ))}
            </select>
          </div>
        }

      </div>
    )
  }
}
