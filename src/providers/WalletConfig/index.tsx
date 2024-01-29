import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider, WagmiProviderProps } from 'wagmi';

/**
 * Props for configuring the wallet component.
 */
export type WalletConfigProps = React.PropsWithChildren<{
  /**
   * The configuration object obtained after calling the `setup` function
   * from `@voltz-protocol/react-web3-wallet`.
   */
  config: WagmiProviderProps['config'];
}>;

const queryClient = new QueryClient();

export const WalletConfig: React.FunctionComponent<WalletConfigProps> = ({ config, children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
