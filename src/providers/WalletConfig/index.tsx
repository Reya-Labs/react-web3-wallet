import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider, WagmiProviderProps } from 'wagmi';
import {
  DynamicContextProvider,
  DynamicWagmiConnector,
  EthereumWalletConnectors,
} from '../../setup/dynamic';

/**
 * Props for configuring the wallet component.
 */
export type WalletConfigProps = React.PropsWithChildren<{
  /**
   * The configuration object obtained after calling the `setup` function
   * from `@reyaxyz/react-web3-wallet`.
   */
  config: WagmiProviderProps['config'];
}>;

const queryClient = new QueryClient();

export const WalletConfig: React.FunctionComponent<WalletConfigProps> = ({ config, children }) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: '929f1445-6866-4eda-a025-b9e848d78092',
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
};
