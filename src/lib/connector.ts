import sdk from '@farcaster/frame-sdk';
import { SwitchChainError, fromHex, getAddress, numberToHex } from 'viem';
import { ChainNotConfiguredError, createConnector } from 'wagmi';

export function frameConnector() {
  let provider: typeof sdk.wallet.ethProvider | null = null;

  return createConnector((config) => ({
    id: 'farcaster',
    name: 'Farcaster Wallet',
    type: 'frameConnector' as const,

    async connect({ chainId } = {}) {
      try {
        provider = sdk.wallet.ethProvider;
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        
        return {
          account: getAddress(accounts[0]),
          chain: {
            id: chainId ?? config.chains[0].id,
            unsupported: false,
          },
        };
      } catch (error) {
        console.error('Connect error:', error);
        throw error;
      }
    },

    async disconnect() {
      provider = null;
    },

    async getAccount() {
      if (!provider) return null;
      try {
        const accounts = await provider.request({ method: 'eth_accounts' });
        return accounts[0] ? getAddress(accounts[0]) : null;
      } catch (error) {
        console.error('GetAccount error:', error);
        return null;
      }
    },

    async getChainId() {
      if (!provider) return config.chains[0].id;
      try {
        const chainId = await provider.request({ method: 'eth_chainId' });
        return Number(fromHex(chainId));
      } catch (error) {
        console.error('GetChainId error:', error);
        return config.chains[0].id;
      }
    },

    async isAuthorized() {
      try {
        const account = await this.getAccount();
        return !!account;
      } catch {
        return false;
      }
    },

    async switchChain({ chainId }) {
      if (!provider) throw new Error('Provider not available');
      
      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) throw new ChainNotConfiguredError();

      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: numberToHex(chainId) }],
        });
        return chain;
      } catch (error) {
        console.error('SwitchChain error:', error);
        throw new SwitchChainError(error);
      }
    },

    onAccountsChanged(accounts) {
      if (accounts.length === 0) this.disconnect();
      else config.emitter.emit('change', { account: getAddress(accounts[0]) });
    },

    onChainChanged(chain) {
      const chainId = Number(fromHex(chain));
      config.emitter.emit('change', { chainId });
    },

    onDisconnect() {
      config.emitter.emit('disconnect');
      provider = null;
    },

    getProvider() {
      return provider;
    }
  }));
} 