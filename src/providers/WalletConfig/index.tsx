import React from 'react';
import { WagmiConfig, WagmiConfigProps } from 'wagmi';

/**
 * Props for configuring the wallet component.
 */
export type WalletConfigProps = React.PropsWithChildren<{
  /**
   * The configuration object obtained after calling the `setup` function
   * from `@voltz-protocol/react-web3-wallet`.
   */
  config: WagmiConfigProps['config'];
}>;

export const WalletConfig: React.FunctionComponent<WalletConfigProps> = ({ config, children }) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};
