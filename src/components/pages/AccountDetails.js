import React, { Component } from 'react';
import promisify from 'es6-promisify';

import AccountInfoTable from '../ethereum/AccountInfoTable';
import Loading from '../layout/Loading';

class AccountDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  async loadData(web3, address) {
    const accountResult = await Promise.all([
      promisify(web3.eth.getBalance)(address),
      promisify(web3.eth.getCode)(address),
      promisify(web3.eth.getTransactionCount)(address)
    ]);

    this.setState({
      account: {
        address: address,
        balance: web3.fromWei(accountResult[0], 'ether'),
        code: accountResult[1],
        transactionCount: accountResult[2]
      }
    })
  }

  componentWillReceiveProps({web3, match}) {
    this.setState({
      block: undefined
    })
    this.loadData(web3, match.params.address);
  }
 
  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  render() {
    if(!this.state.account) return <Loading />;
    return (
      <div>
        <h2>Account Details</h2>
        <AccountInfoTable account={this.state.account}/>
      </div>
    )
  }
}

export default AccountDetails;
