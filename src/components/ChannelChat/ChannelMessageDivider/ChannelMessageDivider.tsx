import React from 'react';
import TimeFormatter from '@common/utils/TimeFormatter';
import s from './channelmessagedivider.module.css';

type Props = {
  date: number;
};

const ChannelMessageDivider: React.FC<Props> = ({ date }): JSX.Element => {
  return <div className={s.wrapper}>{new TimeFormatter(date).getDateSeparator()}</div>;
};

export default ChannelMessageDivider;
