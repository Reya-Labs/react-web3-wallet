import { Connector, useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';

export type UseWalletAccountResult = {
  address: string | undefined;
  connector: {
    id: Connector['id'];
    name: Connector['name'];
  } | null;
  disconnect: () => void;
  ensAvatar: string | null | undefined;
  ensName: string | null | undefined;
  isConnected: boolean;
};

export const useWalletAccount = (): UseWalletAccountResult => {
  const { address, connector, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const { disconnect } = useDisconnect();
  return {
    address,
    connector:
      isConnected && connector
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
