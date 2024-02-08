import { defineChain } from 'viem';

export const reyaCronos = defineChain({
  blockExplorers: {
    default: { name: 'ReyaCronosScan', url: 'https://explorer.reya-cronos.gelato.digital' },
  },
  id: 1729,
  name: 'Reya Cronos',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: {
    default: {
      http: ['https://rpc.reya-cronos.gelato.digital'],
      webSocket: ['wss://ws.reya-cronos.gelato.digital'],
    },
  },
  testnet: true,
});
