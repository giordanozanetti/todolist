class Tarefa {  
  constructor(nome, data_limite, prioridade) {
    this.nome = nome;
    this.data_limite = data_limite;
    this.prioridade = prioridade;
    this.concluida = false;
    switch (this.prioridade) {
      case "0":
        this.prioridade_mostra = "Baixa"
        this.prioridade_classe = "prioridade-baixa"
        break;
      case "1":
        this.prioridade_mostra = "Média"
        this.prioridade_classe = "prioridade-media"
        break;
      case "2":
        this.prioridade_mostra = "Alta"
        this.prioridade_classe = "prioridade-alta"
    }
  }
}

class Lista {
  constructor(){
    const dadosSalvos = JSON.parse(localStorage.getItem('tarefas'));
    if (dadosSalvos) {
      this.tarefas = dadosSalvos;
      this.mostra();
    } else {
      this.tarefas = [];
    }
    document.querySelector("#btnAdicionar").addEventListener("click", (event) => {
      this.insere();
    });
    document.querySelector("#ordem").addEventListener("change", (event) => {
      this.mostra();
    });
  }
  
  mostra(){
    if(document.querySelector("#ordem").value == "prioridade") { 
      this.tarefas.sort((a, b) => {
        if (a.concluida && !b.concluida) return 1;
        if (!a.concluida && b.concluida) return -1;
        return parseInt(b.prioridade) - parseInt(a.prioridade);
      });
      
    } else {  
      this.tarefas.sort((a, b) => {
        if (a.concluida && !b.concluida) return 1;
        if (!a.concluida && b.concluida) return -1;
        return new Date(a.data_limite) - new Date(b.data_limite);
      });
    }
    
    let valor = `
      <input type='button' value='Limpar todas as tarefas' id='limpar' class='btn btn-limpar'>
      <table class='tabela-tarefas'>
        <caption>Tarefas</caption>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data limite</th>
            <th>Prioridade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>`;
    
    for (let i = 0; i < this.tarefas.length; i++) {
      let classe_linha = this.tarefas[i].concluida ? "tarefa-concluida" : "";
      let texto_botao = this.tarefas[i].concluida ? "Desfazer" : "Concluir";
      valor += `
        <tr class="${classe_linha}">
          <td>${this.tarefas[i].nome}</td>
          <td>${this.tarefas[i].data_limite.slice(8, 10) + "/" + this.tarefas[i].data_limite.slice(5, 7) + "/" + this.tarefas[i].data_limite.slice(0, 4)}</td>
          <td><span class="${this.tarefas[i].prioridade_classe}">${this.tarefas[i].prioridade_mostra}</span></td>
          <td>
            <input type='button' value='${texto_botao}' id='btnConcluir${i}' class='btn btn-concluir'>
            <input type='button' value='Excluir' id='btnExcluir${i}' class='btn btn-excluir'>
          </td>
        </tr>`;
    }
    
    valor += `</tbody></table>`;
    document.querySelector("#lista").innerHTML = valor;
    
    document.querySelector("#limpar").addEventListener("click", () => {
      localStorage.clear();
      location.reload();
    });
    
    for (let i = 0; i < this.tarefas.length; i++) {
      document.querySelector("#btnConcluir"+i).addEventListener("click", () => {
        this.concluir(i);
      });
      document.querySelector("#btnExcluir"+i).addEventListener("click", () => {
        this.excluir(i);
      });
    }
    
    localStorage.setItem('tarefas', JSON.stringify(this.tarefas));   
    console.log(JSON.parse(localStorage.getItem('tarefas')));
  }
  
  insere(){
    if (document.querySelector("#nome_tarefa").value != "" && 
        document.querySelector("#data_tarefa").value != "" && 
        document.querySelector("#prioridade_tarefa").value != "") {
      let tarefa1 = new Tarefa(
        document.querySelector("#nome_tarefa").value,
        document.querySelector("#data_tarefa").value, 
        document.querySelector("#prioridade_tarefa").value
      )
      this.tarefas.push(tarefa1); 
      this.mostra();
      document.querySelector("#nome_tarefa").value = "";
      document.querySelector("#data_tarefa").value = "";
      document.querySelector("#prioridade_tarefa").value = "";
      this.esconderErro();
    } else {
      this.mostrarErro();
    }
  }
  
  mostrarErro() {
    const mensagemErro = document.querySelector("#mensagem-erro");
    mensagemErro.textContent = "⚠️ Você precisa preencher todos os campos!";
    mensagemErro.style.display = "block";
  }
  
  esconderErro() {
    const mensagemErro = document.querySelector("#mensagem-erro");
    mensagemErro.style.display = "none";
  }
  
  concluir(num){
    this.tarefas[num].concluida = !this.tarefas[num].concluida;
    this.mostra();
  }
  
  excluir(num){
    this.tarefas.splice(num, 1);
    this.mostra();
  }
}

let lista1 = new Lista();