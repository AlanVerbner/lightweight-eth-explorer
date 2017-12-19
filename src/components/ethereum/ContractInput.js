import React, { Component } from "react";

export default class ContractInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: this.props.getSolidityVersions()[0]
    };
  }

  handleChange = event => {
    //FIXME Debounce needed
    const stateChange = {};
    stateChange[event.target.name] = event.target.value;
    this.setState(stateChange);
  };

  onVerify = async () => {
    //TODO validate data before sending
    const compilationResult = await this.props.compileCode({
      contractName: this.state.contractName,
      contractCode: this.state.contractCode,
      version: this.state.version,
      opts: {}
    });
    
    this.props.onCompiled(compilationResult);
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
              {this.props
                .getSolidityVersions()
                .map(this.createCompilerVersionOption)}
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
