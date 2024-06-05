if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js');
    });
}

let resposta = document.getElementById("res");
  function checar() {
    resposta.innerHTML = ""
    if (document.getElementById("creditoParcelado").checked) {
      document.getElementById("paragrafo").style.display = "block";
    } else {
      document.getElementById("paragrafo").style.display = "none";
    }
  }

  function calcular() {
    let valorCompra = document.getElementById("valorCompra");
    let taxa = 0;
    let valorSemtaxa = 0;
    let valorComTaxa = 0;
    let select = document.getElementById("select");
    if (valorCompra.value.length == 0 || valorCompra.value == 0 || valorCompra.value < 0 || isNaN(valorCompra.value)) {
      window.alert("por favor digite valor válido da compra")
      resposta.innerHTML = ""
      return;
    }
    if (document.getElementById("debito").checked) {
      valorSemtaxa = valorCompra.value * (1 - 2.39 / 100);
      valorSemtaxa = valorSemtaxa.toFixed(2);
      valorComTaxa = (valorCompra.value * 100) / (100 - 2.39);
      valorComTaxa = valorComTaxa.toFixed(2);
      respostaVista()
    } else if (document.getElementById("creditoVista").checked) {
      valorSemtaxa = valorCompra.value * (1 - 4.99 / 100);
      valorSemtaxa = valorSemtaxa.toFixed(2);
      valorComTaxa = (valorCompra.value * 100) / (100 - 4.99);
      valorComTaxa = valorComTaxa.toFixed(2);
      respostaVista()
    } else if (document.getElementById("creditoParcelado").checked) {
      optionSelecionado = select.value;
      switch (optionSelecionado) {
        case "2":
          taxa = 9.9
          calcularParcelado()
          break;
        case "3":
          taxa = 11.29
          calcularParcelado()
          break;
        case "4":
          taxa = 12.64
          calcularParcelado()
          break;
        case "5":
          taxa = 13.97
          calcularParcelado()
          break;
        case "6":
          taxa = 15.27
          calcularParcelado()
          break;
        case "7":
          taxa = 16.55
          calcularParcelado()
          break;
        case "8":
          taxa = 17.81
          calcularParcelado()
          break;
        case "9":
          taxa = 19.04
          calcularParcelado()
          break;
        case "10":
          taxa = 20.24
          calcularParcelado()
          break;
        case "11":
          taxa = 21.43
          calcularParcelado()
          break;
        case "12":
          taxa = 22.59
          calcularParcelado()
          break;
      }
    }
    function respostaVista() {
      resposta.innerHTML = ``
      resposta.innerHTML = `<p class = "comtaxa">Você deve cobrar ${valorComTaxa} reais para receber ${valorCompra.value} reais.</p>`
      resposta.innerHTML += `<p class = "semtaxa">Cobrar ${valorCompra.value} reais você vai receber apenas ${valorSemtaxa} reais.</p>`
      if (document.getElementById("debito").checked) {
        resposta.innerHTML += `<p>taxa no debito é : 2,39%</p>`
      } else if (document.getElementById("creditoVista").checked) {
        resposta.innerHTML += `<p>taxa no crédito é : 4,99%</p>`
      }
    }

    function calcularParcelado() {
      valorComTaxa = (valorCompra.value * 100) / (100 - taxa);
      valorComTaxa = valorComTaxa.toFixed(2);
      let parcelasComTaxa = valorComTaxa / optionSelecionado;
      parcelasComTaxa = parcelasComTaxa.toFixed(2);
      valorSemtaxa = valorCompra.value * (1 - taxa / 100);
      valorSemtaxa = valorSemtaxa.toFixed(2);
      let parcelasSemTaxa = valorCompra.value / optionSelecionado;
      parcelasSemTaxa = parcelasSemTaxa.toFixed(2);
      resposta.innerHTML = ``
      resposta.innerHTML = `<p class = "comtaxa">Você deve cobrar ${valorComTaxa} reais para receber ${valorCompra.value} reais.</p>`
      resposta.innerHTML += `<p class = "comtaxa">em ${optionSelecionado} parcelas de ${parcelasComTaxa} reais</p>`
      resposta.innerHTML += `<p class = "semtaxa">Cobrar ${valorCompra.value} reais você só vai receber apenas ${valorSemtaxa} reais</p>`
      resposta.innerHTML += `<p class = "semtaxa">em ${optionSelecionado} parcelas de ${parcelasSemTaxa} reais <strong>sem taxas</strong</p>`
      resposta.innerHTML += `<p>taxa de ${taxa}%.</p>`
    }

  }

  function limpaResposta() {
    resposta.innerHTML = "";
  }