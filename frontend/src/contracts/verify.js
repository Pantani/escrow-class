import Escrow from "./Escrow.json";
import { web3 } from "./web3Util.js";

const EscrowContract = new web3.eth.Contract(Escrow.abi);

const call = (contractAddress, method, address) => {
  EscrowContract.options.address = contractAddress;
  return EscrowContract.methods[method]().call({
    from: address,
  });
};
const buyer = (contractAddress, address) => {
  return call(contractAddress, "buyer", address);
};
const seller = (contractAddress, address) => {
  return call(contractAddress, "seller", address);
};
const startDate = (contractAddress, address) => {
  return call(contractAddress, "startDate", address);
};
const buyDate = (contractAddress, address) => {
  return call(contractAddress, "buyDate", address);
};
const getValue = (contractAddress, address) => {
  return call(contractAddress, "getValue", address);
};
const balance = (contractAddress, address) => {
  return call(contractAddress, "balance", address);
};
const buyerOk = (contractAddress, address) => {
  return call(contractAddress, "buyerOk", address);
};
const sellerOk = (contractAddress, address) => {
  return call(contractAddress, "sellerOk", address);
};

const getData = async (contractAddress, address) => {
  return {
    buyer: await buyer(contractAddress, address),
    seller: await seller(contractAddress, address),
    startDate: await startDate(contractAddress, address),
    buyDate: await buyDate(contractAddress, address),
    value: await getValue(contractAddress, address),
    balance: await balance(contractAddress, address),
    buyerOk: await buyerOk(contractAddress, address),
    sellerOk: await sellerOk(contractAddress, address),
  };
};
export default getData;
