<template>
  <div>
    <h1>🏆 Vote Ballon d'Or 2025</h1>

    <button @click="connectWallet">Connecter Metamask</button>
    <p v-if="account">Connecté en tant que : {{ account }}</p>

    <div v-if="nominees.length > 0">
      <h2>🎯 Candidats</h2>
      <ul>
        <li v-for="nominee in nominees" :key="nominee">
          {{ nominee }} — {{ votes[nominee] || 0 }} votes
          <button @click="vote(nominee)" :disabled="hasVoted">Voter</button>
        </li>
      </ul>
    </div>

    <p v-if="hasVoted" style="color: green">✅ Vous avez déjà voté.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const abi = [
  "function getNominees() public view returns (string[])",
  "function vote(string nominee) public",
  "function getVotes(string nominee) public view returns (uint256)",
  "function hasVoted(address voter) public view returns (bool)",
];

const account = ref(null);
const nominees = ref([]);
const votes = ref({});
const hasVoted = ref(false);

let provider;
let signer;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      account.value = await signer.getAddress();

      contract = new ethers.Contract(contractAddress, abi, signer);

      await loadNominees();
      await checkIfVoted();
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
    }
  } else {
    alert("Merci d’installer Metamask !");
  }
}

async function loadNominees() {
  try {
    const noms = await contract.getNominees();
    nominees.value = noms;

    const votesMap = {};
    for (const nominee of noms) {
      const count = await contract.getVotes(nominee);
      votesMap[nominee] = count.toNumber();
    }
    votes.value = votesMap;
  } catch (error) {
    console.error("Erreur récupération candidats/votes", error);
  }
}

async function vote(nominee) {
  try {
    const tx = await contract.vote(nominee);
    await tx.wait();
    hasVoted.value = true;
    await loadNominees();
  } catch (error) {
    alert("Erreur lors du vote (peut-être déjà voté) !");
    console.error(error);
  }
}

async function checkIfVoted() {
  try {
    hasVoted.value = await contract.hasVoted(account.value);
  } catch (error) {
    console.error("Erreur lors de la vérification du vote", error);
  }
}

onMounted(() => {
  if (window.ethereum) {
    connectWallet();
  }
});
</script>
