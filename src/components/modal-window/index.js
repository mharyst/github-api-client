import {h, Component} from 'preact'
import PropTypes from 'proptypes'
import css from './style.scss'
import closeSvg from './close.svg'

export class Window extends Component {

  static propTypes = {
    children: PropTypes.object,
    close: PropTypes.func
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = event => {
    if (event.keyCode === 27) {
      event.preventDefault()
      this.props.close()
    }
  }

  render() {
    const {children, close} = this.props
    return (
      <div class={css.dialog}>
        <div class={css.container} onClick={close} onScroll={event => event.stopPropagation()}>
          <div class={css.modal} onClick={event => event.stopPropagation()} onKeyDown={this.handleKeyDown}>
            <div>
              <div class={css.closeIco}>
                <img onClick={close} src={closeSvg} width="16"/>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
