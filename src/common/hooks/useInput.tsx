import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setDisableMessageAutofocus } from '../../store/appdata';

type UseInputArgs = {
  initial?: string;
  required?: boolean;
  validationType?: '';
  validation?: Function;
  disableAutofocus?: boolean;
  setter?: (value: string) => string;
};

const useInput = ({
  initial = '',
  required = false,
  validationType = '',
  validation = Function,
  disableAutofocus = false,
  setter,
}: UseInputArgs) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState<string>(initial);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (validationType && validation) throw new Error('Cannot be used at the same time: validation, validationType');
  }, [validation, validationType]);

  return {
    value,
    error,
    onChange: (e: any) => {
      setValue(setter ? setter(e.target.value) : e.target.value);
      if (error) setError('');
    },
    onBlur: (e: any) => {
      if (!value && required) setError('Поле должно быть заполнено');
      if (disableAutofocus) dispatch(setDisableMessageAutofocus(false));
    },
    onFocus: (e: any) => {
      if (disableAutofocus) dispatch(setDisableMessageAutofocus(true));
    },
  };
};

export default useInput;
