import React, {Component} from 'react';
import {
    addMoreBalance,
    buy,
    changeValue,
    confirmProduct,
    refund,
    sendProduct,
    report
} from '../contracts/send';

class Actions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAddress: this.props.selectedAddress,
            escrowAddress: '',
            trackNumber: '',
            buyValue: 0,
            moreBalance: 0,
            newEscrowValue: 0,
            transactions: [],
        }
        this.buyEscrow = this.buyEscrow.bind(this);
        this.changeEscrowValue = this.changeEscrowValue.bind(this);
        this.addMoreEscrowBalance = this.addMoreEscrowBalance.bind(this);
        this.confirmEscrowProduct = this.confirmEscrowProduct.bind(this);
        this.sendEscrowProduct = this.sendEscrowProduct.bind(this);
        this.refundEscrow = this.refundEscrow.bind(this);
        this.reportEscrow = this.reportEscrow.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    buyEscrow() {
        const {escrowAddress, selectedAddress, buyValue} = this.state;
        buy(escrowAddress, selectedAddress, buyValue).then((receipt) => {
            this.setState({
                transactions: this.state.transactions.concat(`Buy successful at ${receipt.transactionHash}.`)
            });
        }).catch((err) => {
            this.setState({
                transactions: this.state.transactions.concat(`Buy unsuccessful for Escrow at ${escrowAddress}: ${err.message}`)
            });
        });
    }

    changeEscrowValue() {
        const {escrowAddress, selectedAddress, newEscrowValue} = this.state;
        changeValue(escrowAddress, selectedAddress, newEscrowValue).then((receipt) => {
            this.setState({
                transactions: this.state.transactions.concat(`Change value successful at ${receipt.transactionHash}.`)
            });
        }).catch((err) => {
            this.setState({
                transactions: this.state.transactions.concat(`Change value unsuccessful for Escrow at ${escrowAddress}: ${err.message}`)
            });
        });
    }

    addMoreEscrowBalance() {
        const {escrowAddress, selectedAddress, moreBalance} = this.state;
        addMoreBalance(escrowAddress, selectedAddress, moreBalance).then((receipt) => {
            console.log(receipt);
            this.setState({
                transactions: this.state.transactions.concat(`Add more balance successful at ${receipt.transactionHash}.`)
            });
        }).catch((err) => {
            this.setState({
                transactions: this.state.transactions.concat(`Add more balance unsuccessful for Escrow at ${escrowAddress}: ${err.message}`)
            });
        });
    }

    confirmEscrowProduct() {
        const {escrowAddress, selectedAddress} = this.state;
        confirmProduct(escrowAddress, selectedAddress).then((receipt) => {
            this.setState({
                transactions: this.state.transactions.concat(`Confirm product successful at ${receipt.transactionHash}.`)
            });
        }).catch((err) => {
            this.setState({
                transactions: this.state.transactions.concat(`Confirm product unsuccessful for Escrow at ${escrowAddress}: ${err.message}`)
            });
        });
    }

    sendEscrowProduct() {
        const {escrowAddress, selectedAddress, trackNumber} = this.state;
        sendProduct(escrowAddress, selectedAddress, trackNumber).then((receipt) => {
            this.setState({
                transactions: this.state.transactions.concat(`Send product successful at ${receipt.transactionHash}.`)
            });
        }).catch((err) => {
            this.setState({
                transactions: this.state.transactions.concat(`Send product unsuccessful for Escrow at ${escrowAddress}: ${err.message}`)
            });
        });
    }

    refundEscrow() {
        const {escrowAddress, selectedAddress} = this.state;
        refund(escrowAddress, selectedAddress).then((receipt) => {
            this.setState({
                transactions: this.state.transactions.concat(`Refund successful at ${receipt.transactionHash}.`)
            });
        }).catch((err) => {
            this.setState({
                transactions: this.state.transactions.concat(`Refund unsuccessful for Escrow at ${escrowAddress}: ${err.message}`)
            });
        });
    }

    reportEscrow() {
        const {escrowAddress, selectedAddress} = this.state;
        report(escrowAddress, selectedAddress).then((receipt) => {
            this.setState({
                transactions: this.state.transactions.concat(`Report successful at ${receipt.transactionHash}.`)
            });
        }).catch((err) => {
            this.setState({
                transactions: this.state.transactions.concat(`Report unsuccessful for Escrow at ${escrowAddress}: ${err.message}`)
            });
        });
    }

    handleChange(prop) {
        return ({target}) => this.setState({[prop]: target.value});
    }

    render() {
        const {buyValue, moreBalance, newEscrowValue, trackNumber, escrowAddress, transactions} = this.state;
        return (
            <div className="container py-3 px-4 my-3 border">
                <h1> Escrow Actions </h1>
                <p className="font-weight-light">
                    This is the function the arbiter make actions in the contract.
                </p>
                <form>
                    <div className="form-group">
                        <label>Escrow Address
                            <input type="text" className="form-control" id="escrow" placeholder="Contract Address"
                                   value={escrowAddress} onChange={this.handleChange('escrowAddress')}/>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>Change Escrow Value:
                            <input type="number" className="form-control" id="newEscrowValue" placeholder="Value"
                                   value={newEscrowValue} onChange={this.handleChange('newEscrowValue')}/>
                        </label>
                        <div className="btn btn-primary m-sm-1" onClick={this.changeEscrowValue}>Change Value</div>
                    </div>
                    <div className="form-group">
                        <label>Buy:
                            <input type="number" className="form-control" id="buyValue" placeholder="Value"
                                   value={buyValue} onChange={this.handleChange('buyValue')}/>
                        </label>
                        <div className="btn btn-primary m-sm-1" onClick={this.buyEscrow}>Buy</div>
                    </div>
                    <div className="form-group">
                        <label>Add More Balance:
                            <input type="number" className="form-control" id="moreBalance" placeholder="Value"
                                   value={moreBalance} onChange={this.handleChange('moreBalance')}/>
                        </label>
                        <div className="btn btn-primary m-sm-1" onClick={this.addMoreEscrowBalance}>Add More Balance
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Track Number:
                            <input type="text" className="form-control" id="trackNumber" placeholder="Track Number"
                                   value={trackNumber} onChange={this.handleChange('trackNumber')}/>
                        </label>
                        <div className="btn btn-primary m-sm-1" onClick={this.sendEscrowProduct}>Send Product</div>
                    </div>
                    <div className="form-group">
                        <div className="btn btn-primary m-sm-1" onClick={this.confirmEscrowProduct}>Confirm Product
                        </div>
                        <div className="btn btn-danger m-sm-1" onClick={this.refundEscrow}>Refund</div>
                        <div className="btn btn-danger m-sm-1" onClick={this.reportEscrow}>Report</div>
                    </div>
                </form>
                <ul className="list-group py-2">
                    {
                        transactions.map(tx => {
                            return (
                                <li className="alert alert-info" key={tx}>
                                    {tx}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default Actions;
