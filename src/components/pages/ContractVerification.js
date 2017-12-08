import React, { Component } from "react";
import Loading from "../layout/Loading";
import {
  getSolidityVersions,
  loadSolidityVersion,
  generateCompilerInput
} from "../../utils/solidity/solidity-loader";

class ContractInput extends Component {
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

const CompilationOutput = ({
  compilationOutput,
  compilationContractName,
  contractName
}) => {
  if (compilationOutput === undefined) return <h2>No Output Yet</h2>;
  return (
    <div>
      <h2>Output</h2>
      <div className="pure-u-1-1">
        <textarea
          className="solidity-input"
          disabled="disabled"
          value={
            compilationOutput.contracts[compilationContractName][contractName]
              .evm.bytecode.object
          }
        />
      </div>
    </div>
  );
};

class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async loadData() {
    const versions = await getSolidityVersions();
    this.setState({
      versions
    });
  }

  componentWillMount() {
    this.loadData();
  }

  onVerify = async ({ contractName, contractCode, version }) => {
    if(this.compilerVersion !== version) {
      this.compiler = await loadSolidityVersion(version);
      this.compilerVersion = version;
    }
    const input = generateCompilerInput({
      userInput: {
        content: contractCode
      }
    });
    var compilationOutput = this.compiler.compileStandardWrapper(input);
    this.setState({
      compilationOutput: JSON.parse(compilationOutput),
      contractName
    });
  };

  render() {
    if (!this.state.versions) return <Loading />; //FIXME Loading Here needed
    return (
      <div>
        <h2>Contract Verification</h2>
        <ContractInput
          versions={this.state.versions}
          onVerify={params => this.onVerify(params)}
        />
        <CompilationOutput
          compilationOutput={this.state.compilationOutput}
          compilationContractName="userInput"
          contractName={this.state.contractName}
        />
      </div>
    );
  }
}

export default Status;
