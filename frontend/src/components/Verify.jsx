import React, { Component } from "react";
import getData from "../contracts/verify";
import { web3 } from "../contracts/web3Util";

class Verify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      escrowAddress: "",
      buyer: "",
      seller: "",
      startDate: 0,
      buyDate: 0,
      value: 0,
      balance: 0,
      sellerOk: false,
      buyerOk: false,
    };
    this.verify = this.verify.bind(this);
  }

  verify() {
    const { escrowAddress } = this.state;
    if (web3) {
      web3.eth.getAccounts().then((accounts) => {
        let account = accounts[0];
        if (account) {
          getData(escrowAddress, account).then((data) => {
            const {
              buyer,
              seller,
              startDate,
              buyDate,
              value,
              balance,
              sellerOk,
              buyerOk,
            } = data;

            this.setState({
              buyer: buyer,
              seller: seller,
              startDate: startDate,
              buyDate: buyDate,
              value: value,
              balance: balance,
              sellerOk: sellerOk,
              buyerOk: buyerOk,
            }).catch((err) => {
              alert(err);
            });
          });
        }
      });
    }
  }

  handleChange(prop) {
    return ({ target }) => this.setState({ [prop]: target.value });
  }

  render() {
    const { escrowAddress } = this.state;
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
                <label htmlFor="beneficiary">
                  Escrow Address
                  <input
                    type="text"
                    className="form-control"
                    id="escrow"
                    placeholder="Contract Address"
                    value={escrowAddress}
                    onChange={this.handleChange("escrowAddress")}
                  />
                </label>
              </div>
              <div className="btn btn-primary" onClick={this.verify}>
                Verify
              </div>
            </form>
          </div>
          <div className="container">
            <ul className="list-group py-2">
              <li>buyer: {this.state.buyer}</li>
              <li>seller: {this.state.seller}</li>
              <li>startDate: {this.state.startDate}</li>
              <li>buyDate: {this.state.buyDate}</li>
              <li>value: {this.state.value}</li>
              <li>balance: {this.state.balance}</li>
              <li>buyerOk: {this.state.buyerOk}</li>
              <li>sellerOk: {this.state.sellerOk}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Verify;
