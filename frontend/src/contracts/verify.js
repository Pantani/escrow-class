import {EscrowContract} from './web3Util.js';

const buyer = (escrowContractAddress, address) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.buyer().call({from: address})
}
const seller = (escrowContractAddress, address) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.seller().call({from: address})
}
const startDate = (escrowContractAddress, address) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.startDate().call({from: address})
}
const buyDate = (escrowContractAddress, address) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.buyDate().call({from: address})
}
const getValue = (escrowContractAddress, address) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.getValue().call({from: address})
}
const balance = (escrowContractAddress, address) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.balance().call({from: address})
}
const buyerOk = (escrowContractAddress, address) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.buyerOk().call({from: address})
}
const sellerOk = (escrowContractAddress, address) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.sellerOk().call({from: address})
}
const trackNumber = (escrowContractAddress, address) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.trackNumber().call({from: address})
}

const getData = async (escrowContractAddress, address) => {
    return {
        buyer: await buyer(escrowContractAddress, address),
        seller: await seller(escrowContractAddress, address),
        startDate: await startDate(escrowContractAddress, address),
        buyDate: await buyDate(escrowContractAddress, address),
        value: await getValue(escrowContractAddress, address),
        balance: await balance(escrowContractAddress, address),
        buyerOk: await buyerOk(escrowContractAddress, address),
        sellerOk: await sellerOk(escrowContractAddress, address),
        trackNumber: await trackNumber(escrowContractAddress, address),
    }
}

export default getData;
