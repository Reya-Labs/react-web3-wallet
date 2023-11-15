import { Connector, useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';

type ReducedConnector = {
  id: Connector['id'];
  name: Connector['name'];
};

export type UseWalletAccountResult = {
  address: string | undefined;
  connector: ReducedConnector | null;
  disconnect: () => void;
  ensAvatar: string | null | undefined;
  ensName: string | null | undefined;
  isConnected: boolean;
};

export const useWalletAccount = (): UseWalletAccountResult => {
  const { address, connector, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });
  const { disconnect } = useDisconnect();

  return {
    address,
    connector: connector
      ? {
          id: connector.id,
          name: connector.name,
        }
      : null,
    disconnect,
    ensAvatar,
    ensName,
    isConnected,
  };
};
