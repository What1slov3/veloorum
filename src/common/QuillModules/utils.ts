import ReactQuill from 'react-quill';

export const getQuillText = (quill: ReactQuill) => {
  return quill.getEditor().getText();
};

export const setQuillText = (quill: ReactQuill, text: string) => {
  return quill.getEditor().setText(text, 'silent');
};
