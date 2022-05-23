import Escrow from "./Escrow.json";
import { web3 } from "./web3Util.js";

const EscrowContract = new web3.eth.Contract(Escrow.abi);

const deploy = (value, address) => {
  const deployParams = {
    arguments: [value],
    data: Escrow.bytecode,
  };
  return EscrowContract.deploy(deployParams)
    .estimateGas()
    .then((gas) => {
      return EscrowContract.deploy(deployParams).send({
        from: address,
        gas,
      });
    });
};

export default deploy;
