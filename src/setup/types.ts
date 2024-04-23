/**
 * Configuration for the MetaMask wallet.
 */
export type MetaMaskWalletConfig = {
  type: 'metamask';
};

/**
 * Configuration for the Rabby wallet.
 */
export type RabbyWalletConfig = {
  type: 'rabby';
};

/**
 * Configuration for the Coinbase wallet.
 * @param appName - The name of the app using the wallet.
 */
export type CoinbaseWalletConfig = {
  appName: string;
  type: 'coinbase';
};

/**
 * Configuration for the WalletConnect wallet.
 * @param projectId - The WalletConnect project ID.
 */
export type WalletConnectWalletConfig = {
  projectId: string;
  type: 'wallet-connect';
};

/**
 * Union type representing supported wallet configurations.
 * It can be either MetaMask, Coinbase, or WalletConnect wallet.
 */
export type SupportedWallets =
  | MetaMaskWalletConfig
  | RabbyWalletConfig
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
