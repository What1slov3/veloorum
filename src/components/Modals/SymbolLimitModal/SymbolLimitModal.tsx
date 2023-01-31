import React from 'react';
import { useSelector } from 'react-redux';
import { MAX_SYMBOLS_LIMIT_DEFAULT } from '@common/constants';
import { Store } from '@customTypes/common.types';
import { SymbolLimitPayload } from '@customTypes/modals.types';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import s from './symbollimitmodal.module.css';

type Props = {
  onClose: () => void;
};

const SymbolLimitModal: React.FC<Props> = ({ onClose }): JSX.Element => {
  const { length } = useSelector((state: Store) => state.appdata.activeModal.payload as SymbolLimitPayload);

  return (
    <div className={s.wrapper}>
      <h5>IT'S TIME TO STOP</h5>
      <div className={s.content}>
        Вы ввели слишком длинное сообщение.
        <div>
          Символов {length} из {MAX_SYMBOLS_LIMIT_DEFAULT}
        </div>
      </div>
      <ModalButton style={{ background: 'var(--astro)', marginTop: '10px', marginLeft: 'auto' }} onClick={onClose}>
        Понял
      </ModalButton>
    </div>
  );
};

export default SymbolLimitModal;
