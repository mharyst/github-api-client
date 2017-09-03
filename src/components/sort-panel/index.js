import css from './style.css'

const sortTypes = [
  'Repo name',
  'Stars count',
  'Open issues count',
  'Updated date'
]

export const SortPanel = ({sortBy, changeSorting}) => (
  <div class={css.solrtPanel}>
    <select onChange={event => changeSorting(event.target.value)}>
      {sortTypes.map(value => (
        <option value={value} selected={sortBy === value} key={value}>{value}</option>
      ))}
    </select>
  </div>
)

SortPanel.propTypes = {
  changeSorting: PropTypes.func.isRequired,
  sortBy: PropTypes.string
}
