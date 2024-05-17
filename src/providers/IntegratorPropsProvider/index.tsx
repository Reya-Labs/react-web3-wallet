import { createContext, useContext } from 'react';

import { IntegratorProps } from '../WalletConfig/types';

const noop = () => {};

export const IntegratorPropsContext = createContext<IntegratorProps>({
  onConnectError: noop,
  onConnectSuccess: noop,
  onDisconnectError: noop,
  onDisconnectSuccess: noop,
});

export const useIntegratorProps = () => {
  const context = useContext(IntegratorPropsContext);
  if (!context) {
    throw new Error('useIntegratorProps must be used inside IntegratorPropsContext');
  }
  return context;
};
