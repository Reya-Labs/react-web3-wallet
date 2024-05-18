import { useAccount, useSwitchChain } from 'wagmi';

import { useIntegratorProps } from '../providers/IntegratorPropsProvider';
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
  const { onSwitchChainSuccess, onSwitchChainError } = useIntegratorProps();
  const handleSwitchChain = (id: number) => {
    if (chainId === id) {
      return;
    }
    switchChain(
      { chainId: id },
      {
        onError: onSwitchChainError,
        onSuccess: (connectData) =>
          typeof onSwitchChainSuccess === 'function'
            ? onSwitchChainSuccess({
                chainId: connectData.id,
                chainName: connectData.name,
              })
            : undefined,
      },
    );
  };

  return {
    chainId,
    error: parseWagmiError(error),
    isErrorSwitching: isError,
    isSwitching: isPending,
    switchChain: handleSwitchChain,
  };
};
