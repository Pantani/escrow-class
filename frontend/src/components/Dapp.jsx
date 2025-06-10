import React, {Component} from 'react';
import Actions from './Actions';
import Deployment from './Deployment';
import Verify from './Verify';
import {NoWalletDetected} from "./NoWalletDetected";
import {ConnectWallet} from "./ConnectWallet";

class Dapp extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            selectedAddress: undefined,
        };
        this.state = this.initialState;
    }

    resetState() {
        this.setState(this.initialState);
    }

    async connectWallet() {
        const [selectedAddress] = await window.ethereum.request({method: 'eth_requestAccounts'});
        this.initialize(selectedAddress);

        window.ethereum.on("accountsChanged", ([newAddress]) => {
            if (newAddress === undefined) {
                return this.resetState();
            }
            this.initialize(newAddress);
        });
        window.ethereum.on("chainChanged", () => {
            this.resetState();
        });
    }

    initialize(userAddress) {
        this.setState({
            selectedAddress: userAddress,
        });
    }

    render() {
        if (window.ethereum === undefined) {
            return <NoWalletDetected/>;
        }

        const {selectedAddress} = this.state;
        if (!selectedAddress) {
            return (
                <ConnectWallet
                    connectWallet={() => this.connectWallet()}
                />
            );
        }

        return (
            <React.Fragment>
                <Deployment selectedAddress={selectedAddress}/>
                <Verify selectedAddress={selectedAddress}/>
                <Actions selectedAddress={selectedAddress}/>
            </React.Fragment>
        );
    }
}

export default Dapp;
