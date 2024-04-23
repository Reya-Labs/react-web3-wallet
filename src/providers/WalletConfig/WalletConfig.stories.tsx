import styled from '@emotion/styled';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Button, ThemeProvider, Typography } from 'brokoli-ui';
import React, { useEffect, useMemo } from 'react';

import {
  ConnectorReadiness,
  setup,
  SetupParams,
  useChain,
  useWalletAccount,
  useWalletConnect,
  WalletConfig,
} from '../../index';
import { extractError } from '../../utils/extract-error';

enum SupportedWalletChainIds {
  mainnet = 1,
  goerli = 5,
  polygonMumbai = 80001,
  reyaCronos = 89346161,
  sepolia = 11155111,
}

export default {
  args: {},
  component: WalletConfig,
  title: 'Components/WalletConfig',
} as Meta<typeof WalletConfig>;

const ButtonsBox = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const WalletButtons: React.FunctionComponent = () => {
  const { getConnectorsReadiness, disconnect, connect, connectors, error } = useWalletConnect();
  const { signer, ensName, ensAvatar, address, connector, isConnected } = useWalletAccount();
  const { chainId } = useChain();
  const [readiness, setReadiness] = React.useState<ConnectorReadiness>({});
  const connectorsLength = connectors.length;

  useEffect(() => {
    if (connectorsLength === 0) {
      return;
    }
    (async () => {
      const readinessResult = await getConnectorsReadiness();
      setReadiness(readinessResult);
    })();
  }, [connectorsLength, setReadiness]);

  if (isConnected) {
    return (
      <div>
        <img alt="ENS Avatar" src={ensAvatar!} />
        <Typography colorToken="white100" typographyToken="bodyMediumRegular">
          {ensName ? `${ensName} (${address!})` : address}
        </Typography>
        <Typography colorToken="white100" typographyToken="bodySmallRegular">
          Connected to {connector?.name}{' '}
        </Typography>
        <Typography colorToken="white100" typographyToken="bodySmallRegular">
          Signer status: {!signer ? 'No signer' : 'Have signer'}
        </Typography>
        <Typography colorToken="white100" typographyToken="bodySmallRegular">
          Wagmi chain: {chainId}
        </Typography>
        <ButtonsBox>
          <Button
            backgroundColorToken="black800"
            typographyColorToken="white500"
            typographyToken="bodyMediumRegular"
            onClick={disconnect}
          >
            Disconnect
          </Button>
        </ButtonsBox>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {connectors.map((c) => (
        <Button
          key={c.id}
          backgroundColorToken="primary950"
          borderColorToken="primary800"
          bottomLeftText={error ? error.message : ''}
          bottomLeftTextColorToken="error100"
          disabled={!readiness[c.id]}
          hoverBorderColorToken="primary500"
          typographyColorToken="primary500"
          onClick={() => connect(c.id)}
        >
          {c.name}
          {c.connecting && ' (connecting)'}
        </Button>
      ))}
    </div>
  );
};

const ChainButton: React.FunctionComponent = () => {
  const { chainId, isErrorSwitching, error: errorSwitching, isSwitching, switchChain } = useChain();
  const requiredChainId = SupportedWalletChainIds.mainnet;
  const shouldSwitchNetwork = chainId !== requiredChainId;
  const { isConnected } = useWalletAccount();

  if (isConnected) {
    return (
      <div>
        <ButtonsBox>
          <Button
            backgroundColorToken={shouldSwitchNetwork ? 'warning500' : 'primary800'}
            bottomLeftText={isErrorSwitching ? extractError(errorSwitching) : undefined}
            bottomLeftTextColorToken="error500"
            bottomLeftTextTypographyToken="bodyXSmallRegular"
            loading={isSwitching}
            typographyColorToken={shouldSwitchNetwork ? 'warning100' : 'primary500'}
            typographyToken="bodyMediumRegular"
            onClick={shouldSwitchNetwork ? () => switchChain(requiredChainId) : undefined}
          >
            {shouldSwitchNetwork
              ? `Switch chain to mainnet, current chainId is ${chainId || 'unknown'}`
              : 'You are on mainnet!'}
          </Button>
        </ButtonsBox>
      </div>
    );
  }

  return null;
};

const Template: StoryFn<{
  coinBaseAppName: string;
  walletConnectProjectId: string;
}> = ({ coinBaseAppName, walletConnectProjectId }) => {
  const supportedWallets = useMemo(() => {
    const value: SetupParams['supportedWallets'] = [
      {
        type: 'metamask',
      },
      {
        type: 'rabby',
      },
    ];
    if (walletConnectProjectId) {
      value.push({ projectId: walletConnectProjectId, type: 'wallet-connect' });
    }
    if (coinBaseAppName) {
      value.push({ appName: coinBaseAppName, type: 'coinbase' });
    }
    return value;
  }, [walletConnectProjectId, coinBaseAppName]);

  const config = useMemo(
    () =>
      setup({
        supportedChains: Object.values(SupportedWalletChainIds) as number[],
        supportedWallets,
      }),
    [supportedWallets],
  );
  return (
    <ThemeProvider theme="reya">
      <WalletConfig key={supportedWallets.map((sW) => sW.type).join(',')} config={config}>
        <WalletButtons />
        <ChainButton />
      </WalletConfig>
    </ThemeProvider>
  );
};

export const Default: StoryObj<{
  coinBaseAppName: string;
  walletConnectProjectId: string;
}> = {
  args: {
    coinBaseAppName: '',
    walletConnectProjectId: '',
  },
  render: Template,
};
