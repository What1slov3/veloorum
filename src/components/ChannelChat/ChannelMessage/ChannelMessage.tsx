import React, { useLayoutEffect, useMemo, useRef } from 'react';
import TooltipWrapper from '../../TooltipWrapper/TooltipWrapper';
import Tooltip from '../../TooltipWrapper/Tooltip/Tooltip';
import TimeFormatter from '../../../common/utils/TimeFormatter';
import { TModalOpenFunc } from '../../../types/hooks';
import { TDeleteMessageModalPayload } from '../../../types/modalsPayload';
import { TMessageContent, TMessageContext } from '../../../store/chats/types';
import MessageEditor from './MessageEditor/MessageEditor';
import ReactDOMServer from 'react-dom/server';
import { lsa } from '../../..';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { resetRealtimeStatus } from '../../../store/chats';
import { wrapAllFormatting } from '../../../common/utils/contentMessageWrapper';
import s from './channelmessage.module.css';

type TProps = {
  uuid: string;
  content: TMessageContent | { text: React.ReactNodeArray };
  context: TMessageContext;
  createdAt: number;
  updatedAt: number;
  username: string;
  isOwner: boolean;
  uid: string;
  openDeleteModal: TModalOpenFunc<TDeleteMessageModalPayload>;
  isEditing: boolean;
  setEditingMode: (mid: string | null) => void;
  short?: boolean;
  openAttachment: (url: string) => void;
  realtime?: boolean;
  openSymbolLimitModal: (payload: [number, number]) => void;
};

const ChannelMessage: React.FC<TProps> = ({
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
  openAttachment,
  realtime,
  openSymbolLimitModal,
}): JSX.Element => {
  const dispatch = useDispatch();

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
  }, [realtime, messageRef]);

  const renderAttachments = useMemo(() => {
    return (content as TMessageContent).attachments?.map((url) => (
      <img
        key={url}
        src={url}
        alt="img"
        className={s.attachment_image}
        onLoad={(e) => (e.target as HTMLImageElement).classList.add(s.img_loaded)}
        onClick={() => openAttachment(url)}
      />
    ));
  }, [content]);

  return (
    <div
      ref={messageRef}
      className={classNames({
        [s.short]: short,
        [s.active]: isEditing,
        [`messageGroupGap_${lsa.getAppSettings('messageGroupGap')}`]: !short,
        [s.realtime]: realtime,
      })}
    >
      <div className={s.wrapper}>
        <div className={s.time_wrapper}>
          <TooltipWrapper
            position="top"
            tooltipContent={<Tooltip>{new TimeFormatter(createdAt).getFullMessageTime()}</Tooltip>}
          >
            <div className={s.time}>{new TimeFormatter(createdAt).getMessageTimeShort()}</div>
          </TooltipWrapper>
        </div>
        <div className={s.content_wrapper}>
          {!short && <div className={`${s.username} fontSize_${lsa.getAppSettings('fontSize')}`}>{username}</div>}
          <div className={`${s.content} fontSize_${lsa.getAppSettings('fontSize')}`}>
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
                    <TooltipWrapper
                      position="top"
                      tooltipContent={<Tooltip>{new TimeFormatter(updatedAt).getFullMessageTime()}</Tooltip>}
                    >
                      <span>(ред.)</span>
                    </TooltipWrapper>
                  </span>
                )}
              </>
            )}
            {/* @ts-ignore */}
            {content.attachments && content.attachments!.length > 0 && (
              <div className={s.attachments}>{renderAttachments}</div>
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
