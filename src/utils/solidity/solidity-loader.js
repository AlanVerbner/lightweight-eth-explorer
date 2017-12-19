import fetchInject from "fetch-inject";

/**
 * The following solidity loader is based on https://github.com/ethereum/browser-solidity/blob/master/src/app/tabs/settings-tab.js
 */

const VERSIONS_URL = "https://ethereum.github.io/solc-bin/bin/list.json";
const BASE_PATH = "https://ethereum.github.io/solc-bin/bin/";
const BASE_SOLCJS_PATH = `${process.env.PUBLIC_URL}/solc.js`;

/**
 * Returns a list of available solidity versions from VERSIONS_URL
 */
export async function getSolidityVersions() {
  const response = await fetch(VERSIONS_URL);
  const body = await response.json();
  return body.builds.reverse().map(build => {
    return {
      name: build.longVersion,
      path: build.path
    };
  });
}

async function loadSolcJs(solcJsPath = BASE_SOLCJS_PATH) {
  if (window.solc) {
    console.log("SolcJs already loaded, skipping.");
    return;
  }
  console.log(`[START] loading solc from ${solcJsPath}`);
  await fetchInject([solcJsPath]);
  console.log(`[END] loading solc from ${solcJsPath}`);
}

/**
 * Loads in window object, the specified solidity version
 * @param {String} path Solidity version filename, ex: soljson-v0.4.19+commit.c4cbbb05.js
 * @param {String} basePath optional base path where the solidity file is going to be fetched from
 */
export async function loadSolidityVersion(path) {
  await loadSolcJs(BASE_SOLCJS_PATH);
  const url = `${BASE_PATH}${path}`;
  console.log(`[START] loading compiler from ${url}`);
  await fetchInject([url]);
  console.log(`[END] loading compiler from ${url}`);
  return window.solc(window.Module);
}

function generateCompilerInput(sources, opts = {}) {
  return JSON.stringify({
    language: "Solidity",
    sources: {
      sourceInput: sources
    },
    settings: {
      optimizer: {
        enabled: opts.optimizerEnabled || false,
        runs: opts.optimizerRounds || 200
      },
      outputSelection: {
        "*": {
          "*": ["evm.deployedBytecode"]
        }
      }
    }
  });
}

export function compile(sources, compiler, opts = {}) {
  const input = generateCompilerInput(sources, opts);
  const compilationResult = JSON.parse(compiler.compileStandardWrapper(input));
  const contracts = compilationResult.contracts["sourceInput"];
  const result = {
    errors: compilationResult.errors
  };
  if (contracts) {
    Object.entries(contracts).forEach(([name, contract]) => {
      result[name] = {
        evm: contract.evm.deployedBytecode.object.slice(0, -68)
      };
    });
  }
  return result;
}
