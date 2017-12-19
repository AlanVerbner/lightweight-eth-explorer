import React, { Component } from "react";
import Loading from "../layout/Loading";
import {
  getSolidityVersions,
  loadSolidityVersion,
  compile
} from "../../utils/solidity/solidity-loader";

class SolidityProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.loadedCompilers = [];
  }

  load = async () => {
    const solidityVersions = await getSolidityVersions();
    this.setState({ solidityVersions });
  };

  compileCode = async ({ contractName, contractCode, version, opts }) => {
    if (!this.loadedCompilers[version]) {
      this.loadedCompilers[version] = await loadSolidityVersion(version);
    }
    const result = compile(
      { content: contractCode },
      this.loadedCompilers[version],
      Object.assign(
        {},
        {
          optimizerEnabled: true,
          optimizerRounds: 200
        },
        opts
      )
    );

    return {
      evm: result[contractName].evm,
      errors: result.errors
    }
  };

  getSolidityVersions = () => this.state.solidityVersions;

  componentWillMount() {
    this.load();
  }

  render() {
    if (!this.state.solidityVersions) return <Loading />;
    return React.cloneElement(this.props.children, {
      getSolidityVersions: this.getSolidityVersions,
      compileCode: this.compileCode
    });
  }
}

export default SolidityProvider;
