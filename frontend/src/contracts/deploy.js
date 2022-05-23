import Escrow from './Escrow.json';
import {EscrowContract} from './web3Util.js';

const deploy = (value, depositorAddress) => {
    const deployParameters = {
        arguments: [value],
        data: Escrow.bytecode,
    }
    return EscrowContract.deploy(deployParameters).estimateGas().then((gas) => {
        return EscrowContract.deploy(deployParameters).send({
            from: depositorAddress,
            gas
        });
    })
}

export default deploy;
