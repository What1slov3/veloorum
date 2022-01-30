import React, { CSSProperties, ReactElement, useEffect, useRef, useState } from 'react';
import s from './tooltipwrapper.module.css';

type TProps = {
  tooltipContent: ReactElement;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  showingDelay?: number;
  style?: CSSProperties;
};

const TooltipWrapper: React.FC<TProps> = ({
  children,
  tooltipContent,
  position = 'top',
  delay,
  showingDelay,
  style,
}): JSX.Element => {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isShowing, setIsShowing] = useState(false);
  const [mouseOnTooltip, setMouseOnTooltip] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null!);
  const tooltipRef = useRef<HTMLDivElement>(null!);
  const delayRef = useRef<NodeJS.Timeout>();
  const showingDelayRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isShowing) {
      calculateCoords();
    }
  }, [isShowing]);

  const calculateCoords = () => {
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    switch (position) {
      case 'top': {
        setCoords({
          x: wrapperRect.left + (wrapperRect.width - tooltipRect.width) / 2,
          y: wrapperRect.top - tooltipRect.height - 5,
        });
        break;
      }
      case 'right': {
        setCoords({
          x: wrapperRect.left + wrapperRect.width + 10,
          y: wrapperRect.top + (wrapperRect.height - tooltipRect.height) / 2,
        });
        break;
      }
      case 'bottom': {
        setCoords({
          x: wrapperRect.left + (wrapperRect.width - tooltipRect.width) / 2,
          y: wrapperRect.top + wrapperRect.height + 5,
        });
        break;
      }
      case 'left': {
        setCoords({
          x: wrapperRect.left - wrapperRect.width - 10,
          y: wrapperRect.top + (wrapperRect.height - tooltipRect.height) / 2,
        });
        break;
      }
    }
  };

  const onMouseEnter = (e: React.MouseEvent) => {
    if (showingDelay) {
      showingDelayRef.current = setTimeout(() => setIsShowing(true), showingDelay * 1000);
    } else {
      setIsShowing(true);
    }
  };

  const hideTooltip = () => {
    if (showingDelayRef.current) {
      clearTimeout(showingDelayRef.current);
    }
    setIsShowing(false);
    setCoords({ x: -1000, y: -1000 });
  };

  const onMouseLeave = () => {
    if (delay && !mouseOnTooltip) {
      startDelay();
      return;
    } else if (delay && mouseOnTooltip) {
      return;
    }
    hideTooltip();
  };

  const startDelay = () => {
    if (delay) {
      delayRef.current = setTimeout(() => {
        hideTooltip();
      }, delay);
    }
  };

  const resetTimeout = () => {
    if (delayRef.current) {
      clearTimeout(delayRef.current);
    }
  };

  return (
    <div className={s.wrapper} ref={wrapperRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={style}>
      {isShowing && (
        <div
          ref={tooltipRef}
          className={s.tooltip__wrapper}
          style={{ position: 'fixed', top: coords.y + 'px', left: coords.x + 'px', zIndex: 1000 }}
          onMouseEnter={() => {
            setMouseOnTooltip(true);
            resetTimeout();
          }}
          onMouseLeave={() => {
            startDelay();
            setMouseOnTooltip(false);
          }}
        >
          {tooltipContent}
        </div>
      )}
      {children}
    </div>
  );
};

export default TooltipWrapper;