import svg from './loading.svg'
import css from './style.css'

export const Loading = ({width}) => (
  <div class={css.loading}>
    <img src={svg} width={width || 80}/>
  </div>
)

Loading.propTypes = {
  width: PropTypes.object
}
