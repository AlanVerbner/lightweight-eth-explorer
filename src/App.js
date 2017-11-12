import React, { Component } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive-min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'pure-extras/css/pure-extras.css';
import './App.css';
import Header from './components/layout/Header';
import Loading from './components/layout/Loading';
import Web3Provider from './components/providers/Web3Provider';
import Main from './components/pages/Main';
import BlockDetails from './components/pages/BlockDetails';
import AccountDetails from './components/pages/AccountDetails';
import TransactionDetails from './components/pages/TransactionDetails';
import Status from './components/pages/Status';
import { getStringType, TRANSACTION, ADDRESS, BLOCK } from './utils/search-utils';

class App extends Component {
  renderBody(web3) {
    return (
      <main key="body">
        <div className="content-wrapper">
          <div className="content">
            <Switch>
              <Route exact path={`${process.env.PUBLIC_URL}/`} render={(props) => <Main web3={web3}/>}/>
              <Route path={`${process.env.PUBLIC_URL}/block/:id`} render={(props) => <BlockDetails {...props} web3={web3}/>}/>
              <Route path={`${process.env.PUBLIC_URL}/account/:address`} render={(props) => <AccountDetails {...props} web3={web3}/>}/>
              <Route path={`${process.env.PUBLIC_URL}/transaction/:id`} render={(props) => <TransactionDetails {...props} web3={web3}/>}/>
              <Route exact path={`${process.env.PUBLIC_URL}/status`} render={(props) => <Status web3={web3}/>}/>
            </Switch>
          </div>
        </div>
      </main>
    )
  }

  onSearch(searchStr) {
    //FIXME Handle this with the router
    switch(getStringType(searchStr)) {
      case TRANSACTION:
        window.location = `${process.env.PUBLIC_URL}/transaction/${searchStr}`;
        break;
      case BLOCK:
        window.location = `${process.env.PUBLIC_URL}/block/${searchStr}`;
        break;
      case ADDRESS: 
        window.location = `${process.env.PUBLIC_URL}/transaction/${searchStr}`;
        break;
      default:
        break;
    }
  }

  renderContents(web3) {
      return (
        <BrowserRouter>
          <div>
            <Header key="header" onSearch={this.onSearch} />
            { this.renderBody(web3) }
          </div>
        </BrowserRouter>
      )
  }

  render() {
    return (
      <div className="App">
        <Web3Provider
          loading={() => (<Loading />)}
          content={web3 => this.renderContents(web3)}/>
      </div>
    );
  }
}

export default App;