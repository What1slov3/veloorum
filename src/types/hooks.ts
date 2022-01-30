export type TModalWindowArgs = {
  isFading: boolean;
  close: () => void | Function;
};

export type TModalOpenFunc<T> = (payload?: T) => void;
