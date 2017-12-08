import fetchInject from "fetch-inject";

/**
 * The following solidity loader is based on https://github.com/ethereum/browser-solidity/blob/master/src/app/tabs/settings-tab.js
 */

const VERSIONS_URL = "https://ethereum.github.io/solc-bin/bin/list.json";

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

export async function loadSolidityVersion(path) {
  const url = `https://ethereum.github.io/solc-bin/bin/${path}`;
  console.log(`loading solc from ${url}`);
  await fetchInject([url, './solc.js']).then(() => "Compiler loaded");
  return window.solc(window.Module);
}

export function generateCompilerInput(sources, opts = {}) {
  return JSON.stringify({
    language: 'Solidity',
    sources: sources,
    settings: {
      optimizer: {
        enabled: opts.optimize === true,
        runs: 500
      },
      libraries: opts.libraries,
      outputSelection: {
        '*': {
          '*': [ 'evm.deployedBytecode']
        }
      }
    }
})
}
