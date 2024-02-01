import { SwitchChainErrorType } from '@wagmi/core';
import { useChainId, useSwitchChain } from 'wagmi';

type UseChainResult = {
  chainId: number;
  isErrorSwitching: boolean;
  isSwitching: boolean;
  switchChain: (id: number) => void;
  error: SwitchChainErrorType | null;
};

export const useChain = (): UseChainResult => {
  const { switchChain, error, isError, isPending } = useSwitchChain();
  const chainId = useChainId();
  const handleSwitchChain = (id: number) => {
    switchChain({ chainId: id });
  };

  return {
    chainId,
    error,
    isErrorSwitching: isError,
    isSwitching: isPending,
    switchChain: handleSwitchChain,
  };
};
