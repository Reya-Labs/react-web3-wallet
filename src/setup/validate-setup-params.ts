import { SetupParams } from './types';

export function validateSetupParams(params: SetupParams): { message?: string; valid: boolean } {
  // Check if supportedChains is not empty
  if (!params.supportedChains || params.supportedChains.length === 0) {
    return { message: 'supportedChains must not be empty', valid: false };
  }

  // Check if supportedWallets is not empty
  if (!params.supportedWallets || params.supportedWallets.length === 0) {
    return { message: 'supportedWallets must not be empty', valid: false };
  }

  // If all validations pass
  return { valid: true };
}
