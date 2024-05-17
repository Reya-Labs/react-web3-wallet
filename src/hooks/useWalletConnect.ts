import { Connector, useConnect, useDisconnect } from 'wagmi';

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

export type OnConnectSuccessData = {
  chainId: number;
  walletAddress: string;
};

export type OnConnectErrorData = {
  message: string;
  name: string;
};

export type OnDisconnectErrorData = {
  message: string;
  name: string;
};

export type UseWalletConnectParams = {
  onConnectError?: (data: OnConnectErrorData) => void;
  onConnectSuccess?: (data: OnConnectSuccessData) => void;
  onDisconnectError?: (data: OnDisconnectErrorData) => void;
  onDisconnectSuccess?: () => void;
};

export const useWalletConnect = (params?: UseWalletConnectParams): UseWalletConnectResult => {
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { onConnectSuccess, onConnectError, onDisconnectSuccess, onDisconnectError } = params || {};
  const handleConnect = (connectorId: Connector['id']) => {
    const connectTo = connectors.find((c) => c.id === connectorId);
    if (!connectTo) {
      return;
    }
    connect(
      { connector: connectTo },
      {
        onError: (errorConnectData) =>
          typeof onConnectError === 'function'
            ? onConnectError({
                message: errorConnectData.message,
                name: errorConnectData.name,
              })
            : undefined,
        onSuccess: (connectData) =>
          typeof onConnectSuccess === 'function'
            ? onConnectSuccess({
                chainId: connectData.chainId,
                walletAddress: connectData.accounts[0],
              })
            : undefined,
      },
    );
  };

  const handleDisconnectConnect = () => {
    disconnect(undefined, {
      onError: (errorConnectData) =>
        typeof onDisconnectError === 'function'
          ? onDisconnectError({
              message: errorConnectData.message,
              name: errorConnectData.name,
            })
          : undefined,
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
