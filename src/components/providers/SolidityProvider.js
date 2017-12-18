import { Component } from 'react';
import {
  getSolidityVersions,
  loadSolidityVersion,
  compile
} from "../../utils/solidity/solidity-loader";

class SolidityProvider extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  async load(getWeb3) {
    const solidityVersions = await getSolidityVersions()
    this.setState({ solidityVersions: solidityVersions })
  }

  componentWillMount() {
    this.load(getWeb3);
  }

  render() {
    if(this.state.web3) return this.props.content(this.state.web3);
    else return this.props.loading();
  }
}

export default SolidityProvider;