// Registra o Service Worker, se disponível
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js');
    });
}

let resposta = document.getElementById("res");

function limpaResposta() {
    resposta.innerHTML = "";
}

// Função chamada ao clicar nos botões de forma de pagamento
function selectPayment(button) {
    // Remove a classe active de todos os botões
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Adiciona a classe active no botão clicado
    button.classList.add('active');
    // Exibe ou oculta o select de parcelas conforme o tipo de pagamento
    const isParcelado = button.dataset.type === 'creditoParcelado';
    document.getElementById('paragrafo').style.display = isParcelado ? 'block' : 'none';
    // Limpa a resposta exibida anteriormente
    limpaResposta();
}

// Função principal para calcular os valores com e sem taxas usando Decimal.js
function calcular() {
    const activeButton = document.querySelector('.payment-btn.active');
    if (!activeButton) {
        alert("Selecione uma forma de pagamento.");
        return;
    }
    const paymentType = activeButton.dataset.type;
    const valorInput = document.getElementById("valorCompra").value;
    const valor = parseFloat(valorInput);
    if (!valor || isNaN(valor)) {
        alert("Digite um valor válido.");
        return;
    }

    // Cria uma instância Decimal com o valor informado
    const valorDec = new Decimal(valor);
    let valorSemtaxa, valorComTaxa;

    if (paymentType === 'debito') {
        const taxaRate = new Decimal(2.39);
        valorSemtaxa = valorDec.times(new Decimal(1).minus(taxaRate.dividedBy(100)));
        valorComTaxa = valorDec.times(100).dividedBy(new Decimal(100).minus(taxaRate));
        const valorSemTaxaFmt = Number(valorSemtaxa.toFixed(2))
            .toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        const valorComTaxaFmt = Number(valorComTaxa.toFixed(2))
            .toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        respostaVista(valor, valorSemTaxaFmt, valorComTaxaFmt, "2,39");
    } else if (paymentType === 'creditoVista') {
        const taxaRate = new Decimal(4.99);
        valorSemtaxa = valorDec.times(new Decimal(1).minus(taxaRate.dividedBy(100)));
        valorComTaxa = valorDec.times(100).dividedBy(new Decimal(100).minus(taxaRate));
        const valorSemTaxaFmt = Number(valorSemtaxa.toFixed(2))
            .toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        const valorComTaxaFmt = Number(valorComTaxa.toFixed(2))
            .toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        respostaVista(valor, valorSemTaxaFmt, valorComTaxaFmt, "4,99");
    } else if (paymentType === 'creditoParcelado') {
        // Cálculo para crédito parcelado: seleciona a taxa conforme a quantidade de parcelas
        const parcelas = parseInt(document.getElementById("select").value);
        let taxa;
        switch (parcelas) {
            case 2:
                taxa = 9.91;
                break;
            case 3:
                taxa = 11.29;
                break;
            case 4:
                taxa = 12.64;
                break;
            case 5:
                taxa = 13.97;
                break;
            case 6:
                taxa = 15.27;
                break;
            case 7:
                taxa = 16.55;
                break;
            case 8:
                taxa = 17.81;
                break;
            case 9:
                taxa = 19.04;
                break;
            case 10:
                taxa = 20.24;
                break;
            case 11:
                taxa = 21.43;
                break;
            case 12:
                taxa = 22.59;
                break;
            default:
                alert("Número de parcelas inválido.");
                return;
        }
        valorComTaxa = valorDec.times(100).dividedBy(new Decimal(100).minus(new Decimal(taxa)));
        const parcelasComTaxa = valorComTaxa.dividedBy(parcelas);
        valorSemtaxa = valorDec.times(new Decimal(1).minus(new Decimal(taxa).dividedBy(100)));
        const parcelasSemTaxa = valorDec.dividedBy(parcelas);

        const valorComTaxaFmt = Number(valorComTaxa.toFixed(2))
            .toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        const parcelasComTaxaFmt = Number(parcelasComTaxa.toFixed(2))
            .toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        const valorSemTaxaFmt = Number(valorSemtaxa.toFixed(2))
            .toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        const parcelasSemTaxaFmt = Number(parcelasSemTaxa.toFixed(2))
            .toLocaleString('pt-BR', { minimumFractionDigits: 2 });

        calcularParcelado(
            valor,
            parcelas,
            taxa,
            valorComTaxaFmt,
            parcelasComTaxaFmt,
            valorSemTaxaFmt,
            parcelasSemTaxaFmt
        );
    }
}

// Exibe os resultados para débito e crédito à vista
function respostaVista(valor, valorSemtaxa, valorComTaxa, taxaStr) {
    const valorFmt = Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    resposta.innerHTML = `
        <p class="comtaxa">Você deve cobrar ${valorComTaxa} reais para receber ${valorFmt} reais.</p>
        <p class="semtaxa">Cobrar ${valorFmt} reais você vai receber apenas ${valorSemtaxa} reais.</p>
        <p>Taxa: ${taxaStr}%</p>
    `;
}

// Exibe os resultados para crédito parcelado
function calcularParcelado(valor, parcelas, taxa, valorComTaxa, parcelasComTaxa, valorSemtaxa, parcelasSemTaxa) {
    const valorFmt = Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    resposta.innerHTML = `
        <p class="comtaxa">Você deve cobrar ${valorComTaxa} reais para receber ${valorFmt} reais.</p>
        <p class="comtaxa">Em ${parcelas} parcelas de ${parcelasComTaxa} reais (com taxas).</p>
        <p class="semtaxa">Você receberá ${valorSemtaxa} reais, divididos em ${parcelas} parcelas de ${parcelasSemTaxa} reais (sem taxas).</p>
        <p>Taxa de ${taxa}%</p>
    `;
}