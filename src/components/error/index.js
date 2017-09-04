import {h} from 'preact'
import css from './style.scss'
import PropTypes from 'proptypes'

export const Error = ({status}) => (
  status &&
    <div class={css.error}>
      Error while searching
    </div>
)

Error.propTypes = {
  searchError: PropTypes.bool
}
