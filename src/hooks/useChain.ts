import { useAccount, useSwitchChain } from 'wagmi';

import { parseWagmiError } from '../utils/extract-error';

export type UseChainResult = {
  chainId: number | undefined;
  error: string | null;
  isErrorSwitching: boolean;
  isSwitching: boolean;
  switchChain: (id: number) => void;
};

export const useChain = (): UseChainResult => {
  const { switchChain, error, isError, isPending } = useSwitchChain();
  const { chainId } = useAccount();
  const handleSwitchChain = (id: number) => {
    if (chainId === id) {
      return;
    }
    switchChain({ chainId: id });
  };

  return {
    chainId,
    error: parseWagmiError(error),
    isErrorSwitching: isError,
    isSwitching: isPending,
    switchChain: handleSwitchChain,
  };
};
