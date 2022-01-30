import React, { Component, useCallback, useRef } from 'react';
import s from './infinitescroll.module.css';

type TProps = {
  loader?: JSX.Element | Component; // Прелоадер, показывается, если передан
  next: Function; // Функция загрузки следующих данных
  end?: JSX.Element | Component; // Компонент отображаемый в конце, когда загрузка кончилась
  hasMore: boolean; // Есть ли еще данные для загрузки
  loading: boolean; // Идет ли сейчас загрузка
  getScroll: Function; // Переместиться не предыдущее место скролла, чтобы избежать залипания
};

const InfiniteScroll: React.FC<TProps> = ({
  children,
  loader,
  next,
  end,
  hasMore,
  loading,
  getScroll,
}): JSX.Element => {
  const intersectionObserver = useRef<IntersectionObserver>();
  const topOfListRef = useCallback(
    (node) => {
      if (loading) return;
      if (intersectionObserver.current) intersectionObserver.current.disconnect();
      intersectionObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!loading && hasMore) {
            getScroll();
            next();
          }
        }
      });
      if (node) intersectionObserver.current.observe(node);
    },
    [loading, hasMore, next]
  );

  return (
    <div className={s.wrapper}>
      <div className={s.item_wrapper}>
        <div ref={topOfListRef}></div>
        {!hasMore && end && end}
        {loading && loader && loader}
        {children}
      </div>
    </div>
  );
};

export default InfiniteScroll;
