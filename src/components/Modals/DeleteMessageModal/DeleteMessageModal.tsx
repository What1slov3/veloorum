import React, { useEffect, useState } from 'react';
import { DeleteMessageModalPayload } from '@customTypes/modals.types';
import imeFormatter from '@common/utils/TimeFormatter';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeleteMessage } from '@store/chats/thunk';
import ModalHeader from '../ModalWindow/ModalHeader/ModalHeader';
import ModalControl from '../ModalWindow/ModalControl/ModalControl';
import { Store } from '@customTypes/common.types';
import { setStatus } from '@store/errors';
import ModalError from '../ModalWindow/ModalError/ModalError';
import { MessageContent } from '@customTypes/redux/chats.types';
import s from './deletemessagemodal.module.css';

type Props = {
  onClose: () => void;
};

const DeleteMessageModal: React.FC<Props> = ({ onClose }): JSX.Element => {
  const dispatch = useDispatch<any>();

  const deleteMessageStatus = useSelector((state: Store) => state.errors.deleteMessageStatus);
  const { username, content, context, createdAt, uuid } = useSelector(
    (state: Store) => state.appdata.activeModal.payload as DeleteMessageModalPayload
  );

  const [error, setError] = useState('');

  useEffect(() => {
    switch (deleteMessageStatus) {
      case 'error':
        setError('Что-то пошло не так, повторите попытку');
        break;
      case 'success':
        dispatch(setStatus({ type: 'deleteMessageStatus', value: null }));
        onClose();
        break;
    }
  }, [deleteMessageStatus]);

  const renderAttachments = () => {
    return (content as MessageContent).attachments?.map((url) => (
      <img key={url} src={url} alt="img" className={s.attachment_image} />
    ));
  };

  const handleDelete = () => {
    onClose();
    dispatch(fetchDeleteMessage({ chatId: context.chatId, messageId: uuid }));
  };

  return (
    <div className={s.wrapper}>
      <ModalHeader style={{ padding: '20px', background: 'var(--red)' }}>
        <h5>Хотите удалить сообщение?</h5>
      </ModalHeader>
      <div className={s.modal_content}>
        <div className={s.message_wrapper}>
          <div className={s.time_wrapper}>
            <div className={s.time}>{new imeFormatter(createdAt).getMessageTimeShort()}</div>
          </div>
          <div className={s.content_wrapper}>
            <div className={s.username}>{username}</div>
            <div className={s.content}>
              {content.text}
              {(content as MessageContent).attachments && (content as MessageContent).attachments!.length > 0 && (
                <div className={s.attachments}>{renderAttachments()}</div>
              )}
            </div>
          </div>
        </div>
        {error && <ModalError>{error}</ModalError>}
        <ModalControl>
          <ModalButton onClick={onClose}>Не-а</ModalButton>
          <ModalButton onClick={handleDelete} style={{ background: `var(--red)` }}>
            Удалить
          </ModalButton>
        </ModalControl>
      </div>
    </div>
  );
};

export default DeleteMessageModal;
