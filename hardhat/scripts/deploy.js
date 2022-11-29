const { ethers } = require("hardhat");
require("dotenv").config({ path: "../.env" });

async function main() {
  const CONTRACT_NAME = "NFTPunks";
  const METADATA_URL = "ipfs://QmfLENBhCPu3RXjsJjzkwK6WPgUGKeteFSCYQaeMqrmQgF/";

  const contract = await ethers.getContractFactory(CONTRACT_NAME);

  /* ############ START => Additional Deployement Steps (Optional) ######################## */
  {
    const gasPrice = await contract.signer.getGasPrice();
    console.log(`Current gas price: ${gasPrice}`);
    const estimatedGas = await contract.signer.estimateGas(
      contract.getDeployTransaction(METADATA_URL) //Need to change as per Contract constructor
    );
    console.log(`Estimated gas: ${estimatedGas}`);
    const deploymentPrice = gasPrice.mul(estimatedGas);
    const deployerBalance = await contract.signer.getBalance();
    console.log(
      `Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`
    );
    console.log(
      `Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`
    );
    if (Number(deployerBalance) < Number(deploymentPrice)) {
      throw new Error("You dont have enough balance to deploy.");
    }
  }
  /* ############ END   => Additional Deployement Steps (Optional) ######################## */

  const deployedContract = await contract.deploy(METADATA_URL);
  await deployedContract.deployed();

  console.log(CONTRACT_NAME + " deployed address is", deployedContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
