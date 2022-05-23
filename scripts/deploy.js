const { artifacts } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // ethers is available in the global scope
  const [deployer] = await hre.ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(3);
  await escrow.deployed();
  console.log("Escrow deployed to:", escrow.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(escrow);
}

function saveFrontendFiles(escrow) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Escrow: escrow.address }, undefined, 2)
  );

  const EscrowArtifact = artifacts.readArtifactSync("Escrow");

  fs.writeFileSync(
    contractsDir + "/Escrow.json",
    JSON.stringify(EscrowArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
