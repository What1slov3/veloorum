import React, { useEffect, useState } from 'react';
import ModalWindow from '../ModalWindow/ModalWindow';
import { TModalWindowArgs } from '../../../types/hooks';
import s from './deletemessagemodal.module.css';
import { TDeleteMessageModalPayload } from '../../../types/modalsPayload';
import TimeFormatter from '../../../common/utils/TimeFormatter';
import Spacer from '../../../templates/Spacer';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeleteMessage } from '../../../store/chats/thunk';
import { kec } from '../../..';
import ModalHeader from '../ModalWindow/ModalHeader/ModalHeader';
import { TMessageContent } from '../../../store/chats/types';
import ModalControl from '../ModalWindow/ModalControl/ModalControl';
import { TStore } from '../../../types/common';
import { setStatus } from '../../../store/errors';
import ModalError from '../ModalWindow/ModalError/ModalError';

type TProps = {
  message: TDeleteMessageModalPayload;
} & TModalWindowArgs;

const DeleteMessageModal: React.FC<TProps> = ({ isFading, close, message }): JSX.Element => {
  const dispatch = useDispatch();

  const deleteMessageStatus = useSelector((state: TStore) => state.errors.deleteMessageStatus);

  const [error, setError] = useState('');

  useEffect(() => {
    switch (deleteMessageStatus) {
      case 'error':
        setError('Что-то пошло не так, повторите попытку');
        break;
      case 'success':
        dispatch(setStatus({ type: 'deleteMessageStatus', value: null }));
        close();
        break;
    }
  }, [deleteMessageStatus]);

  const renderAttachments = () => {
    return (message.content as TMessageContent).attachments?.map((url) => (
      <img key={url} src={url} alt="img" className={s.attachment_image} />
    ));
  };

  const handleDelete = () => {
    close();
    dispatch(fetchDeleteMessage({ chatId: message.context.chatId, messageId: message.uuid }));
  };

  return (
    <ModalWindow isFading={isFading} close={close}>
      <div className={s.wrapper}>
        <ModalHeader style={{ padding: '20px', background: 'var(--red)' }}>
          <h5>Хотите удалить сообщение?</h5>
        </ModalHeader>
        <div className={s.modal_content}>
          <div className={s.message_wrapper}>
            <div className={s.time_wrapper}>
              <div className={s.time}>{new TimeFormatter(message.createdAt).getMessageTimeShort()}</div>
            </div>
            <div className={s.content_wrapper}>
              <div className={s.username}>{message.username}</div>
              <div className={s.content}>
                {message.content.text}
                {(message.content as TMessageContent).attachments &&
                  (message.content as TMessageContent).attachments!.length > 0 && (
                    <div className={s.attachments}>{renderAttachments()}</div>
                  )}
              </div>
            </div>
          </div>
          {error && <ModalError>{error}</ModalError>}
          <ModalControl>
            <ModalButton onClick={close}>Не-а</ModalButton>
            <Spacer width={10} />
            <ModalButton onClick={handleDelete} style={{ background: `var(--red)` }} onEnterPress>
              Удалить
            </ModalButton>
          </ModalControl>
        </div>
      </div>
    </ModalWindow>
  );
};

export default DeleteMessageModal;
