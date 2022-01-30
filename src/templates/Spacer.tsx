import React from 'react';

type TProps = {
  width?: number;
  height?: number;
};

const Spacer: React.FC<TProps> = ({ width = 0, height = 0 }): JSX.Element => {
  return <div style={{ width: `${width}px`, height: `${height}px` }}></div>;
};

export default Spacer;
