/**
 * Configuration for the MetaMask wallet.
 */
export type MetaMaskWalletConfig = {
  type: 'metamask';
};

/**
 * Configuration for the Coinbase wallet.
 * @param appName - The name of the app using the wallet.
 */
export type CoinbaseWalletConfig = {
  type: 'coinbase';
  appName: string;
};

/**
 * Configuration for the WalletConnect wallet.
 * @param projectId - The WalletConnect project ID.
 */
export type WalletConnectWalletConfig = {
  type: 'wallet-connect';
  projectId: string;
};

/**
 * Union type representing supported wallet configurations.
 * It can be either MetaMask, Coinbase, or WalletConnect wallet.
 */
export type SupportedWallets =
  | MetaMaskWalletConfig
  | CoinbaseWalletConfig
  | WalletConnectWalletConfig;

/**
 * Parameters for setting up the wallet component.
 * @param supportedChains - An array of supported Ethereum chains.
 * @param supportedWallets - An array of supported wallet configurations.
 */
export type SetupParams = {
  supportedChains: number[];
  supportedWallets: SupportedWallets[];
};
