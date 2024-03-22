import { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

import { useChain, UseChainResult } from './useChain';

export const useAutoSwitchChain = (
  switchToChainId?: number | null,
): {
  isAutoSwitching: boolean;
} & UseChainResult => {
  const { isConnected } = useAccount();
  const { error, isErrorSwitching, isSwitching, switchChain, chainId } = useChain();
  const [initiatedAutoSwitch, setInitiatedAutoSwitch] = useState(false);
  const [stopAutoSwitching, setStopAutoSwitching] = useState(false);
  const hasBeenCalled = useRef(false);

  useEffect(() => {
    setInitiatedAutoSwitch(true);
  }, [isSwitching]);

  useEffect(() => {
    if (initiatedAutoSwitch && isErrorSwitching) {
      setStopAutoSwitching(true);
    }
  }, [isErrorSwitching, initiatedAutoSwitch]);

  useEffect(() => {
    if (hasBeenCalled.current) {
      return;
    }
    if (stopAutoSwitching || !isConnected || !switchToChainId || isSwitching) {
      return;
    }
    if (chainId === switchToChainId) {
      return;
    }
    hasBeenCalled.current = true;
    setStopAutoSwitching(true);
    switchChain(switchToChainId);
  }, [stopAutoSwitching, switchToChainId, isSwitching, isConnected, chainId, switchChain]);

  return {
    chainId,
    error,
    isAutoSwitching: isSwitching,
    isErrorSwitching,
    isSwitching,
    switchChain,
  };
};
