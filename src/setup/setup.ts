import { createConfig, CreateConnectorFn, http } from 'wagmi';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

import { getChainDefinition } from './get-chain-definition';
import {
  CoinbaseWalletConfig,
  MetaMaskWalletConfig,
  SetupParams,
  WalletConnectWalletConfig,
} from './types';
import { validateSetupParams } from './validate-setup-params';

type CreateConfigParams = Parameters<typeof createConfig>[0];

export const setup = (params: SetupParams): ReturnType<typeof createConfig> => {
  const validationResult = validateSetupParams(params);
  if (!validationResult.valid) {
    throw new Error(validationResult.message);
  }

  const { supportedChains = [], supportedWallets = [] } = params;

  const chains: CreateConfigParams['chains'][number][] = [];
  const transports: CreateConfigParams['transports'] = {};
  for (const supportedChain of supportedChains) {
    const chain = getChainDefinition(supportedChain);
    if (chain) {
      chains.push(chain);
      transports[chain.id] = http();
    }
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
    // @ts-ignore - wagmi has some issue with types
    chains,
    connectors,
    multiInjectedProviderDiscovery: false,
    // @ts-ignore - wagmi has some issue with types
    transports,
  });
};
