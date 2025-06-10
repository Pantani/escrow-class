import {EscrowContract} from './web3Util.js';

const buy = (escrowContractAddress, address, amount) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.buy().send({from: address, value: amount});
}

const addMoreBalance = (escrowContractAddress, address, amount) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.addMoreBalance().send({from: address, value: amount});
}

const changeValue = (escrowContractAddress, address, newValue) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.changeValue(newValue).send({from: address});
}

const sendProduct = (escrowContractAddress, address, trackNumber) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.sendProduct(trackNumber).send({from: address});
}

const confirmProduct = (escrowContractAddress, address) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.confirmProduct().send({from: address});
}

const refund = (escrowContractAddress, address) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.refund().send({from: address});
}

const report = (escrowContractAddress, address) => {
    EscrowContract.options.address = escrowContractAddress;
    return EscrowContract.methods.report().send({from: address});
}

export {buy, addMoreBalance, changeValue, sendProduct, confirmProduct, refund, report};

