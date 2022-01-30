import React, { CSSProperties, ReactElement, useState } from 'react';
import Spacer from '../../templates/Spacer';
import s from './accordion.module.css';

type TProps = {
  title: string | ReactElement<HTMLSpanElement>;
  openByDefault?: boolean;
  titleStyle?: CSSProperties;
  extraButton?: JSX.Element;
  activeBlock?: JSX.Element;
};

const Accordion: React.FC<TProps> = ({
  children,
  title,
  titleStyle,
  extraButton,
  activeBlock,
  openByDefault = true,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(openByDefault);

  return (
    <div className={s.wrapper}>
      <div className={s.control}>
        <div className={s.control_title_wrapper} onClick={() => setIsOpen(!isOpen)}>
          <i className={`far fa-chevron-down ${s.arrow}`} id={isOpen ? s.open : undefined}></i>
          <Spacer width={10} />
          <div className={s.title} style={titleStyle}>
            {title}
          </div>
        </div>
        <div>
          <Spacer width={10} />
          {extraButton}
        </div>
      </div>
      <div className={s.list} id={!isOpen ? undefined : s.open_list}>
        <Spacer height={5} />
        {children}
      </div>
      {!isOpen && (
        <>
          <Spacer height={5} />
          <div className={s.active_block}>{activeBlock}</div>
        </>
      )}
    </div>
  );
};

export default Accordion;
