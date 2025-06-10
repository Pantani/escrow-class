const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Escrow", function () {
    let contractFactory;
    let contract;
    let escrowValue = 11111;
    let seller;
    let buyer;
    let sellerAddress;
    let buyerAddress;

    beforeEach(async () => {
        [seller, buyer] = await ethers.getSigners();
        contractFactory = await ethers.getContractFactory("Escrow");
        contract = await contractFactory.deploy(escrowValue);
        sellerAddress = await seller.getAddress();
        buyerAddress = await buyer.getAddress();
    });

    describe("Correct setup", () => {
        it("should have correct values", async () => {
            const contractValue = await contract.getValue();
            expect(contractValue).to.equal(escrowValue);

            const buyerOk = await contract.buyerOk();
            expect(buyerOk).to.equal(false);

            const sellerOk = await contract.sellerOk();
            expect(sellerOk).to.equal(false);

            const balance = await contract.balance();
            expect(balance).to.equal(0);

            const startDate = await contract.startDate();
            expect(startDate.toNumber()).to.greaterThan(0);

            const buyDate = await contract.buyDate();
            expect(buyDate).to.equal(0);
        });
    });

    describe("Pre Buy", () => {
        it("change value", async () => {
            newValue = 33;
            await contract.changeValue(newValue);

            const contractValue = await contract.getValue();
            expect(contractValue).to.equal(newValue);
        });
    });

    describe("Buy", () => {
        it("Should fail if sender doesn’t send enough tokens", async function () {
            const options = {value: escrowValue - 1};
            // TODO check error msg assertion
            await expect(contract.connect(buyer).buy(options)).to.be.revertedWith(
                "VM Exception while processing transaction: reverted with reason string 'O valor transferido precisa ser maior que o valor do escrow"
            );
        });

        it("refund", async () => {
            let options = {value: escrowValue};
            await contract.connect(buyer).buy(options);

            let balance = await contract.balance();
            expect(balance).to.equal(escrowValue);

            let buyerValue = await contract.buyer();
            expect(buyerValue).to.equal(buyerAddress);

            let startDate = await contract.startDate();
            let buyDate = await contract.buyDate();
            expect(buyDate.toNumber()).to.greaterThan(0);
            expect(startDate.toNumber()).to.lessThanOrEqual(buyDate.toNumber());

            await contract.refund();

            balance = await contract.balance();
            expect(balance).to.equal(0);

            buyDate = await contract.buyDate();
            expect(buyDate).to.equal(0);

            buyerValue = await contract.buyer();
            expect(buyerValue).to.equal("0x0000000000000000000000000000000000000000");
        });

        it("buy and add more balance", async () => {
            let options = {value: escrowValue};
            await contract.connect(buyer).buy(options);

            let balance = await contract.balance();
            expect(balance).to.equal(escrowValue);

            const buyerValue = await contract.buyer();
            expect(buyerValue).to.equal(buyerAddress);

            let startDate = await contract.startDate();
            let buyDate = await contract.buyDate();
            expect(buyDate.toNumber()).to.greaterThan(0);
            expect(startDate.toNumber()).to.lessThanOrEqual(buyDate.toNumber());

            increase = 10;
            options = {value: increase};
            await contract.connect(buyer).addMoreBalance(options);

            balance = await contract.balance();
            expect(balance).to.equal(escrowValue + increase);
        });

        it("buy and and send product", async () => {
            const trackNumber = "FFGA3EV34";
            let options = {value: escrowValue};
            await contract.connect(buyer).buy(options);

            balance = await contract.balance();
            expect(balance).to.equal(escrowValue);

            let buyerValue = await contract.buyer();
            expect(buyerValue).to.equal(buyerAddress);

            let startDate = await contract.startDate();
            let buyDate = await contract.buyDate();
            expect(buyDate.toNumber()).to.greaterThan(0);
            expect(startDate.toNumber()).to.lessThanOrEqual(buyDate.toNumber());

            await contract.sendProduct();

            const sellerOk = await contract.sellerOk();
            expect(sellerOk).to.equal(true);

            await contract.connect(buyer).confirmProduct();

            const buyerOk = await contract.buyerOk();
            expect(buyerOk).to.equal(true);
        });
    });
});
