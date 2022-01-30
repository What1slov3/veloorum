import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import s from './range.module.css';

type TProps = {
  start: number;
  end: number;
  values: number[];
  curValue: number;
  setCurValue: (value: number) => void;
  defaultValue: number;
};

// TODO рефакторить

const Range: React.FC<TProps> = ({ start, end, values, setCurValue, curValue, defaultValue }): JSX.Element => {
  const [renderedValues, setRenderedValues] = useState<JSX.Element[]>([]);

  const grabberRef = useRef<HTMLDivElement>(null!);
  const rangeRef = useRef<HTMLDivElement>(null!);
  const activeRangeRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const offset = (rangeRef.current.getBoundingClientRect().width / (end - start)) * (curValue - values[0]);
    if (grabberRef.current) {
      if (curValue !== values[values.length - 1]) {
        if (offset > 7.5) {
          grabberRef.current.style.left = offset - 7.5 + 'px';
          activeRangeRef.current.style.width = offset + 7 + 'px';
        } else {
          grabberRef.current.style.left = offset + 'px';
          activeRangeRef.current.style.width = offset + 7 + 'px';
        }
      } else {
        grabberRef.current.style.left = offset - 15 + 'px';
        activeRangeRef.current.style.width = offset + 'px';
      }
    }
  }, [rangeRef, grabberRef, activeRangeRef, curValue]);

  useEffect(() => {
    if (rangeRef.current) {
      const valueOffset = rangeRef.current.getBoundingClientRect().width / (end - start);
      setRenderedValues(
        values.map((value, index) => {
          return (
            <div
              key={value}
              className={classNames({ [s.value_track_point]: true, [s.default]: value === defaultValue })}
              style={{
                left:
                  index === 0
                    ? 7.5
                    : index === values.length - 1
                    ? valueOffset * (value - values[0]) - 7.5
                    : valueOffset * (value - values[0]) + 'px',
              }}
            >
              <div className={s.point_value}>{value}px</div>
              <div className={s.point_mark}></div>
            </div>
          );
        })
      );
    }
  }, [rangeRef, curValue]);

  return (
    <div className={s.wrapper}>
      <div
        className={s.grabber}
        ref={grabberRef}
        onMouseDown={(event: any) => {
          event.preventDefault();

          let shiftX = event.clientX - grabberRef.current.getBoundingClientRect().left;

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);

          function onMouseMove(event: any) {
            let newLeft = event.clientX - shiftX - rangeRef.current.getBoundingClientRect().left;
            if (newLeft < 0) {
              newLeft = 0;
            }
            let rightEdge = rangeRef.current.offsetWidth - grabberRef.current.offsetWidth;
            if (newLeft > rightEdge) {
              newLeft = rightEdge;
            }

            let smallest: number;
            let index: number = 0;
            let offsetOneSize = rangeRef.current.getBoundingClientRect().width / (end - start);
            values.map((curValue, i) => {
              let offsetValue = offsetOneSize * (curValue - values[0]);
              if (!newLeft) index = 0;
              if (!smallest) smallest = Math.abs(offsetValue - newLeft);
              if (Math.abs(offsetValue - newLeft) < smallest) {
                smallest = Math.abs(offsetValue - newLeft);
                index = i;
              }
            });
            setCurValue(values[index]);
          }

          function onMouseUp() {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
          }
        }}
      ></div>
      <div className={s.track} ref={rangeRef}></div>
      <div className={s.active_range} ref={activeRangeRef}></div>
      {renderedValues}
    </div>
  );
};

export default Range;
