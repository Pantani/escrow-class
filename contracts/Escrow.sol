//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// uint - variável do tipo número inteiros positivos.
// bool - variável de falso e verdadeiro.
// address - variável tipo endereço de carteira/contrato.
// mais tipos de variáveis em https://solidity.readthedocs.io/en/latest/types.html

// Contrato de Escrow - A idéia desse contrato é ser um tipo de "Mercado Pago",
// o vendedor faz o deploy do contrato indicando o valor do mesmo, assim o comprador
// deposita no contrato o valor indicado pelo vendedor. O vendedor confirma o envio
// para depois o comprador confirma o recebimento, liberando o dinheiro para o vendedor.
contract Escrow {
    address payable public buyer; // Endereço do comprador.
    address payable public seller; // Endereço do vendedor.
    string public trackNumber; // Número de entrega.
    uint256 public startDate; // Data que colocou o contrato na rede.
    uint256 public buyDate; // Data que o comprador fez o pagamento.
    uint256 private value; // Valor que precisa ser transferido.
    uint256 public balance; // Saldo do contrato.
    bool public buyerOk; // Guarda se está ok pela parte do comprador.
    bool public sellerOk; // Guarda se está ok pela parte do vendedor.

    // Evento se alguém comprou.
    event Buy(address from, uint256 value);
    // Evento quando o envio do produto é feito.
    event Sent();
    // Evento quando o escrow é finalizado.
    event Finish();

    // Construtor do contrato, é chamado apenas uma vez quando o contrato for incializado.
    // Quando inicializar vamos passar o valor do escrow.
    constructor(uint256 _value) {
        seller = payable(msg.sender); // Guardando o endereço de quem fez deploy do contrato
        value = _value; // Guardando o valor do contrato
        // Zerando o saldo e outros valores padroes.
        balance = 0;
        buyDate = 0;
        buyerOk = false;
        sellerOk = false;
        startDate = block.timestamp; // Guardando a data que o contrato foi para a rede
    }

    // modifier para verificar se o produto ja foi enviado ou recebido
    modifier available() {
        require(sellerOk == false, "O produto ja foi enviado");
        require(buyerOk == false, "O produto ja foi recebido");
        _;
    }

    // modifier para verificar se é o vendedor
    modifier onlySeller() {
        require(
            msg.sender == seller,
            "Somente o vendedor pode fazer essa acao"
        );
        _;
    }

    // modifier para verificar se é o comprador
    modifier onlyBuyer() {
        require(
            msg.sender == buyer,
            "Somente o comprador pode fazer essa acao"
        );
        _;
    }

    // Função que o comprador irá executar para transferir seu ether para o escrow.
    function buy() public payable available {
        require(
            msg.value > 0,
            "O valor transferido precisa ser maior que zero"
        );
        require(
            msg.value >= value,
            "O valor transferido precisa ser maior que o valor do escrow"
        );
        require(
            buyer == address(0),
            "Ja existe um comprador para esse contrato"
        );
        require(
            seller != msg.sender,
            "Comprador nao pode ser o mesmo que o vendedor"
        );
        buyer = payable(msg.sender); // Guarda o endereço do vendedor.
        balance += msg.value; // Adiciona o valor transferido ao saldo.
        buyDate = block.timestamp; // Guarda a data que foi feito o pagamento.
        emit Buy(buyer, msg.value); // Emite um evento de compra.
    }

    // retornar o valor por getter
    function getValue() external view returns (uint256) {
        return (value);
    }

    // Adiciona mais fundos para o contrato.
    function addMoreBalance() public payable available onlyBuyer {
        require(
            msg.value > 0,
            "O valor transferido precisa ser maior que zero"
        );
        require(
            (msg.value + balance) >= value,
            "O valor do saldo precisa ser mairo que o valor do escrow"
        );
        balance += msg.value; // Adiciona o valor transferido ao saldo.
    }

    // Altera o valor do escrow.
    function changeValue(uint256 _value) public available onlySeller {
        require(
            buyer == address(0),
            "Valor so pode ser alterado caso nao tenha um comprador"
        );
        value = _value; // Muda o valor do escrow.
    }

    // Função que o vendedor avisa que o produto já foi enviado.
    function sendProduct(string memory _trackNumber) public available onlySeller {
        require(balance >= value, "Saldo deve ser maior que o valor do escrow");
        sellerOk = true; // Adiciona status ok para o vendedor.
        trackNumber = _trackNumber; // Salva o numero de entrega
        emit Sent(); // Emite um evento que o produto foi enviado.
    }

    // Função para o comprador confirmar que recebeu o produto.
    function confirmProduct() public onlyBuyer {
        require(sellerOk == true, "O produto ainda nao foi enviado");
        buyerOk = true; // Adiciona o status ok para o comprador.
        paySeller(); // Chama a função que faz o pagamento para o vendedor.
    }

    // Função para pagar o vendedor
    function paySeller() private {
        require(balance > 0, "Contrato nao possui saldo");
        require(sellerOk == true, "O produto ainda nao foi enviado");
        require(buyerOk == true, "O produto ainda nao foi recebido");
        bool ok = seller.send(balance); // Faz o envio do balanço para o vendedor.
        if (ok == true) { // Verifica se o envio foi feito.
            balance = 0; // Zera o saldo.
            emit Finish(); // Emite um evento de finalização do escrow.
            // selfdestruct(seller); // Também podemos matar no fim do escrow
        }
    }

    // Função que o vendedor chama para estornar o valor para o comprador.
    function refund() public onlySeller {
        require(balance > 0, "Contrato nao possui saldo");
        bool ok = buyer.send(balance);
        // Faz o envio do balanço para o comprador
        if (ok) {// Verifica se o envio foi feito.
            balance = 0; // Zera o saldo.
            buyer = payable(0); // Remove o comprador para o produto ficar disponível novamente para compra.
            buyDate = 0; // Zera a data de compra.
            sellerOk = false; // Mudar o status o vendedor para não ok.
            trackNumber = ""; // Zera o numero de envio
        }
    }

    // Função para o comprador reportar intavidade do vendedor depois de 30 dias da compra.
    function report() public onlyBuyer {
        require(sellerOk == false, "Comprador ja enviou o produto");
        require(
            block.timestamp > buyDate + 30 days,
            "Voce so pode reportar um erro 30 dias depois da compra"
        );
        if (buyer.send(balance)) { // Faz o envio do balanço para o comprador já verificando se o envio foi feito.
            balance = 0; // Zera o saldo.
            buyer = payable(0); // Remove o comprador para o produto ficar disponível novamente para compra.
            sellerOk = false; // Mudar o status o vendedor para não ok.
        }
    }
}
