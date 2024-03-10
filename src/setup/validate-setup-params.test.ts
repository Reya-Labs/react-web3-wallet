import { SetupParams } from './types';
import { validateSetupParams } from './validate-setup-params';

enum SupportedWalletChainIds {
  mainnet = 1,
  goerli = 5,
  polygonMumbai = 80001,
  reyaCronos = 89346161,
  sepolia = 11155111,
}

describe('validateSetupParams', () => {
  it('should validate correctly with valid parameters', () => {
    const params: SetupParams = {
      supportedChains: [SupportedWalletChainIds.mainnet, SupportedWalletChainIds.goerli],
      supportedWallets: [{ type: 'metamask' }],
    };
    const result = validateSetupParams(params);
    expect(result).toEqual({ valid: true });
  });

  it('should return an error if supportedChains is empty', () => {
    const params: SetupParams = {
      supportedChains: [],
      supportedWallets: [{ type: 'metamask' }],
    };
    const result = validateSetupParams(params);
    expect(result).toEqual({ message: 'supportedChains must not be empty', valid: false });
  });

  it('should return an error if supportedWallets is empty', () => {
    const params: SetupParams = {
      supportedChains: [SupportedWalletChainIds.mainnet, SupportedWalletChainIds.goerli],
      supportedWallets: [],
    };
    const result = validateSetupParams(params);
    expect(result).toEqual({ message: 'supportedWallets must not be empty', valid: false });
  });
});
