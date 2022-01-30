import React, { useState } from 'react';
import { lsa } from '../../..';
import InputTitle from '../../../templates/Inputs/InputTitle/InputTitle';
import Range from '../../Range/Range';
import s from './appearancecategory.module.css';

const AppearanceCategory: React.FC = ({}): JSX.Element => {
  const [fontSize, setFontSize] = useState(lsa.getAppSettings('fontSize'));
  const [messageGroupGap, setMessageGroupGap] = useState(lsa.getAppSettings('messageGroupGap'));

  const setterFontSize = (value: number) => {
    setFontSize(value);
    lsa.setAppSetting('fontSize', value);
  };

  const setterMessageGroupGap = (value: number) => {
    setMessageGroupGap(value);
    lsa.setAppSetting('messageGroupGap', value);
  };

  return (
    <div className={s.wrapper}>
      <h5>Внешний вид</h5>
      <div className={s.field_wrapper}>
        <InputTitle>Размер текста сообщений</InputTitle>
        <Range
          start={12}
          end={20}
          values={[12, 14, 15, 16, 18, 20]}
          curValue={fontSize}
          setCurValue={setterFontSize}
          defaultValue={14}
        />
      </div>
      <div className={s.field_wrapper}>
        <InputTitle>Расстояние между группами сообщений</InputTitle>
        <Range
          start={0}
          end={16}
          values={[0, 4, 8, 12, 16]}
          curValue={messageGroupGap}
          setCurValue={setterMessageGroupGap}
          defaultValue={4}
        />
      </div>
    </div>
  );
};

export default AppearanceCategory;
