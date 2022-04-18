let usuario = '';

function logar(){
    usuario = document.querySelector('.login input').value;
    corpo = {
        name: usuario
    }

    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', corpo);
    promise.then(continuarOnline);
    promise.catch(erroEntrada);
    recebeMensagens();
    esconderLogin();
}

function logarComEnter(evento){
    let keydown = evento.key;
    if(keydown === "Enter"){
        logar();
    }
}

function esconderLogin(){
    const login = document.querySelector(".login");
    const topo = document.querySelector(".topo");
    const container = document.querySelector(".container");
    const rodape = document.querySelector(".rodape");

    login.classList.add("escondido");
    topo.classList.remove("escondido");
    container.classList.remove("escondido");
    rodape.classList.remove("escondido");
}

function mostrarLogin(){
    const login = document.querySelector(".login");
    const topo = document.querySelector(".topo");
    const container = document.querySelector(".container");
    const rodape = document.querySelector(".rodape");

    login.classList.remove("escondido");
    topo.classList.add("escondido");
    container.classList.add("escondido");
    rodape.classList.add("escondido");
}

function enviarComEnter(evento){
    let keydown = evento.key;
    if(keydown === "Enter"){
        enviarMensagem();
    }
}

function enviarMensagem(){
    const input = document.querySelector(".rodape input");
    let texto = input.value;
    let mensagemEnviar = {
        from: usuario,
        to: "Todos",
        text: texto,
        type: "message" 
    }

    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemEnviar);
    promise.then(recebeMensagens);
    promise.catch(erroEnvio);
    input.value = "";
}

function continuarOnline(){
    setInterval(ManterConexao, 5000);
    setInterval(recebeMensagens, 3000);
}

function recebeMensagens(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(mensagemRecebida);
}

function ManterConexao(){
    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', corpo);
    promise.then(function(){

    });
}

function mensagemRecebida(resposta){
    const mensagem = document.querySelector(".container");
    let mensagens = resposta.data;

    mensagem.innerHTML = "";
    for (let i = 0; i < mensagens.length; i++){
        if (mensagens[i].type === "status"){
            mensagem.innerHTML += `
            <div class="mensagem status">
                <p>
                    <span>(${mensagens[i].time})</span>&nbsp;<strong>${mensagens[i].from}</strong>&nbsp;${mensagens[i].text}
                </p>
            </div>`
        }
        else if (mensagens[i].type === "message"){
            mensagem.innerHTML += `
            <div class="mensagem">
                <p>
                    <span>(${mensagens[i].time})</span>&nbsp;<strong>${mensagens[i].from}</strong> para <strong>${mensagens[i].to}</strong>:&nbsp;${mensagens[i].text}
                </p>
            </div>`
        }
        else if (mensagens[i].type === "private_message"){
            mensagem.innerHTML += `
            <div class="mensagem private-message">
                <p>
                    <span>(${mensagens[i].time})</span>&nbsp;<strong>${mensagens[i].from}</strong>&nbsp;reservadamente para <strong>${mensagens[i].to}</strong>:&nbsp;${mensagens[i].text}
                </p>
            </div>`
        }
    }
    mensagem.lastChild.scrollIntoView();
}

function erroEntrada(erro){
    console.log("Status code: " + erro.response.status);
	console.log("Mensagem de erro: " + erro.response.data);
    alert("O nome digitado já está em uso, escolha outro nome");
    window.location.reload();
}

function erroEnvio(erro){
    console.log("Status code: " + erro.response.status);
	console.log("Mensagem de erro: " + erro.response.data);
    alert("Seu usuário não está mais conectado");
    window.location.reload();
}
