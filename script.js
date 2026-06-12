async function analisar() {

    const texto = document.getElementById("texto").value;
    const resultado = document.getElementById("resultado");
    const historico = document.getElementById("listaHistorico");

    if (texto.trim() === "") {

        resultado.style.display = "block";
        resultado.className = "alerta";

        resultado.innerHTML =
            "⚠️ Digite uma mensagem ou cole um link.";

        return;
    }

    resultado.style.display = "block";
    resultado.className = "alerta";
    resultado.innerHTML = "🔍 Analisando com IA...";

    try {

        const resposta = await fetch(
            "http://localhost:3000/analisar",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    texto: texto
                })
            }
        );

        const dados = await resposta.json();

        resultado.className = "sucesso";

        resultado.innerHTML =
            dados.resposta.replace(/\n/g, "<br>");

        adicionarHistorico(
            texto,
            historico
        );

    } catch (erro) {

        resultado.className = "perigo";

        resultado.innerHTML =
            "❌ Erro ao analisar a informação.";

        console.error(erro);
    }
}

function adicionarHistorico(texto, historico) {

    if (
        historico.children.length === 1 &&
        historico.children[0].textContent ===
        "Nenhuma verificação realizada."
    ) {
        historico.innerHTML = "";
    }

    const item = document.createElement("li");

    item.textContent =
        texto.substring(0, 50) + "...";

    historico.prepend(item);

    if (historico.children.length > 5) {

        historico.removeChild(
            historico.lastChild
        );

    }
}