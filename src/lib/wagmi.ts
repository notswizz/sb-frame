import { configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { frameConnector } from './connector';
import { publicProvider } from 'wagmi/providers/public';

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    frameConnector()
  ],
  publicClient,
  webSocketPublicClient,
});

// Add this to ensure the config is properly initialized
if (typeof window !== 'undefined') {
  console.log('Wagmi config initialized');
} 