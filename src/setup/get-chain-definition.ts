import { chainDefinitions } from './chain-definitions';

/**
 * Gets the chain object for the given chain id.
 * @param chainId - Chain id of the target EVM chain.
 * @returns Viem's chain object.
 */
export function getChainDefinition(chainId: number) {
  for (const key of Object.keys(chainDefinitions)) {
    const chain = chainDefinitions[key];
    if (chain.id === chainId) {
      return chain;
    }
  }

  return null;
}
