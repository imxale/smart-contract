const hre = require("hardhat");

async function main() {
    const contactAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const Safe = await hre.ethers.getContractFactory("BallonOr");
    const SafeAddress = Safe.attach(contactAddress);

    const [owner, wallet2, wallet3] = await hre.ethers.getSigners();

    const tx = await SafeAddress.connect(owner).sendMoney({
        value: hre.ethers.parseEther("0.1") // Montant à envoyer
    });
    await tx.wait();

    const balance = await SafeAddress.viewBalance();
    console.log(`Balance of Safe contract: ${hre.ethers.formatEther(balance)} ETH`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
