import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useModal from '../../../common/hooks/useModal';
import { fetchUploadAvatar } from '../../../store/user/thunk';
import InputTitle from '../../../templates/Inputs/InputTitle/InputTitle';
import Spacer from '../../../templates/Spacer';
import { TStore } from '../../../types/common';
import Avatar from '../../Avatar/Avatar';
import ChangeUserDataModal from '../../Modals/ChangeUserDataModal/ChangeUserDataModal';
import ChangePasswordModal from '../../Modals/ChangePasswordModal/ChangePasswordModal';
import s from './profilecategory.module.css';

const ProfileCategory: React.FC = ({}): JSX.Element => {
  const dispatch = useDispatch();

  const user = useSelector((state: TStore) => state.user);

  const changeModal = useModal();
  const changePasswordModal = useModal();

  const [isShowEmail, setShowEmail] = useState(false);
  const [newAvatarURL, setNewAvatarURL] = useState<string>();
  const [newAvatar, setNewAvatar] = useState<File>();

  useEffect(() => {
    if (newAvatar) dispatch(fetchUploadAvatar(newAvatar));
  }, [newAvatar]);

  const uploadIcon = (e: any) => {
    if (!e.target.files[0] || !e.target.files[0].type.startsWith('image/')) return;
    setNewAvatar(e.target.files[0]);
    setNewAvatarURL(URL.createObjectURL(e.target.files[0]));
  };

  const renderEmail = () => {
    const splitEmail = user.email.split('@');
    return isShowEmail ? user.email : `${splitEmail[0].replace(/./g, '*')}@${splitEmail[1]}`;
  };

  return (
    <>
      <div className={s.wrapper}>
        <section className={s.info}>
          <h5>Мой профиль</h5>
          <div className={s.main_info}>
            <div className={s.avatar_changer}>
              <div className={s.overlay}></div>
              <input
                className={s.file_loader}
                multiple={false}
                type="file"
                accept="image/*"
                onChange={uploadIcon}
                id="avatar"
                title=""
              />
              <label htmlFor="avatar">
                <i className="fal fa-camera" id={s.avatar_icon}></i>
              </label>
              <Avatar
                url={newAvatarURL || user.avatarUrl}
                username={user.username}
                style={{ height: '100px', width: '100px' }}
              />
            </div>
            <Spacer width={20} />
            <div>
              <div className={s.username}>
                {user.username}
                <span className={s.tag}>#{user.tag}</span>
              </div>
            </div>
          </div>
          <div className={s.profile_control}>
            <div className={s.field_wrapper}>
              <div>
                <InputTitle>Имя пользователя</InputTitle>
                <div className={`${s.username} ${s.field}`}>
                  {user.username}
                  <span className={s.tag}>#{user.tag}</span>
                </div>
              </div>
              <div className={s.edit_button} onClick={() => changeModal.open('username')}>
                Изменить
              </div>
            </div>
            <div className={s.field_wrapper}>
              <div>
                <InputTitle>Электронная почта</InputTitle>
                <div className={`${s.email} ${s.field}`}>
                  {renderEmail()}
                  <span className={s.show_email} onClick={() => setShowEmail(!isShowEmail)}>
                    Показать
                  </span>
                </div>
              </div>
              <div className={s.edit_button} onClick={() => changeModal.open('email')}>
                Изменить
              </div>
            </div>
          </div>
        </section>
        <section className={s.security}>
          <h5>Безопасность</h5>
          <div className={s.field_wrapper}>
            <div className={s.edit_button} onClick={changePasswordModal.open}>
              Изменить пароль
            </div>
          </div>
        </section>
      </div>
      {changeModal.isOpen && (
        <ChangeUserDataModal
          username={user.username}
          email={user.email}
          isFading={changeModal.isFading}
          close={changeModal.close}
          type={changeModal.payload as 'username' | 'email'}
        />
      )}
      {changePasswordModal.isOpen && (
        <ChangePasswordModal isFading={changePasswordModal.isFading} close={changePasswordModal.close} />
      )}
    </>
  );
};

export default ProfileCategory;
