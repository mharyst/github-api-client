import css from './style.scss'
import PropTypes from 'proptypes'
import {h} from 'preact'


const sortTypes = [
  'Repo name',
  'Stars count',
  'Open issues count',
  'Updated date'
]

export const SortPanel = ({sortBy, changeSorting, changeSortOrder, sortOrder}) => (
  <div class={css.solrtPanel}>
    <div>Sort by: </div>
    <select onChange={event => changeSorting(event.target.value)}>
      {sortTypes.map(value => (
        <option value={value} selected={sortBy === value} key={value}>{value}</option>
      ))}
    </select>
    <div onClick={changeSortOrder}>{sortOrder}</div>
  </div>
)

SortPanel.propTypes = {
  changeSorting: PropTypes.func.isRequired,
  changeSortOrder: PropTypes.func.isRequired,
  sortOrder: PropTypes.string,
  sortBy: PropTypes.string
}
