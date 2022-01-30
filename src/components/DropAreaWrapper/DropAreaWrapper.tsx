import React, { useEffect, useRef, useState } from 'react';
import FileDropArea from './FileDropArea/FileDropArea';
import { useDispatch, useSelector } from 'react-redux';
import { TStore } from '../../types/common';
import { setUploadedAttachments } from '../../store/appdata';
import API from '../../api';

const DropAreaWrapper: React.FC = ({ children }): JSX.Element => {
  const dispatch = useDispatch();

  const connection = useSelector((state: TStore) => state.appdata.activeConnection);
  const chats = useSelector((state: TStore) => state.chats);

  const [overlay, setOverlay] = useState<boolean>(false);

  const dragCountRef = useRef<number>(0);

  useEffect(() => {
    if (connection.chatId) {
      window.ondragenter = (e: any) => {
        dragCountRef.current += 1;
        if (dragCountRef.current && !overlay && e.dataTransfer.types.includes('Files')) setOverlay(true);
      };
      window.ondragleave = () => {
        dragCountRef.current -= 1;
        if (!dragCountRef.current && overlay) setOverlay(false);
      };
    }
  }, [overlay, connection.chatId]);

  const uploadIcon = async (e: any) => {
    let files: File[] = [];
    for (let i = 0; i < e.dataTransfer.files.length && i < 3; i++) {
      const file = e.dataTransfer.files[i];
      if (file && file.type.startsWith('image/')) {
        files.push(file);
      }
    }

    if (files.length) {
      const urls = await API.files.UploadFiles(files);
      if (urls) dispatch(setUploadedAttachments({ cid: connection.chatId, urls }));
    }
  };

  const handleDrop = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (overlay && connection.chatId) {
      await uploadIcon(e);
      setOverlay(false);
      dragCountRef.current = 0;
    }
  };

  const handleDragOver = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop}>
      {children}
      {overlay && connection.chatId && <FileDropArea title={`#${chats[connection.chatId].title}`} />}
    </div>
  );
};

export default DropAreaWrapper;
