import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchStr: ""
    }
  }

  updateSearchStr(evt) {
    this.setState({
      searchStr: evt.target.value
    });
  }

  onSubmit(evt) {
    evt.preventDefault();
    this.props.onSearch(this.state.searchStr);
  }

  render() {
    return (
      <div className="header">
        <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
            <a className="pure-menu-heading" href={`${process.env.PUBLIC_URL}/`}>Lightweight Ethereum Explorer</a>
            <ul className="pure-menu-list">
              <li>
                <form onSubmit={this.onSubmit.bind(this)}>
                  <input id="search-box" name="q" size="40" type="text" placeholder="Tx Hash, Address, or Block #" onChange={evt => this.updateSearchStr(evt)}/>
                  <input id="search-btn" value="Search" type="submit"/>
                </form>
              </li>
            </ul>
            <ul className="pure-menu-list">
              <li className="pure-menu-item">
                <Link className="pure-menu-link" to={`${process.env.PUBLIC_URL}/`}>Home</Link>
              </li>
              <li className="pure-menu-item">
                <Link className="pure-menu-link" to={`${process.env.PUBLIC_URL}/status`}>Status</Link>
              </li>
              <li className="pure-menu-item">
                <Link className="pure-menu-link" to={`${process.env.PUBLIC_URL}/verifyContract`}>Verify Contract</Link>
              </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Header;