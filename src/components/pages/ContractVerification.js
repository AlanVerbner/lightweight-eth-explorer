import React, { Component } from "react";
import Loading from "../layout/Loading";
import ContractInput from "../ethereum/ContractInput";
import CompiledContract from "../ethereum/CompiledContract";
import {
  getSolidityVersions,
  loadSolidityVersion,
  generateCompilerInput
} from "../../utils/solidity/solidity-loader";

class ContractVerification extends Component {
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
    if (this.compilerVersion !== version) {
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

  getEvmBytecode(compilationOutput, compilationContractName, contractName) {
    if(!this.state.compilationOutput) return undefined;
    return compilationOutput.contracts[compilationContractName][contractName]
      .evm.bytecode.object;
  }

  render() {
    if (!this.state.versions) return <Loading />; //FIXME Loading Here needed
    return (
      <div>
        <h2>Contract Verification</h2>
        <ContractInput
          versions={this.state.versions}
          onVerify={params => this.onVerify(params)}
        />
        <CompiledContract
          evmBytecode={this.getEvmBytecode(
            this.state.compilationOutput,
            "userInput",
            this.state.contractName
          )}
        />
      </div>
    );
  }
}

export default Status;
