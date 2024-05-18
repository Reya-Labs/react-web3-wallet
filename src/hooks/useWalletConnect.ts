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

  const handleConnect = (connectorId: Connector['id']) => {
    const connectTo = connectors.find((c) => c.id === connectorId);
    if (!connectTo) {
      return;
    }

    connect(
      { connector: connectTo },
      {
        onError: onConnectError,
        onSuccess: (data) =>
          typeof onConnectSuccess === 'function'
            ? onConnectSuccess({
                chainId: data.chainId,
                walletAddress: data.accounts[0],
              })
            : undefined,
      },
    );
  };

  const handleDisconnectConnect = () => {
    disconnect(undefined, {
      onError: onDisconnectError,
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
