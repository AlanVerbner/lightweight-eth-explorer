import React from 'react';
import { maxLength } from '../../utils/format-utils';
import { Link } from 'react-router-dom';
import { bigNumber, formatTimestamp } from '../../utils/format-utils';

const BlockRow = ({block}) => {
  return (
    <tr>
        <td>
          <Link to={`${process.env.PUBLIC_URL}/block/${block.number}`}>{block.number}</Link>
        </td>
        <td>
          <Link to={`${process.env.PUBLIC_URL}/block/${block.hash}`}>{maxLength(20, block.hash)}</Link>
        </td>
        <td>{bigNumber(block.difficulty)}</td>
        <td><Link to={`${process.env.PUBLIC_URL}/account/${block.miner}`}>{maxLength(20, block.miner)}</Link></td>
        <td>{block.size}</td>
        <td>{formatTimestamp(block.timestamp)}</td>
        <td>{block.transactions.length}</td>
        <td>{block.gasUsed}</td>
    </tr>
  )
}

const BlocksTable = ({blocks}) => {
  return (
    <table className="pure-table pure-table-horizontal">
      <thead>
        <tr>
            <th><strong>Block #</strong></th>
            <th>Block Hash</th>
            <th>Difficulty</th>
            <th>Miner</th>
            <th>Size</th>
            <th>Date</th>
            <th># of TXs</th>
            <th>Gas used</th>
        </tr>
      </thead>
      <tbody>
        {blocks.map(block => <BlockRow key={block.hash} block={block} />)}
      </tbody>
    </table>
  )
}

export default BlocksTable;
