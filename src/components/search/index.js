import {Component, PropTypes} from 'preact'

export default class Search extends Component {

  static propTypes = {
    onSubmit: PropTypes.func
  }

  state = {
    value: 'mharyst'
  }

  onChange = ({target: {value}}) => {
    this.setState({value})
  }

  search = () => {
    this.props.onSubmit(this.state.value)
  }

  render() {
    return (
      <div>
        <input onChange={this.onChange} value={this.state.value}/>
        <button onClick={this.search}>Search</button>
      </div>
    )
  }
}
