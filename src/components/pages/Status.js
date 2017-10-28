import React, { Component } from 'react';
import Loading from '../layout/Loading';
import promisify from 'es6-promisify';
import { Link } from 'react-router-dom';

const StatusTable = ({latestBlockNumber, node, network, host, isConnected}) => {
  return (
    <table className="pure-table pure-table-horizontal">
      <thead>
          <tr>
            <th colSpan="2">Lightweight Ethereum Explorer</th>
          </tr>
      </thead>
      <tbody>
        <tr>
            <td>Latest Block Number</td>
            <td><Link to={`${process.env.PUBLIC_URL}/block/${latestBlockNumber}`}>{latestBlockNumber}</Link></td>
        </tr>
        <tr>
            <td>Node</td>
            <td>{node}</td>
        </tr>
        <tr>
            <td>Network</td>
            <td>{network}</td>
        </tr>
        <tr>
            <td>Host</td>
            <td>{host}</td>
        </tr>
      </tbody>
    </table>
  )
}

class Status extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  async loadStatus(web3) {
    const [latestBlockNumber, node, network, host] = await Promise.all([
      promisify(web3.eth.getBlockNumber)(),
      promisify(web3.version.getNode)(),
      promisify(web3.version.getNetwork)(),
      Promise.resolve(web3.currentProvider.host)
    ]);
    this.setState({
      status: {
        latestBlockNumber,
        node,
        network,
        host
      }
    })
  }

  componentWillMount() {
    this.loadStatus(this.props.web3);
  }

  render() {
    if(!this.state.status) return <Loading />; //FIXME Loading Here needed
    return (
      <div>
        <h2>Status</h2>
        <StatusTable {...this.state.status}/>
      </div>
    )
  }
}

export default Status;
