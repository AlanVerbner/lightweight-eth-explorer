import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import promisify from 'es6-promisify';

import BlockInfoTable from '../ethereum/BlockInfoTable';
import Loading from '../layout/Loading';

class BlockDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  async loadData(web3, id) {
    const [block, latestBlockNumber] = await Promise.all([promisify(web3.eth.getBlock)(id), promisify(web3.eth.getBlockNumber)()])
    this.setState({
      block,
      latestBlockNumber
    })
  }

  componentWillReceiveProps({web3, match}) {
    this.setState({
      block: undefined
    })
    this.loadData(web3, match.params.id);
  }
 
  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  blockNavBar(blockNumber, latestBlockNumber) {
    const prevEnabled = blockNumber !== 0 ? "" : "pure-button-disabled"
    const nextEnabled = blockNumber !== latestBlockNumber ? "" : "pure-button-disabled"

    return (
      <div>
        <Link className={`pure-button pure-button-primary ${prevEnabled}`} to={`${process.env.PUBLIC_URL}/block/${blockNumber - 1}`}>Prev</Link>
        <Link className={`pure-button pure-button-primary ${nextEnabled}`} to={`${process.env.PUBLIC_URL}/block/${blockNumber + 1}`}>Next</Link>
      </div>
    )
  }

  render() {
    if(!this.state.block) return <Loading />;
    return (
      <div>
        <h2>Block Details</h2>
        {this.blockNavBar(this.state.block.number, this.state.latestBlockNumber)}
        <BlockInfoTable block={this.state.block} latestBlockNumber={this.state.latestBlockNumber} />
      </div>
    )
  }
}

export default BlockDetails;
