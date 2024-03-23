import { switchChain as switchChainViem } from '@wagmi/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, useConfig } from 'wagmi';

import { UseChainResult } from './useChain';

export const useAutoSwitchChain = (switchToChainId?: number | null): UseChainResult => {
  const { chainId, isConnected } = useAccount();
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [initiatedAutoSwitch, setInitiatedAutoSwitch] = useState(false);
  const [stopAutoSwitching, setStopAutoSwitching] = useState(false);
  const hasBeenCalled = useRef(false);
  const isErrorSwitching = Boolean(error);

  const config = useConfig();

  useEffect(() => {
    setInitiatedAutoSwitch(true);
  }, [isSwitching]);

  useEffect(() => {
    if (initiatedAutoSwitch && isErrorSwitching) {
      setStopAutoSwitching(true);
    }
  }, [isErrorSwitching, initiatedAutoSwitch]);

  const switchChain = useCallback(async () => {
    if (switchToChainId) {
      setIsSwitching(true);
      try {
        await switchChainViem(config, { chainId: switchToChainId });
        setIsSwitching(false);
        setError(null);
      } catch (err) {
        const message = (err as Error)?.message || '';
        if (!err) {
          setError('Unknown error while switching network.');
          return;
        }
        if (message.indexOf('User rejected the request') !== -1) {
          setError('Network switch was canceled by User.');
        } else {
          setError(message);
        }
      } finally {
        setIsSwitching(false);
      }
    }
  }, [config, switchToChainId]);

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
    void switchChain();
  }, [stopAutoSwitching, switchToChainId, isSwitching, isConnected, chainId, switchChain]);

  return {
    chainId,
    error,
    isErrorSwitching,
    isSwitching,
    switchChain: () => void switchChain(),
  };
};
