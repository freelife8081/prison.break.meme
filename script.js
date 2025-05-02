const CONTRACT_ADDRESS = "YOUR_BOT_CONTRACT_ADDRESS_HERE";
const ABI = [ // Partial ABI with only needed functions
  "function arbitrageFREEtToWSDA(uint256 amountIn) external",
  "function arbitrageWSDAToFREEt(uint256 amountIn) external",
  "function withdrawTokens(address token, uint256 amount) external",
  "function owner() view returns (address)"
];

const FREEt = "0x0914BF761Af71F4A39DcE0E9ce71B7ed96c457E3";
const wSDA = "0xE4095a910209D7BE03B55D02F40d4554B1666182";

let provider, signer, contract;

document.getElementById("connectBtn").onclick = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const address = await signer.getAddress();
    document.getElementById("walletAddress").textContent = `Connected: ${address}`;

    loadBalances(address);
  } else {
    alert("MetaMask not detected");
  }
};

async function loadBalances(address) {
  const freetToken = new ethers.Contract(FREEt, ["function balanceOf(address) view returns (uint256)"], provider);
  const wsdaToken = new ethers.Contract(wSDA, ["function balanceOf(address) view returns (uint256)"], provider);

  const freetBal = await freetToken.balanceOf(address);
  const wsdaBal = await wsdaToken.balanceOf(address);

  document.getElementById("freetBal").textContent = ethers.utils.formatUnits(freetBal, 18);
  document.getElementById("wsdaBal").textContent = ethers.utils.formatUnits(wsdaBal, 18);
}

async function arbitrage(direction) {
  const amount = document.getElementById("amountInput").value;
  if (!amount || isNaN(amount)) {
    alert("Enter a valid amount");
    return;
  }

  const amountInWei = ethers.utils.parseUnits(amount, 18);
  try {
    document.getElementById("status").textContent = "Sending transaction...";
    const tx = direction === "freetToWsda"
      ? await contract.arbitrageFREEtToWSDA(amountInWei)
      : await contract.arbitrageWSDAToFREEt(amountInWei);

    await tx.wait();
    document.getElementById("status").textContent = "Arbitrage executed!";
  } catch (e) {
    document.getElementById("status").textContent = `Error: ${e.message}`;
  }
}
