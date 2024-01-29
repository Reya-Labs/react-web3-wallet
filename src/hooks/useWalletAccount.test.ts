import { renderHook } from '@testing-library/react';
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';

// Import your useWalletAccount hook
import { useWalletAccount } from './useWalletAccount';

// Mock the 'wagmi' dependency
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnectorClient: jest.fn(() => ({})),
  useDisconnect: jest.fn(),
  useEnsAvatar: jest.fn(),
  useEnsName: jest.fn(),
}));

describe('useWalletAccount', () => {
  it('should return correct values when connected', () => {
    // Mock the behavior of useAccount using cast as jest.Mock
    (useAccount as jest.Mock).mockReturnValue({
      address: '0x1234567890',
      connector: { id: 'metamask', name: 'MetaMask' },
      isConnected: true,
    });

    // Mock the behavior of other functions as jest.Mock
    (useDisconnect as jest.Mock).mockReturnValue({
      disconnect: jest.fn(),
    });
    (useEnsName as jest.Mock).mockReturnValue({ data: 'example.eth' });
    (useEnsAvatar as jest.Mock).mockReturnValue({ data: 'avatar-url' });
    // Render the hook
    const { result } = renderHook(() => useWalletAccount());

    // Check the returned values
    expect(result.current.address).toBe('0x1234567890');
    expect(result.current.connector).toEqual({
      id: 'metamask',
      name: 'MetaMask',
    });
    expect(result.current.ensName).toBe('example.eth');
    expect(result.current.ensAvatar).toBe('avatar-url');
    expect(result.current.isConnected).toBe(true);
  });

  it('should return correct values when not connected', () => {
    // Mock the behavior of useAccount using cast as jest.Mock when not connected
    (useAccount as jest.Mock).mockReturnValue({
      address: undefined,
      connector: null,
      isConnected: false,
    });

    // Mock the behavior of other functions as jest.Mock when not connected
    (useDisconnect as jest.Mock).mockReturnValue({
      disconnect: jest.fn(),
    });
    (useEnsName as jest.Mock).mockReturnValue({ data: undefined });
    (useEnsAvatar as jest.Mock).mockReturnValue({ data: undefined });

    // Render the hook
    const { result } = renderHook(() => useWalletAccount());

    // Check the returned values
    expect(result.current.address).toBeUndefined();
    expect(result.current.connector).toBeNull();
    expect(result.current.ensName).toBeUndefined();
    expect(result.current.ensAvatar).toBeUndefined();
    expect(result.current.isConnected).toBe(false);
  });
});
