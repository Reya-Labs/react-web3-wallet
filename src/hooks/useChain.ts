import { useChainId, useSwitchChain } from 'wagmi';

import { parseWagmiError } from '../utils/extract-error';

type UseChainResult = {
  chainId: number;
  isErrorSwitching: boolean;
  isSwitching: boolean;
  switchChain: (id: number) => void;
  error: string | null;
};

export const useChain = (): UseChainResult => {
  const { switchChain, error, isError, isPending } = useSwitchChain();
  const chainId = useChainId();
  const handleSwitchChain = (id: number) => {
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