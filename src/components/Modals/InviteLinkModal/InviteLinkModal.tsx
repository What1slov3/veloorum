import React, { useEffect, useState } from 'react';
import ModalButton from '../ModalWindow/ModalButton/ModalButton';
import ModalWindow from '../ModalWindow/ModalWindow';
import { TModalWindowArgs } from '../../../types/hooks';
import Spacer from '../../../templates/Spacer';
import API from '../../../api';
import { useSelector } from 'react-redux';
import { TStore } from '../../../types/common';
import ModalHeader from '../ModalWindow/ModalHeader/ModalHeader';
import ModalControl from '../ModalWindow/ModalControl/ModalControl';
import s from './invitelinkmodal.module.css';

type TProps = {
  cid: string;
} & TModalWindowArgs;

const InviteLinkModal: React.FC<TProps> = ({ isFading, close, cid }): JSX.Element => {
  const channels = useSelector((state: TStore) => state.channels);
  const uid = useSelector((state: TStore) => state.user.uuid);

  // ! ВНИМАНИЕ
  // TODO Переделать тут все

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

  // ! ПОКА СЕРВЕР И ФРОНТ НАХОДЯТСЯ НА РАЗНЫХ ДОМЕНАХ
  const setLinkHandle = (string: string) => {
    setLink(string.replace(/3001/gm, '3000'));
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
  };

  const generateNewLink = async () => {
    if (isOwner) setLink((await API.invites.CreateInvite(cid)).url);
  };

  return (
    <ModalWindow isFading={isFading} close={close}>
      <div className={s.wrapper}>
        <ModalHeader style={{ padding: '20px' }}>
          <h5>Пригласите своих друзей!</h5>
          <div>И не только их...</div>
        </ModalHeader>
        <div className={s.content}>
          <Spacer height={10} />
          <div className={s.link} id={!link ? s.preload : undefined}>
            {link}
          </div>
          <Spacer height={15} />
          <ModalControl>
            {isOwner && <ModalButton onClick={generateNewLink}>Создать новую</ModalButton>}
            <Spacer width={10} />
            <ModalButton style={{ background: 'var(--astro)' }} onClick={copyLink}>
              Копировать
            </ModalButton>
          </ModalControl>
        </div>
      </div>
    </ModalWindow>
  );
};

export default InviteLinkModal;
