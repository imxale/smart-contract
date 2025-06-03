const hre = require("hardhat");

async function main() {
    const nominees = [
        "Ousmane Dembélé",
        "Kylian Mbappe",
        "Erling Haaland",
        "Lamine Yamal",
    ];

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
