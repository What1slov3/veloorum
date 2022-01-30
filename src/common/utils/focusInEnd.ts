import { MutableRefObject } from 'react';

export const focusInEnd = (ref: MutableRefObject<any>) => {
  ref.current.focus();
  document.execCommand('selectAll', false, undefined);
  document.getSelection()!.collapseToEnd();
};