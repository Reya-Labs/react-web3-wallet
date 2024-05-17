import { Connector, useConnect, useDisconnect } from 'wagmi';

import { useIntegratorProps } from '../providers/IntegratorPropsProvider';

export type ConnectorReadiness = Record<Connector['id'], boolean>;

export type UseWalletConnectResult = {
  connect: (connectorId: Connector['id']) => void;
  connectors: Array<{
    connecting: boolean;
    id: Connector['id'];
    name: string;
  }>;
  disconnect: () => void;
  error: Error | null;
  getConnectorsReadiness: () => Promise<ConnectorReadiness>;
  isLoading: boolean;
};

export const useWalletConnect = (): UseWalletConnectResult => {
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { onConnectSuccess, onConnectError, onDisconnectSuccess, onDisconnectError } =
    useIntegratorProps();

  const handleOnConnectError = (data: { message: string; name: string }) =>
    typeof onConnectError === 'function'
      ? onConnectError({
          message: data.message,
          name: data.name,
        })
      : undefined;

  const handleOnConnectSuccess = (data: { accounts: readonly string[]; chainId: number }) => {
    // eslint-disable-next-line
    console.log('### handleOnConnectSuccess', data);
    if (typeof onConnectSuccess === 'function') {
      onConnectSuccess({
        chainId: data.chainId,
        walletAddress: data.accounts[0],
      });
    }
  };

  const handleOnDisconnectError = (data: { message: string; name: string }) =>
    typeof onDisconnectError === 'function'
      ? onDisconnectError({
          message: data.message,
          name: data.name,
        })
      : undefined;

  const handleConnect = (connectorId: Connector['id']) => {
    const connectTo = connectors.find((c) => c.id === connectorId);
    if (!connectTo) {
      return;
    }

    connect(
      { connector: connectTo },
      {
        onError: handleOnConnectError,
        onSuccess: handleOnConnectSuccess,
      },
    );
  };

  const handleDisconnectConnect = () => {
    disconnect(undefined, {
      onError: handleOnDisconnectError,
      onSuccess: onDisconnectSuccess,
    });
  };

  return {
    connect: handleConnect,
    connectors: connectors.map((connector) => ({
      connecting: isPending,
      id: connector.id,
      name: connector.name,
    })),
    disconnect: handleDisconnectConnect,
    error,
    getConnectorsReadiness: async () => {
      const readiness: Record<Connector['id'], boolean> = {};
      for (const connector of connectors) {
        readiness[connector.id] = !!(await connector.getProvider());
      }
      return readiness;
    },
    isLoading: isPending,
  };
};
