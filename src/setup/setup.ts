import { createConfig, CreateConnectorFn, http } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

import {
  CoinbaseWalletConfig,
  MetaMaskWalletConfig,
  SetupParams,
  WalletConnectWalletConfig,
} from './types';
import { validateSetupParams } from './validate-setup-params';

export const setup = (params: SetupParams): ReturnType<typeof createConfig> => {
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

  const connectors: CreateConnectorFn[] = [];
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
    connectors.push(injected({ target: 'metaMask' }));
  }

  if (coinbaseConfig) {
    connectors.push(
      coinbaseWallet({
        appName: coinbaseConfig.appName,
      }),
    );
  }

  if (walletConnectConfig) {
    connectors.push(
      walletConnect({
        projectId: walletConnectConfig.projectId,
      }),
    );
  }
  return createConfig({
    chains: [mainnet, goerli],
    connectors,
    multiInjectedProviderDiscovery: false,
    transports: {
      [mainnet.id]: http(),
      [goerli.id]: http(),
    },
  });
};
