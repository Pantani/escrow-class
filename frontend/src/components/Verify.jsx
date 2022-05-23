import React, {Component} from 'react';
import getData from '../contracts/verify';

class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAddress: this.props.selectedAddress,
            escrowAddress: '',
            buyer: '',
            seller: '',
            startDate: 0,
            buyDate: 0,
            value: 0,
            balance: 0,
            buyerOk: false,
            sellerOk: false,
            trackNumber: '',
        }
        this.verify = this.verify.bind(this);
    }

    verify() {
        const {escrowAddress, selectedAddress} = this.state;
        getData(escrowAddress, selectedAddress).then((data) => {
            const {
                buyer,
                seller,
                startDate,
                buyDate,
                value,
                balance,
                buyerOk,
                sellerOk,
                trackNumber
            } = data;

            this.setState({
                buyer: buyer,
                seller: seller,
                startDate: startDate,
                buyDate: buyDate,
                value: value,
                balance: balance,
                buyerOk: buyerOk,
                sellerOk: sellerOk,
                trackNumber: trackNumber,
            });
        }).catch((err) => {
            alert(err.message);
        });
    }

    handleChange(prop) {
        return ({target}) => this.setState({[prop]: target.value});
    }

    render() {
        const {escrowAddress} = this.state;
        return (
            <div className="container py-3 px-4 my-3 border">
                <h1> Verify Contract </h1>
                <p className="font-weight-light">
                    This is the function to get all contract data.
                </p>
                <div className="d-flex">
                    <div className="container">
                        <form>
                            <div className="form-group">
                                <label htmlFor="beneficiary">Escrow Address
                                    <input type="text" className="form-control" id="escrow"
                                           placeholder="Contract Address"
                                           value={escrowAddress} onChange={this.handleChange('escrowAddress')}/>
                                </label>
                            </div>
                            <div className="btn btn-primary" onClick={this.verify}>Verify</div>
                        </form>
                    </div>
                    <div className="container">
                        <ul className="list-group py-2">
                            <li>
                                buyer: {this.state.buyer}
                            </li>
                            <li>
                                seller: {this.state.seller}
                            </li>
                            <li>
                                startDate: {this.state.startDate}
                            </li>
                            <li>
                                buyDate: {this.state.buyDate}
                            </li>
                            <li>
                                value: {this.state.value}
                            </li>
                            <li>
                                balance: {this.state.balance}
                            </li>
                            <li>
                                buyerOk: {this.state.buyerOk.toString()}
                            </li>
                            <li>
                                sellerOk: {this.state.sellerOk.toString()}
                            </li>
                            <li>
                                trackNumber: {this.state.trackNumber}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Verify;
