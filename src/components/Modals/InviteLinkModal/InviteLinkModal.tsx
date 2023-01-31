import React, { useEffect, useState } from 'react';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import API from '@api/index';
import { useSelector } from 'react-redux';
import { Store } from '@customTypes/common.types';
import ModalHeader from '../ModalWindow/ModalHeader/ModalHeader';
import ModalControl from '../ModalWindow/ModalControl/ModalControl';
import { InviteLinkPayload } from '@customTypes/modals.types';
import s from './invitelinkmodal.module.css';

type Props = {
  onClose: () => void;
};

const InviteLinkModal: React.FC<Props> = ({ onClose }): JSX.Element => {
  const channels = useSelector((state: Store) => state.channels);
  const uid = useSelector((state: Store) => state.user.uuid);
  const { cid } = useSelector((state: Store) => state.appdata.activeModal.payload as InviteLinkPayload);

  const [link, setLink] = useState('');
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    (async function () {
      const newLink = await API.invites.GetInvite(cid);
      setLink(newLink.url);
    })();
  }, []);

  useEffect(() => {
    if (cid && channels) {
      setIsOwner(channels[cid]?.ownerId === uid);
    }
  }, [cid, channels]);

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    onClose();
  };

  const generateNewLink = async () => {
    if (isOwner) setLink((await API.invites.CreateInvite(cid)).url);
  };

  return (
    <div className={s.wrapper}>
      <ModalHeader style={{ padding: '20px' }}>
        <h5>Пригласите своих друзей!</h5>
        <div>И не только их...</div>
      </ModalHeader>
      <div className={s.content}>
        <div className={s.link} id={!link ? s.preload : undefined}>
          {link}
        </div>
        <ModalControl>
          {isOwner && <ModalButton onClick={generateNewLink}>Создать новую</ModalButton>}
          <ModalButton style={{ background: 'var(--astro)' }} onClick={copyLink}>
            Копировать
          </ModalButton>
        </ModalControl>
      </div>
    </div>
  );
};

export default InviteLinkModal;
