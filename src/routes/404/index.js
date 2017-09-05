/*eslint camelcase: 0*/
import {h, Component} from 'preact'
import PropTypes from 'proptypes'

class NotFound extends Component {

  static propTypes = {
    repositories: PropTypes.array
  }

  render() {

    const {log} = console
    console.log(window.location)
    return (
      <div>
        Not Found
      </div>
    )
  }
}


export default NotFound
