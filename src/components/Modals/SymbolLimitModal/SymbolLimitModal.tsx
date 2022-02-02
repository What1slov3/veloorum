import React from 'react';
import { TModalWindowArgs } from '../../../types/hooks';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import ModalWindow from '../ModalWindow/ModalWindow';
import s from './symbollimitmodal.module.css';

type TProps = {
  length: number;
  limit: number;
} & TModalWindowArgs;

const SymbolLimitModal: React.FC<TProps> = ({ close, isFading, length, limit }): JSX.Element => {
  return (
    <ModalWindow close={close} isFading={isFading}>
      <div className={s.wrapper}>
        <h5>IT'S TIME TO STOP</h5>
        <div className={s.content}>
          Вы ввели слишком длинное сообщение.
          <div>
            Символов {length} из {limit}
          </div>
        </div>
        <ModalButton
          style={{ background: 'var(--astro)', marginTop: '10px', marginLeft: 'auto' }}
          onClick={() => close()}
          onEnterPress
        >
          Понял
        </ModalButton>
      </div>
    </ModalWindow>
  );
};

export default SymbolLimitModal;
