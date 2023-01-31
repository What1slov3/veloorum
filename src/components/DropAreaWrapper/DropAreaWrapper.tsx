import React, { useEffect, useRef, useState } from 'react';
import FileDropArea from './FileDropArea/FileDropArea';
import { useDispatch, useSelector } from 'react-redux';
import { FCChildren, Store } from '@customTypes/common.types';
import { setUploadedAttachments } from '@store/appdata';
import API from '@api/index';

const DropAreaWrapper: React.FC<FCChildren> = ({ children }): JSX.Element => {
  const dispatch = useDispatch();

  const connection = useSelector((state: Store) => state.appdata.activeConnection);
  const chats = useSelector((state: Store) => state.chats);
  const modalIsActive = useSelector((state: Store) => state.appdata.activeModal.name);

  const [overlay, setOverlay] = useState<boolean>(false);

  const dragCountRef = useRef<number>(0);

  useEffect(() => {
    function onDragEnterHandler(e: DragEvent) {
      dragCountRef.current += 1;
      if (dragCountRef.current && !overlay && e.dataTransfer?.types.includes('Files')) setOverlay(true);
    }

    function onDrageLeaveHandler(e: DragEvent) {
      dragCountRef.current -= 1;
      if (!dragCountRef.current && overlay) setOverlay(false);
    }

    if (connection.chatId && !modalIsActive) {
      window.addEventListener('dragenter', onDragEnterHandler);
      window.addEventListener('dragleave', onDrageLeaveHandler);
    }

    return () => {
      window.removeEventListener('dragenter', onDragEnterHandler);
      window.removeEventListener('dragleave', onDrageLeaveHandler);
    };
  }, [overlay, connection.chatId, modalIsActive]);

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
