import { Component } from 'react';
import getWeb3 from '../../utils/web3-loader';

class Web3Provider extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  async loadWeb3(getWeb3) {
    // FIXME Handle Error
    const result = await getWeb3
    this.setState({ web3: result.web3 })
  }

  componentWillMount() {
    this.loadWeb3(getWeb3);
  }

  render() {
    if(this.state.web3) return this.props.content(this.state.web3);
    else return this.props.loading();
  }
}

export default Web3Provider;