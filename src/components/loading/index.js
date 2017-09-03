import svg from './loading.svg'
import css from './style.scss'

export const Loading = ({width}) => (
  <div class={css.loading}>
    <img src={svg} width={width || 60}/>
  </div>
)

Loading.propTypes = {
  width: PropTypes.object
}
