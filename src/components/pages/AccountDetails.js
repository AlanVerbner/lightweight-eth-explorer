import React, { Component } from 'react';
import promisify from 'es6-promisify';

import AccountInfoTable from '../ethereum/AccountInfoTable';
import EthereumEntity from '../layout/EthereumEntity';

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

  renderContents() {
    return (
      <div>
        <h2>Account Details</h2>
        <AccountInfoTable account={this.state.account}/>
      </div>
    )
  }

  render() {
    return (
      <div>
        <EthereumEntity 
          entity={this.state.account}
          errorMessage={`Account ${this.props.match.params.id} was not found`}
          render={this.renderContents.bind(this)}/>
      </div>
    );
  }
}

export default AccountDetails;
