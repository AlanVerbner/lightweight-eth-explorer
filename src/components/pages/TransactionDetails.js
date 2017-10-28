import React, { Component } from 'react';
import promisify from 'es6-promisify';

import TransactionInfoTable from '../ethereum/TransactionInfoTable';
import Loading from '../layout/Loading';

class TransactionDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  async loadData(web3, id) {
    const tx = await promisify(web3.eth.getTransaction)(id)
    this.setState({
      tx
    })
  }

  componentWillReceiveProps({web3, match}) {
    this.setState({
      tx: undefined
    })
    this.loadData(web3, match.params.id);
  }
 
  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  render() {
    if(!this.state.tx) return <Loading />; //FIXME Loading Here needed
    return (
      <div>
        <h2>Transaction Details</h2>
        <TransactionInfoTable tx={this.state.tx} />
      </div>
    )
  }
}

export default TransactionDetails;
