'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { injected } from 'wagmi/connectors';

// ==============================
// CONFIG 
// ==============================
const CONTRACT_ADDRESS = '0x56d245c498e855c771ef6388784fe8b15bd9e61f';

const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: 'getValue',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'setValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [inputValue, setInputValue] = useState('');
  const [mounted, setMounted] = useState(false);

  // Mencegah Hydration Error 
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
  });

  const { writeContract, isPending: isWriting } = useWriteContract();

  const handleSetValue = async () => {
    if (!inputValue) return;
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: SIMPLE_STORAGE_ABI,
      functionName: 'setValue',
      args: [BigInt(inputValue)],
    });
  };

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // Tunggu sampai komponen mounted di browser sebelum render konten 
  if (!mounted) return null;

return (
  <div className="container main-layout">
    <header className="header-section">
      <h1>AVALANCHE DAPP</h1>
      <p className="subtitle">Connect Wallet (Core Wallet)</p>
      
      {!isConnected ? (
        <button onClick={() => connect({ connector: injected() })} disabled={isConnecting}>
          {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
        </button>
      ) : (
        <button className="btn-disconnect" onClick={() => disconnect()}>DISCONNECT</button>
      )}
    </header>

    <div className="grid-content">
      {/* Kolom Kiri: Status & Identitas */}
      <section className="card side-panel">
        <div className="info-row">
          <strong>STATUS:</strong>
          <span style={{ color: isConnected ? "#4cd137" : "white" }}>
            {isConnected ? "CONNECTED ✅" : "OFFLINE"}
          </span>
        </div>
        <div className="info-row">
          <strong>ADDRESS:</strong>
          <span id="address">{isConnected && address ? shortenAddress(address) : "-"}</span>
        </div>
        <div className="footer-id">
          <p>SYSTEM_USER: DHARMA FATHAHILLAH</p>
          <p>NIM: 231011401770</p>
        </div>
      </section>

      {/* Kolom Kanan: Interaction (Read & Write) */}
      <section className="card action-panel">
        <div className="read-section">
          <strong>CONTRACT VALUE (READ)</strong>
          <div className="value-display">
            {isReading ? "..." : value?.toString() || "0"}
          </div>
          <button onClick={() => refetch()} className="btn-small">REFRESH VALUE</button>
        </div>

        <div className="write-section">
          <strong>UPDATE CONTRACT VALUE</strong>
          <div className="input-group">
            <input
              type="number"
              placeholder="New value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={handleSetValue} disabled={isWriting || !isConnected}>
              {isWriting ? 'UPDATING...' : 'SET VALUE'}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
);
}