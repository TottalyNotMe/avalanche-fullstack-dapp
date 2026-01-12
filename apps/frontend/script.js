const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const namaEl = document.getElementById("nama");
const nimEl = document.getElementById("nim");

// Avalanche Fuji Testnet chainId (hex)
const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

// Variable state koneksi
let isConnected = false;

function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  return (balance / 1e18).toFixed(4);
}

function shortenAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

// Fungsi Disconnect: Reset semua tampilan ke awal
function disconnectWallet() {
  isConnected = false;

  // 1. Reset Tombol
  connectBtn.textContent = "Connect Wallet";
  connectBtn.classList.remove("btn-disconnect");

  // 2. Reset Info Wallet
  statusEl.textContent = "Not Connected";
  statusEl.style.color = "white";
  addressEl.textContent = "-";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";
  
  // 3. Reset Nama & NIM
  namaEl.textContent = "-";
  nimEl.textContent = "-";
}

async function connectWallet() {
  // Jika tombol diklik saat status connected, lakukan disconnect
  if (isConnected) {
    disconnectWallet();
    return;
  }

  if (typeof window.ethereum === "undefined") {
    statusEl.textContent = "Wallet Not Found ❌";
    alert("Core Wallet tidak terdeteksi. Silakan install Core Wallet.");
    return;
  }

  try {
    statusEl.textContent = "Connecting...";

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = accounts[0];
    // 1. Update State & Tombol
    isConnected = true;
    connectBtn.textContent = "Disconnect";
    connectBtn.classList.add("btn-disconnect");

    // 2. Tampilkan Address
    addressEl.textContent = shortenAddress(address);

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    // Cek Network apakah Avalanche Fuji
    if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
      networkEl.textContent = "Avalanche Fuji Testnet";
      statusEl.textContent = "Connected ✅";
      statusEl.style.color = "#4cd137";

      // Ambil Saldo
      const balanceWei = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      balanceEl.textContent = formatAvaxBalance(balanceWei);

      // 3. TAMPILKAN NAMA & NIM
      namaEl.textContent = "Dharma Fathahillah";
      nimEl.textContent = "231011401770";

    } else {
      // Jika salah network
      networkEl.textContent = "Wrong Network ❌";
      statusEl.textContent = "Please switch to Avalanche Fuji";
      statusEl.style.color = "#fbc531";
      balanceEl.textContent = "-";
      namaEl.textContent = "-";
      nimEl.textContent = "-";
    }

  } catch (error) {
    console.error(error);
    statusEl.textContent = "Connection Failed ❌";
    statusEl.style.color = "red";
  }
}

// Event Listeners
if (window.ethereum) {
  // Ganti Akun / Disconnect dari Wallet Extension
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      addressEl.textContent = shortenAddress(accounts[0]);
    }
  });

  // Ganti Chain
  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });
}

connectBtn.addEventListener("click", connectWallet);