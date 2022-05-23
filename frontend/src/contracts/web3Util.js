const Web3 = require('web3');
import Escrow from './Escrow.json';

const web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider('http://localhost:8545'));
const EscrowContract = new web3.eth.Contract(Escrow.abi);

export {web3, EscrowContract};

