import React from 'react';
import { bigNumber } from '../../utils/format-utils';

const AccountInfoTable = ({ account }) => {
  return (
    <table className="pure-table pure-table-horizontal">
      <thead>
          <tr>
            <th colspan="2">Address: {account.address}</th>
          </tr>
      </thead>
      <tbody>
        <tr>
            <td>Current Balance</td>
            <td><span>{ bigNumber(account.balance) } ETH</span></td>
        </tr>
        <tr>
            <td>Transaction Count <em>(# of outgoing TXs)</em></td>
            <td>{ account.transactionCount }</td>
        </tr>
        <tr>
            <td>Code</td>
            <td><textarea disabled="disabled">{ account.code }</textarea></td>
        </tr>
      </tbody>
    </table>
  )

}

export default AccountInfoTable;
