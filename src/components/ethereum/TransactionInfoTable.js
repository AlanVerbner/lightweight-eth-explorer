import React from 'react';
import { Link } from 'react-router-dom';
import { bigNumber } from '../../utils/format-utils';

const BlockInfoTable = ({tx}) => {
  return (
    <table className="pure-table pure-table-horizontal">
      <thead>
          <tr>
            <th colspan="2">Transaction Hash: {tx.hash}</th>
          </tr>
      </thead>
      <tbody>
        <tr>
          <td>Block #</td>
          <td><Link to={`${process.env.PUBLIC_URL}/block/${tx.blockNumber}`}>{tx.blockNumber}</Link></td>
        </tr>
        <tr>
          <td>From</td>
          <td>{ tx.from }</td>
        </tr>
        <tr>
          <td>To</td>
          <td>{ tx.to }</td>
        </tr>
        <tr>
          <td>Value</td>
          <td>{ bigNumber(tx.value) }</td>
        </tr>
        <tr>
          <td>Gas Price</td>
          <td>{ bigNumber(tx.gasPrice) }</td>
        </tr>
        <tr>
          <td>Gas Used</td>
          <td>{ tx.gas }</td>
        </tr>
        <tr>
          <td>Nonce</td>
          <td>{ tx.nonce }</td>
        </tr>
        <tr>
          <td>Input Data</td>
          <td><textarea disabled="disabled">{ tx.input }</textarea></td>
        </tr>
      </tbody>  
    </table>
  )

}

export default BlockInfoTable;
