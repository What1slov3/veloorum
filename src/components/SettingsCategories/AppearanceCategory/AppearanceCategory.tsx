import React, { useState } from 'react';
import { lsa } from '../../..';
import useRange from '@common/hooks/useRange';
import InputTitle from '../../../templates/Inputs/InputTitle/InputTitle';
import Range from '@components/Range/Range';
import s from './appearancecategory.module.css';

const AppearanceCategory: React.FC = ({}): JSX.Element => {
  const [fontSize, setFontSize] = useRange({
    defaultValue: lsa.getSettings('fontSize'),
    onSet: (value) => {
      lsa.setSetting('fontSize', value);
    },
  });
  const [messageGroupGap, setMessageGroupGap] = useRange({
    defaultValue: lsa.getSettings('messageGroupGap'),
    onSet: (value) => {
      lsa.setSetting('messageGroupGap', value);
    },
  });

  return (
    <div className={s.wrapper}>
      <h5>Внешний вид</h5>
      <div className={s.field_wrapper}>
        <InputTitle>Размер текста сообщений</InputTitle>
        <Range
          start={12}
          end={20}
          values={[12, 14, 15, 16, 18, 20]}
          value={fontSize}
          setValue={setFontSize}
          defaultValue={14}
        />
      </div>
      <div className={s.field_wrapper}>
        <InputTitle>Расстояние между группами сообщений</InputTitle>
        <Range
          start={0}
          end={16}
          values={[0, 4, 8, 12, 16]}
          value={messageGroupGap}
          setValue={setMessageGroupGap}
          defaultValue={4}
        />
      </div>
    </div>
  );
};

export default AppearanceCategory;
