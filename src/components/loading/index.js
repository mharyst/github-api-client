import svg from './loading.svg'
import {h} from 'preact'
import css from './style.scss'
import PropTypes from 'proptypes'

export const Loading = ({width}) => (
  <div class={css.loading}>
    <img src={svg} alt="loading" width={width || 60}/>
  </div>
)

Loading.propTypes = {
  width: PropTypes.object
}
