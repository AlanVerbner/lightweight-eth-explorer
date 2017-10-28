import React from 'react';
import {maxLength} from '../../utils/format-utils';
import { Link } from 'react-router-dom';
import { bigNumber } from '../../utils/format-utils';

const TransactionRow = ({tx}) => {
  return (
    <tr>
      <td>
        <Link to={`${process.env.PUBLIC_URL}/transaction/${tx.hash}`}>{maxLength(20, tx.hash)}</Link>
      </td>
      <td>
        <Link to={`${process.env.PUBLIC_URL}/block/${tx.blockNumber}`}>{tx.blockNumber}</Link>
      </td>
      <td>
        <Link to={`${process.env.PUBLIC_URL}/account/${tx.from}`}>{maxLength(20, tx.from)}</Link>
      </td>
      <td>
        <Link to={`${process.env.PUBLIC_URL}/account/${tx.to}`}>{maxLength(20, tx.to)}</Link>
      </td>
      <td>{bigNumber(tx.gas)}</td>
      <td>{bigNumber(tx.value)}</td>
    </tr>
  )
}

const TransactionsTable = ({txs}) => {
  return (
    <table className="pure-table pure-table-horizontal">
      <thead>
        <tr>
          <th><strong>Tx Hash</strong></th>
          <th>Block #</th>
          <th>From</th>
          <th>To</th>
          <th>Gas Used</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {txs.map(tx => <TransactionRow key={tx.hash} tx={tx} />)}
      </tbody>
    </table>
  )
}

export default TransactionsTable;
