"use strict";
(() => {
  const DOMStrings = {
    inputNome: "#nome",
    btnCadastrar: "#cadastrar",
    btnEditar: ".btn-editar",
    btnRemover: ".btn-remover",
    tblProfessores: "#tbl-professores",
  };

  /** CADASTRAR PROFESSOR */
  /**
   * 1. Pegar os dados do formulário
   * 2. Validar os dados
   * 3. Cadastrar o professor
   * 4. Atualizar a tabela
   * 5. Limpar o formulário
   * 6. Focar no campo nome
   * 7. Exibir mensagem de sucesso
   * 8. Exibir mensagem de erro
   */

  const limparFormulario = () => {
    document.querySelector(DOMStrings.inputNome).value = "";
    document.querySelector(DOMStrings.inputNome).focus();
  };

  const atualizarTabelaProfessores = () => {
    const professores = DATABASE.getProfessores();

    const tabela = document.querySelector("#tabela-professores");
    tabela.innerHTML = "";

    if (!professores) return;

    professores.forEach((professor) => {
      tabela.innerHTML += `
                <tr>
                    <td>${professor.nome}</td>
                    <td>${professor.id}</td>
                    <td><button class="btn btn-danger m-1 btn-remover" data-id="${professor.id}">REMOVER</button></td>
                </tr>
            `;
    });
  };

  const cadastrarProfessor = () => {
    const nome = document
      .querySelector(DOMStrings.inputNome)
      .value.toUpperCase();

    if (nome == "") return alert("Preencha o campo nome!");

    const professor = {
      id: Date.now(),
      nome,
    };

    // Verificar se o nome já existe
    if (
      DATABASE.getProfessores() &&
      DATABASE.getProfessores().some((e) => e.nome == professor.nome)
    )
      return alert("Professor já cadastrado!");

    DATABASE.setProfessor(professor);

    atualizarTabelaProfessores();

    limparFormulario();
  };

  const removerProfessor = (id) => {
    DATABASE.deleteProfessor(id);
    // DATABASE.deleteHorarioByProfessor(id);
    // DATABASE.deleteDisciplinaByProfessor(id);
    // DATABASE.deleteHorarioIndividual(id);
    console.log(id);
    atualizarTabelaProfessores();
  };

  const setupEventListeners = () => {
    document
      .querySelector(DOMStrings.btnCadastrar)
      .addEventListener("click", cadastrarProfessor);
    document
      .querySelector(DOMStrings.tblProfessores)
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-remover")) {
          removerProfessor(e.target.dataset.id);
        }
      });
  };

  const init = (() => {
    atualizarTabelaProfessores();
    setupEventListeners();
  })();
})();
