'use client';

import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { avalancheFuji } from 'wagmi/chains';
import { formatEther } from 'viem'; // Import ini penting

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  
  const { data: balance } = useBalance({
    address: address,
  });

  return (
    <div className="container">
      <h1>Avalanche dApp</h1>
      <p className="subtitle">Connect Wallet (Core Wallet)</p>

      {!isConnected ? (
        <button onClick={() => connect({ connector: injected() })}>
          Connect Wallet
        </button>
      ) : (
        <button className="btn-disconnect" onClick={() => disconnect()}>
          Disconnect
        </button>
      )}

      <div className="card">
        <p><strong>Status:</strong> 
          <span id="status" style={{ color: isConnected ? '#4cd137' : 'white' }}>
            {isConnected ? 'Connected ✅' : 'Not Connected'}
          </span>
        </p>
        <p><strong>Wallet Address:</strong></p>
        <p id="address">{isConnected ? address : '-'}</p>
        
        <p><strong>Network:</strong> 
          <span id="network">
            {isConnected ? (chainId === avalancheFuji.id ? 'Avalanche Fuji Testnet' : 'Wrong Network ❌') : '-'}
          </span>
        </p>
        
        <p><strong>Balance:</strong> 
          <span id="balance">
            {isConnected && balance ? Number(formatEther(balance.value)).toFixed(4) : '-'}
          </span> AVAX
        </p>
        
        <p><strong>Nama:</strong> <span>{isConnected ? "Dharma Fathahillah" : "-"}</span></p>
        <p><strong>NIM:</strong> <span>{isConnected ? "231011401770" : "-"}</span></p>
      </div>
    </div>
  );
}