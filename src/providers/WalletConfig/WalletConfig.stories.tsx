import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Button, ThemeProvider, Typography } from 'brokoli-ui';
import React, { useMemo } from 'react';

import { useWalletAccount } from '../../hooks/useWalletAccount';
import { ConnectorReadiness, useWalletConnect } from '../../hooks/useWalletConnect';
import { setup, SetupParams } from '../../setup';
import { WalletConfig } from '.';

export default {
  args: {},
  component: WalletConfig,
  title: 'Components/WalletConfig',
} as Meta<typeof WalletConfig>;

const WalletButtons: React.FunctionComponent = () => {
  const { getConnectorsReadiness, connect, connectors, error } = useWalletConnect();
  const { disconnect, ensName, ensAvatar, address, connector, isConnected } = useWalletAccount();
  const [readiness, setReadiness] = React.useState<ConnectorReadiness>({});
  React.useEffect(() => {
    (async () => {
      const readinessResult = await getConnectorsReadiness();
      setReadiness(readinessResult);
    })();
  }, [connectors, setReadiness]);

  if (isConnected) {
    return (
      <div>
        <img alt="ENS Avatar" src={ensAvatar!} />
        <Typography colorToken="white100" typographyToken="primaryBodyMediumRegular">
          {ensName ? `${ensName} (${address!})` : address}
        </Typography>
        <Typography colorToken="white100" typographyToken="primaryBodySmallRegular">
          Connected to {connector?.name}{' '}
        </Typography>
        <Button variant="secondary" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {connectors.map((c) => (
        <Button
          key={c.id}
          bottomLeftText={error ? error.message : ''}
          bottomLeftTextColorToken="error100"
          disabled={!readiness[c.id]}
          variant="primary"
          onClick={() => connect(c.id)}
        >
          {c.name}
          {c.connecting && ' (connecting)'}
        </Button>
      ))}
    </div>
  );
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
        supportedChains: ['mainnet', 'goerli'],
        supportedWallets,
      }),
    [supportedWallets],
  );
  return (
    <ThemeProvider theme="voltz">
      <WalletConfig key={supportedWallets.map((sW) => sW.type).join(',')} config={config}>
        <WalletButtons />
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
