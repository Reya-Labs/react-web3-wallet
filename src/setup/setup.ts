import { configureChains, Connector, createConfig } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';

import {
  CoinbaseWalletConfig,
  MetaMaskWalletConfig,
  SetupParams,
  WalletConnectWalletConfig,
} from './types';
import { validateSetupParams } from './validate-setup-params';

export const setup = (params: SetupParams) => {
  const validationResult = validateSetupParams(params);
  if (!validationResult.valid) {
    throw new Error(validationResult.message);
  }

  const { supportedChains = [], supportedWallets = [] } = params;

  const defaultChains = [];
  if (supportedChains.includes('mainnet')) {
    defaultChains.push(mainnet);
  }
  if (supportedChains.includes('goerli')) {
    defaultChains.push(goerli);
  }

  // Configure chains & providers with the Alchemy provider.
  // Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
  const { chains, publicClient, webSocketPublicClient } = configureChains(defaultChains, [
    publicProvider(),
  ]);

  const connectors: Connector[] = [
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ];
  const metamaskConfig = supportedWallets.find(
    (sW) => sW.type === 'metamask',
  ) as MetaMaskWalletConfig;
  const coinbaseConfig = supportedWallets.find(
    (sW) => sW.type === 'coinbase',
  ) as CoinbaseWalletConfig;
  const walletConnectConfig = supportedWallets.find(
    (sW) => sW.type === 'wallet-connect',
  ) as WalletConnectWalletConfig;

  if (metamaskConfig) {
    connectors.push(new MetaMaskConnector({ chains }));
  }

  if (coinbaseConfig) {
    connectors.push(
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: coinbaseConfig.appName,
        },
      }),
    );
  }

  if (walletConnectConfig) {
    connectors.push(
      new WalletConnectConnector({
        chains,
        options: {
          projectId: walletConnectConfig.projectId,
        },
      }),
    );
  }

  return createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });
};
