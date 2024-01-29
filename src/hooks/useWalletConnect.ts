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
  isLoading: boolean;
  getConnectorsReadiness: () => Promise<ConnectorReadiness>;
};

export const useWalletConnect = (): UseWalletConnectResult => {
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = (connectorId: Connector['id']) => {
    const connectTo = connectors.find((c) => c.id === connectorId);
    if (!connectTo) {
      return;
    }
    connect({ connector: connectTo });
  };

  return {
    connect: handleConnect,
    connectors: connectors.map((connector) => ({
      connecting: isPending,
      id: connector.id,
      name: connector.name,
    })),
    disconnect,
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
