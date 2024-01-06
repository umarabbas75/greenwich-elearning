import React from 'react';

const OnLoadAnimation = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animation-container md:w-[600px] md:h-[600px] w-[400px] h-[400px] m-3 md:m-0">
        <div className="imgBox">
          <img src="/assets/images/G2.png" alt="" style={{ width: '200px' }} />
        </div>
        <div className="progressBar">
          <span></span>
        </div>
        <div className="titleBox">Genmark</div>
      </div>
    </div>
  );
};

export default OnLoadAnimation;
