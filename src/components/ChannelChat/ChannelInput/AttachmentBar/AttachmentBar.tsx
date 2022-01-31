import React from 'react';
import { useDispatch } from 'react-redux';
import { setOpenedAttachment, setUploadedAttachments } from '../../../../store/appdata';
import { TMessageContext } from '../../../../store/chats/types';
import s from './attachmentbar.module.css';

type TProps = {
  urls: string[];
  context: TMessageContext;
};

const AttachmentBar: React.FC<TProps> = ({ urls, context }): JSX.Element => {
  const dispatch = useDispatch();

  const deleteAttachment = (index: number) => {
    urls = [...urls];
    urls.splice(index, 1);
    dispatch(
      setUploadedAttachments({
        cid: context.chatId,
        urls,
      })
    );
  };

  const openAttachment = (url: string) => {
    dispatch(setOpenedAttachment(url));
  };

  const renderAttachments = () => {
    return urls.map((url: string, index: number) => (
      <div key={url} className={s.attachment}>
        <div className={s.control}>
          <i className={`fas fa-trash-alt ${s.delete}`} onClick={() => deleteAttachment(index)}></i>
        </div>
        <img src={url} alt="img" onClick={() => openAttachment(url)} />
      </div>
    ));
  };

  return (
    <>
      <div className={s.wrapper}>{renderAttachments()}</div>
    </>
  );
};

export default AttachmentBar;
