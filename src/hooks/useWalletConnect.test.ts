import { renderHook } from '@testing-library/react';
import { useConnect, useDisconnect } from 'wagmi';

// Import your useWalletConnect hook
import { useWalletConnect } from './useWalletConnect';

// Mock the 'wagmi' dependency
jest.mock('wagmi', () => ({
  useConnect: jest.fn(),
  useDisconnect: jest.fn(),
}));

describe('useWalletConnect', () => {
  it('should return correct values when connectors are available', () => {
    // Mock the behavior of useConnect with connectors
    const mockConnectors = [
      { id: 'metamask', name: 'MetaMask' },
      { id: 'wallet-connect', name: 'WalletConnect' },
    ];

    (useConnect as jest.Mock).mockReturnValue({
      connect: jest.fn(),
      connectors: mockConnectors,
      error: null,
      isPending: true,
    });

    // Mock the behavior of useDisconnect
    (useDisconnect as jest.Mock).mockReturnValue({
      disconnect: jest.fn(),
    });

    // Render the hook
    const { result } = renderHook(() => useWalletConnect());

    // Check the returned values
    expect(result.current.connectors).toEqual([
      {
        connecting: true,
        id: 'metamask',
        name: 'MetaMask',
      },
      {
        connecting: true,
        id: 'wallet-connect',
        name: 'WalletConnect',
      },
    ]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it('should return correct values when connectors are not available', () => {
    // Mock the behavior of useConnect with no connectors
    (useConnect as jest.Mock).mockReturnValue({
      connect: jest.fn(),
      connectors: [],
      error: null,
      isPending: false,
    });

    // Mock the behavior of useDisconnect
    (useDisconnect as jest.Mock).mockReturnValue({
      disconnect: jest.fn(),
    });

    // Render the hook
    const { result } = renderHook(() => useWalletConnect());

    // Check the returned values
    expect(result.current.connectors).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
