import React from 'react';
import FullScreen from 'react-fullscreen';
import ReactLoading from 'react-loading';

const containerStyle = {
  width:"10%", 
  margin:"0 auto"
}

const Loading = () => {
  return (
    <FullScreen>
      <div style={containerStyle}>
        <ReactLoading height='10' width='10' color="#0099ff" type="bars"/>
      </div>
    </FullScreen>
  )
}

export default Loading;