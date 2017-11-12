import React from 'react';
import Loading from './Loading';

const EthereumEntity = ({entity, errorMessage, render}) => {
  if(entity === undefined) return <Loading />

  if(entity === null) {
    return (
      <div className="pure-alert pure-alert-error">
        {errorMessage}
      </div>
    )
  } else {
    return render();
  }
}

export default EthereumEntity;