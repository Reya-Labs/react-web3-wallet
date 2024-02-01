import { useChainId, useSwitchChain } from 'wagmi';

type UseChainResult = {
  chainId: number;
  isErrorSwitching: boolean;
  isSwitching: boolean;
  switchChain: (id: number) => void;
};

export const useChain = (): UseChainResult => {
  const { switchChain, isError, isPending } = useSwitchChain();
  const chainId = useChainId();
  const handleSwitchChain = (id: number) => {
    switchChain({ chainId: id });
  };

  return {
    chainId,
    isErrorSwitching: isError,
    isSwitching: isPending,
    switchChain: handleSwitchChain,
  };
};
