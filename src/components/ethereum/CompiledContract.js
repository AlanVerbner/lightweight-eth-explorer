import React from "react";

export default function CompiledContract({ evmBytecode }) {
  if (evmBytecode === undefined) return <h2>No Output Yet</h2>;
  return (
    <div>
      <h2>Output</h2>
      <div className="pure-u-1-1">
        <textarea
          className="solidity-input"
          disabled="disabled"
          value={evmBytecode}
        />
      </div>
    </div>
  );
}
