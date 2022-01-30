import { PROCESS_ENV } from '../../env/env';

export const isDev = () => {
  return PROCESS_ENV.env === 'dev' ? true : false;
};
