import React, { CSSProperties, ReactElement, useState } from 'react';
import { FCChildren } from '@customTypes/common.types';
import s from './accordion.module.css';

type Props = {
  title: string | ReactElement<HTMLSpanElement>;
  openByDefault?: boolean;
  titleStyle?: CSSProperties;
  extraButton?: JSX.Element;
  activeBlock?: JSX.Element;
} & FCChildren;

const Accordion: React.FC<Props> = ({
  children,
  title,
  titleStyle,
  extraButton,
  activeBlock,
  openByDefault = true,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(openByDefault);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.control}>
        <div className={s.control_title_wrapper} onClick={onClick}>
          <i className={`fas fa-chevron-down ${s.arrow}`} id={isOpen ? s.open : undefined}></i>
          <div className={s.title} style={titleStyle}>
            {title}
          </div>
        </div>
        <div>{extraButton}</div>
      </div>
      <div className={s.list} id={!isOpen ? undefined : s.open_list}>
        {children}
      </div>
      {!isOpen && <div className={s.active_block}>{activeBlock}</div>}
    </div>
  );
};

export default Accordion;
