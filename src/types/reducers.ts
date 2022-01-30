export type TDefaultAction<T> = {
  type: string;
  payload: T;
};

export type TPendingAction<T> = {
  meta: {
    arg: T;
    requestId: string;
    requestStatus: 'pending' | 'fulfilled' | 'rejected';
  };
  payload: undefined;
  type: string;
};
