<template>
    <div class="ballon-dor-container">
        <div class="header">
            <h1 class="title">🏆 Vote Ballon d'Or 2025 🏆</h1>
            <p v-if="account" class="account-info">
                Connecté en tant que :
                <span class="account-address">{{ account }}</span>
            </p>
            <div class="wallet-section">
                <button
                    @click="connectWallet"
                    class="connect-button"
                    :class="{ connected: account }"
                >
                    {{
                        account ? "Portefeuille Connecté" : "Connecter Metamask"
                    }}
                </button>
            </div>
        </div>

        <div v-if="hasVoted" class="voted-message">
            <span class="check-icon">✅</span>
            <p>Vous avez déjà voté</p>
        </div>

        <div v-if="nominees.length > 0" class="nominees-section">
            <h2 class="section-title">Candidats</h2>
            <div class="nominees-grid">
                <div
                    v-for="nominee in nominees"
                    :key="nominee"
                    class="nominee-card"
                    :class="{ voted: hasVoted }"
                >
                    <h3 class="nominee-name">{{ nominee }}</h3>
                    <div class="votes-count">
                        <span class="votes-number">{{
                            votes[nominee] || 0
                        }}</span>
                        <span class="votes-label">votes</span>
                    </div>
                    <button
                        @click="vote(nominee)"
                        :disabled="hasVoted"
                        class="vote-button"
                        :class="{ disabled: hasVoted }"
                    >
                        {{ hasVoted ? "Déjà voté" : "Voter" }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ethers } from "ethers";

const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
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
        alert("Merci d'installer Metamask !");
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

<style scoped>
.ballon-dor-container {
    margin: 0 auto;
    padding: 2rem;
    font-family: "Inter", sans-serif;
}

.header {
    text-align: center;
    margin-bottom: 3rem;
}

.title {
    font-size: 2.5rem;
    color: #000;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

.wallet-section {
    margin: 2rem;
}

.connect-button {
    background: linear-gradient(135deg, #002068 0%, #002068 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.connect-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.connect-button.connected {
    background: linear-gradient(135deg, #939597 0%, #939597 100%);
}

.account-info {
    margin-top: 1rem;
    color: #666;
    font-size: 0.9rem;
}

.account-address {
    font-family: monospace;
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

.nominees-section {
    margin-top: 2rem;
}

.section-title {
    font-size: 1.8rem;
    color: #000;
    margin-bottom: 2rem;
    text-align: center;
}

.nominees-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
}

.nominee-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
}

.nominee-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}

.nominee-name {
    font-size: 1.25rem;
    color: #1a1a1a;
    margin-bottom: 1rem;
    text-align: center;
}

.votes-count {
    text-align: center;
    margin-bottom: 1rem;
}

.votes-number {
    font-size: 2rem;
    font-weight: 700;
    color: #002068;
}

.votes-label {
    display: block;
    color: #666;
    font-size: 0.9rem;
}

.vote-button {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    background: #002068;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.vote-button:hover:not(.disabled) {
    background: #4338ca;
}

.vote-button.disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

.voted-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
    padding: 1rem;
    background: #dcfce7;
    border-radius: 8px;
    color: #16a34a;
}

.check-icon {
    font-size: 1.25rem;
}

@media (max-width: 768px) {
    .ballon-dor-container {
        padding: 1rem;
    }

    .title {
        font-size: 2rem;
    }

    .nominees-grid {
        grid-template-columns: 1fr;
    }
}
</style>
