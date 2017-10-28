import React, { Component } from 'react';
import promisify from 'es6-promisify';

import BlocksTable from '../ethereum/BlocksTable';
import TransactionsTable from '../ethereum/TransactionsTable';

const MAX_HISTORY = 10;

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      latestBlocks: [],
      latestTxs: []
    };
  }

  getLatestBlockKnown() {
    const latestBlocks = this.state.latestBlocks;
    if (latestBlocks.length === 0) return 0;
    else return latestBlocks[0].number;
  }

  async loadTransactions(eth, block) {
    const transactions = []
    for (let i = 0; i < block.transactions.length; i++) {
      const tx = await promisify(eth.getTransaction)(block.transactions[i]);
      transactions.unshift(tx);
    }
    return transactions;
  }

  async loadBlocks(eth) {
    if(this.loading) return;
    this.loading = true;
    try {
      const latestBlockNumber = await promisify(eth.getBlockNumber)();
      const latestBlockKnown = this.getLatestBlockKnown();
      const fromBlock = Math.max(latestBlockNumber - MAX_HISTORY, latestBlockKnown + 1)
      for (let i = fromBlock; i <= latestBlockNumber; i++) {
        const block = await promisify(eth.getBlock)(i);
        const txs = await this.loadTransactions(eth, block);
        this.state.latestBlocks.unshift(block);
        this.setState({
          latestBlocks: this.state.latestBlocks.splice(0, MAX_HISTORY),
          latestTxs: txs.concat(this.state.latestTxs).splice(0, MAX_HISTORY)
        })
      }
    }
    finally {
      this.loading = false;
    }
  }

  componentWillMount() {
    const eth = this.props.web3.eth;
    this.loadBlocks(eth);
    eth.filter("latest", function(err, res){
      this.loadBlocks(eth);
    }.bind(this));
  }

  render() {
    return (
      <div>
        <h2><i className="fa fa-cube"></i>Latest Blocks</h2>
        <BlocksTable blocks={this.state.latestBlocks} />
        <h2><i className="fa fa-exchange"></i>Latest Transactions</h2>
        <TransactionsTable txs={this.state.latestTxs} />
      </div>
    )
  }
}

export default Main;