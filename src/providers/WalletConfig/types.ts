import React from 'react';
import { WagmiProviderProps } from 'wagmi';

export type OnConnectSuccessData = {
  chainId: number;
  connector: {
    id: string;
    name: string;
  };
  walletAddress: string;
};

export type OnSwitchChainSuccessData = {
  chainId: number;
  chainName: string;
};

export type OnConnectErrorData = {
  message: string;
  name: string;
};

export type OnDisconnectErrorData = {
  message: string;
  name: string;
};

export type OnSwitchChainErrorData = {
  message: string;
  name: string;
};

export type IntegratorProps = {
  /**
   * A callback, fired when connection to wallet has failed
   */
  onConnectError?: (data: OnConnectErrorData) => void;
  /**
   * A callback, fired when connection to wallet has succeeded
   */
  onConnectSuccess?: (data: OnConnectSuccessData) => void;
  /**
     A callback, fired when disconnect from wallet has failed
     */
  onDisconnectError?: (data: OnDisconnectErrorData) => void;
  /**
   * A callback, fired when disconnect from wallet has succeeded
   */
  onDisconnectSuccess?: () => void;
  /**
   * A callback, fired when chain is switched
   */
  onSwitchChainError?: (data: OnSwitchChainErrorData) => void;
  /**
   * A callback, fired when chain is switched
   */
  onSwitchChainSuccess?: (data: OnSwitchChainSuccessData) => void;
};

type WagmiSetupProps = {
  /**
   * The configuration object obtained after calling the `setup` function
   * from `@reyaxyz/react-web3-wallet`.
   */
  config: WagmiProviderProps['config'];
};
/**
 * Props for configuring the wallet component.
 */
export type WalletConfigProps = React.PropsWithChildren<WagmiSetupProps & IntegratorProps>;
