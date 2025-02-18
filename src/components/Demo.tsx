import { useEffect, useCallback, useState } from 'react';
import sdk from '@farcaster/frame-sdk';
import { useAccount, useContractRead, useSendTransaction, useConnect } from 'wagmi';
import { parseUnits, formatUnits, encodeAbiParameters } from 'viem';
import { Button } from '~/components/ui/Button';
import { frameConnector } from '~/lib/connector';

// Replace with your actual token details
const TOKEN_ADDRESS = '0x1603232eEc2e37e001C3ffe75d3c9E27C189005F';
const WALLET_1 = '0x7b5830fddDa141cecC75407911DE2b470c0b5B71';
const WALLET_2 = '0x789...';

// ERC20 interface for token
const TOKEN_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
] as const;

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [amount, setAmount] = useState('0.01');
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: frameConnector()
  });
  const { sendTransaction, isPending } = useSendTransaction();

  // Get token balance with proper formatting
  const { data: balance, isLoading: isBalanceLoading } = useContractRead({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  const formattedBalance = balance ? formatUnits(balance, 18) : '0';
  const displayBalance = Number(formattedBalance).toFixed(4);

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  // Send to wallet 1
  const sendToWallet1 = useCallback(async () => {
    if (!address || !amount) return;
    try {
      await sendTransaction({
        to: TOKEN_ADDRESS,
        data: encodeAbiParameters(
          [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' }
          ],
          [WALLET_1, parseUnits(amount, 18)]
        ),
        gas: 250000n,
      });
    } catch (err) {
      console.error('Transaction error:', err);
    }
  }, [sendTransaction, address, amount]);

  // Send to wallet 2
  const sendToWallet2 = useCallback(async () => {
    if (!address || !amount) return;
    try {
      await sendTransaction({
        to: TOKEN_ADDRESS,
        data: encodeAbiParameters(
          [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' }
          ],
          [WALLET_2, parseUnits(amount, 18)]
        ),
        gas: 250000n,
      });
    } catch (err) {
      console.error('Transaction error:', err);
    }
  }, [sendTransaction, address, amount]);

  useEffect(() => {
    const load = async () => {
      try {
        await sdk.actions.ready();
        console.log('SDK Ready');
      } catch (error) {
        console.error('Error loading Frame SDK:', error);
      }
    };
    if (!isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) return <div>Loading...</div>;

  return (
    <div className="w-[300px] mx-auto py-4 px-2 bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
        Super Bowl 2025
      </h1>
      
      <div className="mb-4 text-center">
        {!isConnected ? (
          <Button
            onClick={handleConnect}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600"
            variant="default"
          >
            Connect Wallet
          </Button>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between px-2 bg-gray-800/50 py-2 rounded-lg">
              <span className="text-sm text-gray-300">
                Connected: {formatAddress(address || '')}
              </span>
              <button
                onClick={() => sdk.wallet.disconnect()}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Disconnect
              </button>
            </div>

            <p className="mb-4 text-yellow-400 font-medium">
              {isBalanceLoading ? (
                "Loading balance..."
              ) : (
                `Token Balance: ${displayBalance}`
              )}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount to Send
              </label>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                placeholder="Enter amount"
              />
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={sendToWallet1}
                disabled={isPending || Number(formattedBalance) === 0 || !amount || Number(amount) === 0}
                isLoading={isPending}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 group relative overflow-hidden"
              >
                <span className="relative z-10">Send to Chiefs</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-600 opacity-0 group-hover:opacity-20 transition-opacity" />
              </Button>
              
              <Button
                onClick={sendToWallet2}
                disabled={isPending || Number(formattedBalance) === 0 || !amount || Number(amount) === 0}
                isLoading={isPending}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 group relative overflow-hidden"
              >
                <span className="relative z-10">Send to Eagles</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-green-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}