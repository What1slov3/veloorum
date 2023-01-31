import React, { ReactNode, useLayoutEffect, useRef } from 'react';
import TimeFormatter from '@common/utils/TimeFormatter';
import { DeleteMessageModalPayload } from '@customTypes/modals.types';
import MessageEditor from './MessageEditor/MessageEditor';
import ReactDOMServer from 'react-dom/server';
import { lsa } from '../../..';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { resetRealtimeStatus } from '@store/chats';
import { wrapAllFormatting } from '@common/utils/contentMessageWrapper';
import MessageAttachment from './MessageAttachement/MessageAttachment';
import { MessageContent, MessageContext } from '@customTypes/redux/chats.types';
import { LimitModal } from '../ChannelChat';
import Tooltip from '@components/Tooltip/Tooltip';
import s from './channelmessage.module.css';

type Props = {
  uuid: string;
  content: MessageContent | { text: ReactNode[] };
  context: MessageContext;
  createdAt: number;
  updatedAt: number;
  username: string;
  isOwner: boolean;
  uid: string;
  isEditing: boolean;
  setEditingMode: (mid: string | null) => void;
  short?: boolean;
  realtime?: boolean;
  openDeleteModal: (payload: DeleteMessageModalPayload) => void;
  openAttachmentModal: (url: string) => void;
  openSymbolLimitModal: (payload: LimitModal) => void;
};

const ChannelMessage: React.FC<Props> = ({
  uuid,
  content,
  context,
  createdAt,
  updatedAt,
  isOwner,
  username,
  uid,
  openDeleteModal,
  isEditing,
  setEditingMode,
  short,
  openAttachmentModal,
  realtime,
  openSymbolLimitModal,
}): JSX.Element => {
  const dispatch = useDispatch<any>();

  const messageRef = useRef<HTMLDivElement>(null!);

  const handleDeleteMessage = () => {
    openDeleteModal({ username, context, content, createdAt, uuid });
  };

  const handleEditingMode = () => {
    setEditingMode(uuid);
  };

  useLayoutEffect(() => {
    if (realtime) {
      messageRef.current.style.maxHeight = messageRef.current.scrollHeight + 'px';
      setTimeout(() => {
        messageRef.current.style.overflow = 'visible';
        dispatch(resetRealtimeStatus({ context, uuid }));
      }, 300);
    }
  }, [realtime]);

  return (
    <div
      ref={messageRef}
      className={classNames({
        [s.short]: short,
        [s.active]: isEditing,
        [`messageGroupGap_${lsa.getSettings('messageGroupGap')}`]: !short,
        [s.realtime]: realtime,
      })}
    >
      <div className={s.wrapper}>
        <div className={s.time_wrapper}>
          <Tooltip position="top" text={new TimeFormatter(createdAt).getFullMessageTime()}>
            <div className={s.time}>{new TimeFormatter(createdAt).getMessageTimeShort()}</div>
          </Tooltip>
        </div>
        <div className={s.content_wrapper}>
          {!short && <div className={`${s.username} fontSize_${lsa.getSettings('fontSize')}`}>{username}</div>}
          <div className={`${s.content} fontSize_${lsa.getSettings('fontSize')}`}>
            {isEditing ? (
              <MessageEditor
                uid={uid}
                context={context}
                mid={uuid}
                messageContent={ReactDOMServer.renderToString(content.text as any)}
                setEditingMode={setEditingMode}
                openSymbolLimitModal={openSymbolLimitModal}
              />
            ) : (
              <>
                {wrapAllFormatting(content.text)}
                {new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 500 && (
                  <span className={s.was_edit_mark}>
                    <Tooltip position="top" text={new TimeFormatter(updatedAt).getFullMessageTime()}>
                      <span>(ред.)</span>
                    </Tooltip>
                  </span>
                )}
              </>
            )}
            {/* @ts-ignore */}
            {content.attachments && content.attachments!.length > 0 && (
              <MessageAttachment content={content} openAttachmentModal={openAttachmentModal} />
            )}
          </div>
        </div>
        <div className={s.context_menu}>
          {isOwner && (
            <>
              <div className={s.context_btn} id={s.delete} onClick={handleDeleteMessage}>
                <i className="fas fa-trash-alt"></i>
              </div>
              <div className={s.context_btn} onClick={handleEditingMode}>
                <i className="fas fa-pencil"></i>
              </div>
            </>
          )}
          <div className={s.context_btn}>
            <i className="fas fa-ellipsis-h"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelMessage;

export const ChannelMessageMemo = React.memo(ChannelMessage);
