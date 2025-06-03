const hre = require("hardhat");

async function main() {
    const nominees = ["Kylian Mbappe", "Erling Haaland", "Vinicius Jr"];

    const BallonOrVoting = await hre.ethers.getContractFactory("BallonOrVoting");
    const votingContract = await BallonOrVoting.deploy(nominees);

    await votingContract.waitForDeployment();

    const address = await votingContract.getAddress();
    console.log("✅ Contrat BallonOrVoting deploye a :", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
