import React from 'react';
import { useSelector } from 'react-redux';
import { Store } from '@customTypes/common.types';
import { ModalName } from '@customTypes/modals.types';
import AttachmentModal from './AttachmentModal/AttachmentModal';
import ChangePasswordModal from './ChangePasswordModal/ChangePasswordModal';
import UserChangeDataModal from './ChangeUserDataModal/ChangeUserDataModal';
import ChannelSettingsModal from './ChannelSettingsModal/ChannelSettingsModal';
import ChatSettingsModal from './ChatSettingsModal/ChatSettingsModal';
import CreateChannelModal from './CreateChannelModal/CreateChannelModal';
import CreateChatModal from './CreateChatModal/CreateChatModal';
import DeleteMessageModal from './DeleteMessageModal/DeleteMessageModal';
import InviteLinkModal from './InviteLinkModal/InviteLinkModal';
import ModalWindow from './ModalWindow/ModalWindow';
import SymbolLimitModal from './SymbolLimitModal/SymbolLimitModal';

const modals: Record<NonNullable<ModalName>, any> = {
  attachment: AttachmentModal,
  changePassword: ChangePasswordModal,
  changeUserData: UserChangeDataModal,
  createChannel: CreateChannelModal,
  createChat: CreateChatModal,
  deleteMessage: DeleteMessageModal,
  inviteLink: InviteLinkModal,
  symbolLimit: SymbolLimitModal,
  channelSettings: ChannelSettingsModal,
  chatSettings: ChatSettingsModal,
};

const ActiveModal: React.FC = ({}): JSX.Element | null => {
  const modal = useSelector((state: Store) => state.appdata.activeModal);

  const renderModal = () => {
    if (modal.name) {
      const Modal = modals[modal.name];
      return (
        //TODO придумать, что-то получше
        <ModalWindow
          bottomShadow={modal.name !== 'attachment'}
          bgColor={modal.name == 'attachment' ? '#00000000' : undefined}
        >
          <Modal />
        </ModalWindow>
      );
    }
    return null;
  };

  return renderModal();
};

export default ActiveModal;
