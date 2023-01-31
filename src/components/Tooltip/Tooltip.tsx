import React, { useEffect, useRef, useState } from 'react';
import { normalizeInnerCoords, Coords } from '@common/utils/normalizeInnerCoords';
import { FCChildren, FCStyle } from '@customTypes/common.types';
import TooltipBox from './TooltipBox/TooltipBox';
import s from './tooltip.module.css';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

const calculateTooltipCoords = (
  wrapperRect: DOMRect,
  tooltipRect: DOMRect,
  position: TooltipPosition,
  tooltipGap: number = 0
): Coords => {
  switch (position) {
    case 'top':
      return {
        x: wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2,
        y: wrapperRect.top - tooltipRect.height - tooltipGap,
      };
    case 'right':
      return {
        x: wrapperRect.left + wrapperRect.width + tooltipGap,
        y: wrapperRect.top + wrapperRect.height / 2 - tooltipRect.height / 2,
      };
    case 'bottom':
      return {
        x: wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2,
        y: wrapperRect.top + wrapperRect.height + tooltipGap,
      };
    case 'left':
      return {
        x: wrapperRect.left - tooltipRect.width - tooltipGap,
        y: wrapperRect.top + wrapperRect.height / 2 - tooltipRect.height / 2,
      };
    default:
      return { x: 10, y: 10 };
  }
};

type Props = FCChildren &
  FCStyle & {
    positionType?: 'absoulte' | 'fixed';
    tooltipGap?: number;
    position?: TooltipPosition;
    vNoramalize?: boolean;
    hNoramalize?: boolean;
    delay?: number;
  } & (
    | {
        text: string;
        tooltipElement?: never;
      }
    | { text?: never; tooltipElement: React.ReactNode }
  );

const Tooltip: React.FC<Props> = ({
  children,
  tooltipElement,
  text = '',
  positionType = 'fixed',
  tooltipGap = 10,
  position = 'top',
  hNoramalize = true,
  vNoramalize = true,
  delay = 0,
  style,
}): JSX.Element => {
  const tooltipWrapperRef = useRef<HTMLDivElement>(null!);
  const tooltipRef = useRef<HTMLDivElement>(null!);

  const delayRef = useRef<NodeJS.Timeout>();

  const [isVisible, setIsVisible] = useState(false);
  const [boxCoords, setBoxCoords] = useState<Coords>({ x: 0, y: 0 });

  const onVisible = () => {
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const tooltipWrapperRect = tooltipWrapperRef.current.getBoundingClientRect();

    const coords = calculateTooltipCoords(tooltipWrapperRect, tooltipRect, position, tooltipGap);

    setBoxCoords(normalizeInnerCoords(coords, tooltipRect, hNoramalize, vNoramalize));
  };

  useEffect(() => {
    if (isVisible) onVisible();
  }, [isVisible]);

  const onTooltipMouseEnter = () => {
    if (delay) {
      delayRef.current = setTimeout(() => setIsVisible(true), delay);
      return;
    }
    setIsVisible(true);
  };

  const onTooltipMouseLeave = () => {
    if (delay) clearTimeout(delayRef.current);
    setIsVisible(false);
  };

  return (
    <div
      ref={tooltipWrapperRef}
      style={style}
      onPointerEnter={onTooltipMouseEnter}
      onPointerLeave={onTooltipMouseLeave}
    >
      {isVisible && (
        <div
          ref={tooltipRef}
          style={{
            position: positionType as any,
            left: `${boxCoords.x}px`,
            top: `${boxCoords.y}px`,
            opacity: !boxCoords.x || !boxCoords.y ? 0 : 1,
          }}
          className={s.tooltipBox}
        >
          {tooltipElement || <TooltipBox>{text}</TooltipBox>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Tooltip;
