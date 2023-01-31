import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findDatasetInParents } from '@common/utils/findDataInParents';
import { setOpenedUserCard } from '@store/appdata';
import { FCChildren, Store } from '@customTypes/common.types';
import { LoadedUser } from '@customTypes/redux/users.types';
import UserCard from './UserCard/UserCard';
import s from './usercardwrapper.module.css';

type Position = 'top' | 'right' | 'bottom' | 'left' | 'vertical' | 'horizontal';

type Props = {
  user: LoadedUser;
} & FCChildren;

const calcCoords = (
  width: number,
  height: number,
  x: number,
  y: number,
  wrapperWidth: number,
  wrapperHeight: number,
  pos: Position
) => {
  switch (pos) {
    case 'left':
      let nx = x - width - 5;
      let ny = y;
      return [nx, ny];
  }
};

const UserCardWrapper: React.FC<Props> = ({ children, user }): JSX.Element => {
  const dispatch = useDispatch();

  const openedUserCard = useSelector((state: Store) => state.appdata.openedUserCard);

  const wrapperRef = useRef<HTMLDivElement>(null!);
  const cardRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    function onCloseUserCardHandler(e: MouseEvent) {
      if (
        !findDatasetInParents(e.target as HTMLElement, 'card') &&
        !findDatasetInParents(e.target as HTMLElement, 'cardHandler')
      ) {
        dispatch(setOpenedUserCard(false));
      }
    }

    if (openedUserCard) {
      document.addEventListener('mouseup', onCloseUserCardHandler);
    }

    if (openedUserCard === user.uuid) calculateCoords();

    return () => {
      document.removeEventListener('mouseup', onCloseUserCardHandler);
    };
  }, [openedUserCard]);

  const calculateCoords = () => {
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();
    const coords = calcCoords(
      cardRect.width,
      cardRect.height,
      wrapperRect.x,
      wrapperRect.y,
      wrapperRect.width,
      wrapperRect.height,
      'left'
    );
    cardRef.current.style.left = coords![0] + 'px';
    cardRef.current.style.top = coords![1] + 'px';
  };

  const handleClick = (e: any) => {
    const nextId = openedUserCard === user.uuid ? null : user.uuid;
    dispatch(setOpenedUserCard(nextId));
  };

  return (
    <div className={s.wrapper} ref={wrapperRef} data-card-wrapper="true">
      <div data-card-handler="true" onClick={handleClick}>
        {children}
      </div>
      {openedUserCard === user.uuid && (
        <div className={s.card} ref={cardRef} data-card="true">
          <UserCard user={user} />
        </div>
      )}
    </div>
  );
};

export default UserCardWrapper;
