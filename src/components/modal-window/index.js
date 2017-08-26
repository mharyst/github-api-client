import {Component, PropTypes} from 'preact'
import css from './style.css'

export class Window extends Component {

  static propTypes = {
    children: PropTypes.object,
    close: PropTypes.func
  }

  render() {
    const {children, close} = this.props
    return (
      <div class={css.dialog}>
        <div class={css.container} onClick={close}>
          <div class={css.modal} onClick={event => event.stopPropagation()}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}
