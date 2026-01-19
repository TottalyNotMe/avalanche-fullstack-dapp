'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWriteContract,
} from 'wagmi';
import { injected } from 'wagmi/connectors';

// ==============================
// CONFIG 
// ==============================
const CONTRACT_ADDRESS = '0x56d245c498e855c771ef6388784fe8b15bd9e61f';

// ABI hanya dibutuhkan untuk Write di Day 5
const SIMPLE_STORAGE_ABI = [
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

  // 🔹 STATE BARU UNTUK DAY 5: Mengambil data dari Backend
  const [backendValue, setBackendValue] = useState("...");
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchFromBackend(); // Ambil data saat pertama kali load
  }, []);

  // 🔹 TASK 2: Fungsi Fetch dari Backend API
  const fetchFromBackend = async () => {
    setIsReading(true);
    try {
      // Menggunakan URL dari .env.local yang Anda buat
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blockchain/value`);
      const data = await res.json();
      setBackendValue(data.value);
    } catch (error) {
      console.error("Gagal koneksi ke backend", error);
      setBackendValue("ERR");
    } finally {
      setIsReading(false);
    }
  };

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

  if (!mounted) return null;

  return (
    <div className="container main-layout">
      <header className="header-section">
        <h1>AVALANCHE DAPP</h1>
        <p className="subtitle">Full Stack Integration - Day 5</p>
        
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

        {/* Kolom Kanan: Interaction */}
        <section className="card action-panel">
          <div className="read-section">
            {/* Mengambil data dari Backend API */}
            <strong>BACKEND DATA (READ API)</strong>
            <div className="value-display">
              {isReading ? "..." : backendValue}
            </div>
            <button onClick={fetchFromBackend} className="btn-small">REFRESH FROM API</button>
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