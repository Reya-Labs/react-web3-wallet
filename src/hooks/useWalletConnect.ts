import { Connector, useConnect, useDisconnect } from 'wagmi';

export type UseWalletConnectResult = {
  connect: (connectorId: Connector['id']) => void;
  connectors: Array<{
    connecting: boolean;
    disabled: boolean;
    id: Connector['id'];
    name: string;
  }>;
  disconnect: () => void;
  error: any; // The type of error can vary depending on the context.
  isLoading: boolean;
};

export const useWalletConnect = (): UseWalletConnectResult => {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
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
      connecting: isLoading && pendingConnector?.id === connector.id,
      disabled: !connector.ready,
      id: connector.id,
      name: connector.name,
    })),
    disconnect,
    error,
    isLoading,
  };
};
