import { defineChain } from 'viem';

export const reyaNetwork = defineChain({
  blockExplorers: {
    default: { name: 'ReyaNetworkExplorer', url: 'https://explorer.reya.network/' },
  },
  id: 1729,
  name: 'Reya Network',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: {
    default: {
      http: ['https://rpc.reya.network'],
      webSocket: ['wss://ws.reya.network'],
    },
  },
  testnet: false,
});
