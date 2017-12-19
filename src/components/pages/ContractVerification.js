import React, { Component } from "react";
import Loading from "../layout/Loading";
import ContractInput from "../ethereum/ContractInput";
import CompiledContract from "../ethereum/CompiledContract";
import SolidityProvider from "../providers/SolidityProvider";

class ContractVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onCompiled = async (result) => {
      
    this.setState({
      evmBytecode: result.evm,
      errors: result.errors
    })
  }

  render() {
    return (
      <div>
        <h2>Contract Verification</h2>
        <SolidityProvider>
          <ContractInput onCompiled={this.onCompiled} />
        </SolidityProvider>
        <CompiledContract evmBytecode={this.state.evmBytecode} errors={this.state.errors} />
      </div>
    );
  }
}

export default ContractVerification;
