import React from 'react';
import s from './attachmentloader.module.css';

type TProps = {
  onChange: (e: any) => void;
};

const AttachmentLoader: React.FC<TProps> = ({onChange}): JSX.Element => {
  return (
    <div>
      <label htmlFor="attachment_loader">
        <i className={`fal fa-paperclip ${s.attachment}`}></i>
      </label>
      <input
        id="attachment_loader"
        type="file"
        accept="image/*"
        title=""
        multiple
        className={s.file_loader}
        onChange={onChange}
      />
    </div>
  );
};

export default AttachmentLoader;
