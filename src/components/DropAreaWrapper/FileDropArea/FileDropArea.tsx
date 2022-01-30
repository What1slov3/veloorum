import React from 'react';
import ModalHeader from '../../Modals/ModalWindow/ModalHeader/ModalHeader';
import s from './filedroparea.module.css';

type TProps = {
  title: string;
};

const FileDropArea: React.FC<TProps> = ({ title }): JSX.Element => {
  return (
    <div className={s.wrapper}>
      <ModalHeader style={{ borderRadius: '5px' }}>
        <div className={s.content}>
          <h6>
            Загрузить изображение в <span>{title}</span>
          </h6>
          <div className={s.tagline}>Вы можете загружать сразу несколько изображений</div>
        </div>
      </ModalHeader>
    </div>
  );
};

export default FileDropArea;
