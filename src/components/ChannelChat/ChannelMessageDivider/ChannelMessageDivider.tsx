import React from 'react';
import s from './channelmessagedivider.module.css';
import TimeFormatter from '../../../common/utils/TimeFormatter';

type TProps = {
  date: number;
};

const ChannelMessageDivider: React.FC<TProps> = ({ date }): JSX.Element => {
  return <div className={s.wrapper}>{new TimeFormatter(date).getDateSeparator()}</div>;
};

export default ChannelMessageDivider;
