import { createContext, useContext } from 'react';

import { IntegratorProps } from '../WalletConfig/types';

const noop = () => {};

export const IntegratorPropsContext = createContext<IntegratorProps>({
  onConnectError: noop,
  onConnectSuccess: noop,
  onDisconnectError: noop,
  onDisconnectSuccess: noop,
});

export const useIntegratorProps = () => useContext(IntegratorPropsContext);
