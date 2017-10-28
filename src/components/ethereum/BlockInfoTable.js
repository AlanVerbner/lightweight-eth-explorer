import React from 'react';
import { Link } from 'react-router-dom';
import { bigNumber, formatTimestamp } from '../../utils/format-utils';

const BlockInfoTable = ({ block, latestBlockNumber }) => {
  return (
    <table className="pure-table pure-table-horizontal">
      <thead>
          <tr>
            <th colSpan="2">Block Number: {block.number}</th>
          </tr>
      </thead>
      <tbody>
        <tr>
            <td>Block Hash</td>
            <td><Link to={`${process.env.PUBLIC_URL}/block/${block.hash}`}>{block.hash}</Link></td>
        </tr>
        <tr>
            <td>Received Time</td>
            <td>
                { formatTimestamp(block.timestamp) }
            </td>
        </tr>
        <tr>
          <td>Confirmations</td>
          <td><span>{ latestBlockNumber - block.number }</span></td>
        </tr>
        <tr>
            <td>Difficulty</td>
            <td>
                { bigNumber(block.difficulty) }
            </td>
        </tr>
        <tr>
            <td>Nonce</td>
            <td>{ block.nonce }</td>
        </tr>
        <tr>
            <td>Size</td>
            <td>{ block.size} bytes</td>
        </tr>
        <tr>
            <td>Miner</td>
            <td><Link to={`${process.env.PUBLIC_URL}/account/${block.miner}`}>{ block.miner }</Link></td>
        </tr>
        <tr>
            <td>Gas Limit</td>
            <td>{ bigNumber(block.gasLimit) }</td>
        </tr>
        <tr>
            <td>Gas Used</td>
            <td>{ bigNumber(block.gasUsed) }</td>
        </tr>
        <tr>
            <td>Uncles Hash</td>
            <td>{ block.sha3Uncles }</td>
        </tr>
        <tr>
            <td>State Root Hash</td>
            <td>{ block.stateRoot  }</td>
        </tr>
        <tr>
            <td>Parent Hash</td>
            <td>{ block.parentHash }</td>
        </tr>
        <tr>
            <td>Data</td>
            <td>{ block.extraData }</td>
        </tr>

        <tr>
            <td>Data (Translated)</td>
            <td>{ "//FIXME" }</td>
        </tr>

        <tr>
            <td>Number of Uncle Blocks</td>
            <td>{ block.uncles.length }</td>
        </tr>

        <tr>
            <td>Number of Transactions</td>
            <td>{ block.transactions.length }</td>
        </tr>
      </tbody>
  </table>
  )

}

export default BlockInfoTable;
