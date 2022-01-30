import React from 'react';
import { TModalWindowArgs } from '../../../types/hooks';
import ModalWindow from '../ModalWindow/ModalWindow';
import s from './attachmentmodal.module.css';

type TProps = {
  url: string;
} & TModalWindowArgs;

const AttachmentModal: React.FC<TProps> = ({ url, isFading, close }): JSX.Element => {
  return (
    <ModalWindow isFading={isFading} close={close} bgColor="#00000000">
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
    </ModalWindow>
  );
};

export default AttachmentModal;
