import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider } from 'wagmi';

import { IntegratorPropsContext } from '../IntegratorPropsProvider';
import { WalletConfigProps } from './types';

const queryClient = new QueryClient();

export const WalletConfig: React.FunctionComponent<WalletConfigProps> = ({
  onDisconnectSuccess,
  onConnectSuccess,
  onConnectError,
  onDisconnectError,
  onSwitchChainSuccess,
  onSwitchChainError,
  config,
  children,
}) => {
  return (
    <IntegratorPropsContext.Provider
      value={{
        onConnectError,
        onConnectSuccess,
        onDisconnectError,
        onDisconnectSuccess,
        onSwitchChainError,
        onSwitchChainSuccess,
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </IntegratorPropsContext.Provider>
  );
};
