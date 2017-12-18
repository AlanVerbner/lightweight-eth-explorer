import React, { Component } from "react";

export default class ContractInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: props.versions[0].path
    };
  }

  handleChange = event => {
    //FIXME Debounce needed
    const stateChange = {};
    stateChange[event.target.name] = event.target.value;
    this.setState(stateChange);
  };

  onVerify = () => {
    //TODO validate state or input
    this.props.onVerify(this.state);
  };

  createCompilerVersionOption(version) {
    return (
      <option key={version.name} value={version.path}>
        {version.name}
      </option>
    );
  }

  render() {
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-1-1">
            <select
              name="version"
              value={this.state.version}
              onChange={this.handleChange}
            >
              {this.props.versions.map(this.createCompilerVersionOption)}
            </select>
          </div>
          <div className="pure-u-1-1">
            <input
              type="text"
              name="contractName"
              onChange={this.handleChange}
            />
          </div>
          <div className="pure-u-1-1">
            <textarea
              className="solidity-input"
              name="contractCode"
              onChange={this.handleChange}
            />
          </div>
          <div className="pure-u-1-1">
            <button
              className="button-warning pure-button"
              onClick={this.onVerify}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    );
  }
}
