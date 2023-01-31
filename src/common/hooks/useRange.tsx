import React, { useState } from 'react';

type UseRangeArgs = {
  defaultValue: number;
  onSet: (value: number) => any;
};

const useRange = ({ defaultValue, onSet }: UseRangeArgs): [number, (value: number) => void] => {
  const [currentValue, setCurrentValue] = useState(defaultValue);

  const setter = (value: number) => {
    setCurrentValue(value);
    onSet(value);
  };

  return [currentValue, setter];
};

export default useRange;
