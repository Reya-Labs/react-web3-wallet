import { Chain } from 'viem';
import * as viemChains from 'viem/chains';

import { reyaCronos } from './reya-cronos';
const { ...chains } = viemChains;

export type ChainDefinitions = Record<string, ChainDefinition>;
export type ChainDefinition = Chain;
export const chainDefinitions: ChainDefinitions = {
  ...chains,
  reyaCronos,
};
