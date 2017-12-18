import path from "path";
import fs from "fs";

import {
  getSolidityVersions,
  loadSolidityVersion,
  compile
} from "../../../src/utils/solidity/solidity-loader";

global.fetch = require("jest-fetch-mock");
const solc = Uint8Array.from(
  fs.readFileSync(path.join(path.resolve("."), "public/solc.js"))
).buffer;
const solcVersion = Uint8Array.from(
  fs.readFileSync(
    path.join(
      path.resolve("."),
      "test/utils/solidity/soljson-v0.4.15+commit.bbb8e64f.js"
    )
  )
).buffer;

/*test("Fetches solidity versions", async () => {
  const versions = await getSolidityVersions();
  expect(versions.length > 0).toBe(true);
});*/
let compiler = undefined;

describe("Compiles solidity code", () => {
  const SOLC_VERSION = "0.4.15+commit.bbb8e64f.Emscripten.clang";

  beforeAll(async () => {
    fetch.resetMocks();
    fetch.mockResponseOnce(solc);
    fetch.mockResponseOnce(solcVersion);
    compiler = await loadSolidityVersion();
    expect(compiler.version()).toEqual(SOLC_VERSION);
  });

  it("Loads the latest version", async () => {
    expect(compiler.compile).toBeDefined;
  });

  describe("Should compile", async () => {
    const sampleContracts = {
      simpleContract: simpleContract(),
      contractAndLibraryInTheSameFile: contractAndLibraryInTheSameFile(),
      contractWithLinkedLibrary: contractWithLinkedLibrary(),
      contractWithErrors: contractWithErrors()
    };

    Object.entries(sampleContracts).forEach(([name, contract]) => {
      it(splitCamelCase(name), async () => {
        compileAndCheck(contract, compiler);
      });
    });
  });
});

function compileAndCheck(contract, compiler) {
  const { name, code, expectedEvmCode, errors } = contract;
  var compilationOutput = compile(
    { content: code },
    compiler,
    Object.assign(
      {},
      {
        optimizerEnabled: true,
        optimizerRounds: 200
      },
      contract.opts
    )
  );
  if (expectedEvmCode) {
    expect(compilationOutput[name].evm).toEqual(expectedEvmCode);
  }
  if (errors) {
    expect(compilationOutput.errors.length > 0).toBe(true);
  }
}

function splitCamelCase(text) {
  return text.replace(/([A-Z])/g, " $1").replace(/^./, function(str) {
    return str.toUpperCase();
  });
}

/**
 * The following sample contracts were created and deployed using truffle:
 * > truffle version
 * Truffle v3.4.11 (core: 3.4.11)
 * Solidity v0.4.15 (solc-js)
 */

function simpleContract() {
  const code = `
    pragma solidity ^0.4.11;
    
    contract helloWorld {
      function renderHelloWorld () returns (string) {
        return 'helloWorld';
      }
    }
  `;
  const expectedEvmCode = "606060405263ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663942ae0a7811461003d575b600080fd5b341561004857600080fd5b6100506100c8565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561008d5780820151818401525b602001610074565b50505050905090810190601f1680156100ba5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6100d061010a565b60408051908101604052600a81527f68656c6c6f576f726c6400000000000000000000000000000000000000000000602082015290505b90565b602060405190810160405260008152905600a165627a7a723058209cb96220c8627d61f62379ddce16f843656145f0bfc0b6ecf7737e38c86708180029".slice(
    0,
    -68
  );

  return {
    name: "helloWorld",
    code,
    expectedEvmCode
  };
}

function contractAndLibraryInTheSameFile() {
  const code = `
  pragma solidity ^0.4.2;
  
  library ConvertLib {
    function convert(uint amount,uint conversionRate) internal constant returns (uint convertedAmount) {
      return amount * conversionRate;
    }
  }
  
  contract MetaCoin {
    mapping (address => uint) balances;
  
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
  
    function MetaCoin() {
      balances[tx.origin] = 10000;
    }
  
    function sendCoin(address receiver, uint amount) returns(bool sufficient) {
      if (balances[msg.sender] < amount) return false;
      balances[msg.sender] -= amount;
      balances[receiver] += amount;
      Transfer(msg.sender, receiver, amount);
      return true;
    }
  
    function getBalanceInEth(address addr) returns(uint){
      return ConvertLib.convert(balances[addr], 10);
    }
  
    function getBalance(address addr) returns(uint) {
      return balances[addr];
    }
  }
  `;
  const expectedEvmCode = "606060405263ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416637bd703e8811461005357806390b98a1114610084578063f8b2cb4f146100ba575b600080fd5b341561005e57600080fd5b610072600160a060020a03600435166100eb565b60405190815260200160405180910390f35b341561008f57600080fd5b6100a6600160a060020a0360043516602435610117565b604051901515815260200160405180910390f35b34156100c557600080fd5b610072600160a060020a03600435166101af565b60405190815260200160405180910390f35b600160a060020a03811660009081526020819052604081205461010f90600a6101ce565b90505b919050565b600160a060020a03331660009081526020819052604081205482901015610140575060006101a9565b600160a060020a033381166000818152602081905260408082208054879003905592861680825290839020805486019055917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a35060015b92915050565b600160a060020a0381166000908152602081905260409020545b919050565b8181025b929150505600a165627a7a7230582009c542f42693bbab23d946bb75133bbae1d51a16d47103a1ead0f4c04698807b0029".slice(
    0,
    -68
  );

  return {
    name: "MetaCoin",
    code,
    expectedEvmCode
  };
}

function contractWithLinkedLibrary() {
  const code = `
    pragma solidity ^0.4.11;
    
    contract ConvertLibInterface {
      function convert(uint amount,uint conversionRate) returns (uint convertedAmount);
    }
    
    contract MetaCoin2 {
    
      ConvertLibInterface ExternalConvertLib = ConvertLibInterface(0x649ef5b01644a6ae3ffbd10e97f48af9ddfb8271);
    
      mapping (address => uint) balances;
    
      event Transfer(address indexed _from, address indexed _to, uint256 _value);
    
      function MetaCoin() {
        balances[tx.origin] = 10000;
      }
    
      function sendCoin(address receiver, uint amount) returns(bool sufficient) {
        if (balances[msg.sender] < amount) return false;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        Transfer(msg.sender, receiver, amount);
        return true;
      }
    
      function getBalanceInEth(address addr) returns(uint){
        return ExternalConvertLib.convert(balances[addr], 10);
      }
    
      function getBalance(address addr) returns(uint) {
        return balances[addr];
      }
    }
  `;
  const expectedEvmCode = "606060405263ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416637bd703e8811461005e57806390b98a111461008f578063d6d22fa4146100c5578063f8b2cb4f146100da575b600080fd5b341561006957600080fd5b61007d600160a060020a036004351661010b565b60405190815260200160405180910390f35b341561009a57600080fd5b6100b1600160a060020a03600435166024356101b3565b604051901515815260200160405180910390f35b34156100d057600080fd5b6100d861024b565b005b34156100e557600080fd5b61007d600160a060020a036004351661026b565b60405190815260200160405180910390f35b60008054600160a060020a038381168352600160205260408084205491909216916396e4ee3d9190600a90859051602001526040517c010000000000000000000000000000000000000000000000000000000063ffffffff851602815260048101929092526024820152604401602060405180830381600087803b151561019157600080fd5b6102c65a03f115156101a257600080fd5b50505060405180519150505b919050565b600160a060020a033316600090815260016020526040812054829010156101dc57506000610245565b600160a060020a033381166000818152600160205260408082208054879003905592861680825290839020805486019055917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a35060015b92915050565b600160a060020a033216600090815260016020526040902061271090555b565b600160a060020a0381166000908152600160205260409020545b9190505600a165627a7a72305820405173bb8dc606decc7129c9e2ceda5780e26261f374d21ae8232509d199a8590029".slice(
    0,
    -68
  );

  return {
    name: "MetaCoin2",
    code,
    expectedEvmCode
  };
}

function contractWithErrors() {
  const code = `
    pragma solidity ^0.4.11;
    
    contract ContractWithErrors {
      function renderHelloWorld () returns (string)
        return 'helloWorld';
      }
    }
  `;

  return {
    name: "ContractWithErrors",
    code,
    errors: true
  };
}
