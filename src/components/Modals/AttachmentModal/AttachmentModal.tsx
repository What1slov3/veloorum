import React from 'react';
import { useSelector } from 'react-redux';
import { Store } from '@customTypes/common.types';
import { AttachmentPayload } from '@customTypes/modals.types';
import s from './attachmentmodal.module.css';

const AttachmentModal: React.FC = (): JSX.Element => {
  const { url } = useSelector((state: Store) => state.appdata.activeModal.payload as AttachmentPayload);

  return (
    <div>
      <img
        src={url}
        alt="img"
        className={s.img}
        onLoad={(e) => (e.target as HTMLImageElement).classList.add(s.img_loaded)}
      />
      <a href={url} target="_blank" className={s.link}>
        Открыть оригинал
      </a>
    </div>
  );
};

export default AttachmentModal;
