//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Escrow {
    address payable public buyer;
    address payable public seller;
    string public trackNumber;
    uint256 public startDate;
    uint256 public buyDate;
    uint256 private value;
    uint256 public balance;
    bool public buyerOk;
    bool public sellerOk;

    event Buy(address from, uint256 value);
    event Sent();
    event Finish();

    constructor(uint256 _value) {
        seller = payable(msg.sender);
        value = _value;
        startDate = block.timestamp;
        balance = 0;
        buyDate = 0;
        buyerOk = false;
        sellerOk = false;
    }

    modifier available() {
        require(sellerOk == false, "product already sent");
        require(buyerOk == false, "product already received");
        _;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can do this action");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can do this action");
        _;
    }

    function buy() public payable available {
        require(msg.value > 0, "tx without value");
        require(msg.value >= value, "insufficient funds");
        require(buyer == address(0), "already have a buyer");
        require(msg.sender != seller, "buyer cannot be the seller");

        buyer = payable(msg.sender);
        balance += msg.value; // balance = balance + msg.value;
        buyDate = block.timestamp;
        emit Buy(buyer, msg.value);
    }

    function getValue() external view returns (uint256) {
        return (value);
    }

    function addBalance() public payable available onlyBuyer {
        require(msg.value > 0, "tx without value");
        require(msg.value + balance >= value, "insufficient funds");
        balance += msg.value; // balance = balance + msg.value;
    }

    function changeValue(uint256 _value) public available onlySeller {
        require(buyer == address(0), "already have a buyer");
        value = _value;
    }

    function sendProduct(string memory _trackNumber)
        public
        available
        onlySeller
    {
        require(balance >= value, "insufficient funds");
        sellerOk = true;
        trackNumber = _trackNumber;
        emit Sent();
    }

    function confirmProduct() public onlyBuyer {
        require(sellerOk == true, "product was not sent");
        buyerOk = true;
        paySeller();
    }

    function paySeller() private {
        require(balance > 0, "contract without balance");
        require(sellerOk == true, "product was not sent");
        require(buyerOk == true, "product was not confirmed");
        bool ok = seller.send(balance);
        if (ok == true) {
            balance = 0;
            emit Finish();
        }
    }

    function refund() public onlySeller {
        require(balance > 0, "contract without balance");
        bool ok = buyer.send(balance);
        if (ok) {
            balance = 0;
            buyer = payable(0);
            buyDate = 0;
            sellerOk = false;
            trackNumber = "";
        }
    }

    function report() public onlyBuyer {
        require(sellerOk == false, "product already sent");
        require(
            block.timestamp > buyDate + 5 days,
            "you need unless 5 days after buy"
        );
        if (buyer.send(balance)) {
            balance = 0;
            buyer = payable(0);
            sellerOk = false;
        }
    }
}
