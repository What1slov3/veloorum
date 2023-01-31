import React, { ReactNode, useMemo, useState } from 'react';
import { MessageContent } from '@customTypes/redux/chats.types';
import s from './messageattachment.module.css';

type Props = {
  openAttachmentModal: (url: string) => void;
  content: MessageContent | { text: ReactNode[] };
};

const MessageAttachment: React.FC<Props> = ({ content, openAttachmentModal }): JSX.Element => {
  const [failedAttachments, setFailedAttachments] = useState<string[]>([]);

  const handleError = (e: any) => {
    setFailedAttachments([...failedAttachments, (e.target as HTMLImageElement).src]);
  };

  const handleLoad = (e: any) => {
    (e.target as HTMLImageElement).classList.add(s.loaded_image);
  };

  const renderAttachments = useMemo(() => {
    return (content as MessageContent).attachments?.map((url) => {
      if (failedAttachments.includes(url)) {
        return (
          <div key={url} className={s.failed_image}>
            Вероятно, тут была красивая картинка :(
          </div>
        );
      }

      const openAttachmentHandler = () => {
        openAttachmentModal(url);
      };

      return (
        <img
          key={url}
          src={url}
          className={s.attachment_image}
          onLoad={handleLoad}
          onError={handleError}
          onClick={openAttachmentHandler}
        />
      );
    });
  }, [content, failedAttachments]);

  return <div className={s.wrapper}>{renderAttachments}</div>;
};

export default MessageAttachment;
