import { ethers } from 'ethers';
import { Connector, useAccount, useEnsAvatar, useEnsName } from 'wagmi';

import { useEthersSigner } from './useEthersSigner';

export type UseWalletAccountResult = {
  address: string | undefined;
  connector: {
    id: Connector['id'];
    name: Connector['name'];
  } | null;
  ensAvatar: string | null | undefined;
  ensName: string | null | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  signer: WalletSigner;
};

export type WalletSigner = null | ethers.JsonRpcSigner;

export const useWalletAccount = (): UseWalletAccountResult => {
  const { address, connector, isConnected, isConnecting } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const signer = useEthersSigner();

  return {
    address,
    connector:
      isConnected && connector
        ? {
            id: connector.id,
            name: connector.name,
          }
        : null,
    ensAvatar,
    ensName,
    isConnected,
    isConnecting,
    signer,
  };
};
