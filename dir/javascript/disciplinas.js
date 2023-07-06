$(document).ready(function () {
  $(".js-example-basic-multiple").select2();
});

const DOMStrings = {
  selectProfessores: "#professores",
  btnCadastar: "#cadastrar",
  inputDisciplina: "#disciplina",
  tblDisciplinas: "#tabela-disciplinas",
};

const insertDataOnSelectProfessores = () => {
  const professores = DATABASE.getProfessores();
  if (!professores) return;
  // ordenar professores por nome
  professores.sort((a, b) => {
    if (a.nome < b.nome) return -1;
    if (a.nome > b.nome) return 1;
    return 0;
  });

  const select = document.querySelector(DOMStrings.selectProfessores);
  select.innerHTML = "";
  professores.forEach((professor) => {
    select.innerHTML += `
                <option value="${professor.id}">${professor.nome}</option>
            `;
  });
};

const atualizarTabelaDisciplinas = () => {
  const disciplinas = DATABASE.getDisciplinas();
  if (!disciplinas) return;
  const table = document.querySelector(DOMStrings.tblDisciplinas);
  table.innerHTML = "";
  disciplinas.forEach((disciplina) => {
    table.innerHTML += `
                <tr>
                    <td>${disciplina.disciplina}</td>
                    <td>${disciplina.professores
                      .map((professor) => professor.nome)
                      .join(", ")}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="removerDisciplina(${
                          disciplina.id
                        })">
                            REMOVER
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="editarDisciplina(${
                          disciplina.id
                        })">
                            EDITAR
                        </button>
                    </td>
                </tr>
            `;
  });
};

const cadastarDisciplina = () => {
  if (
    document.querySelector(DOMStrings.btnCadastar).dataset.action !== "create"
  )
    return;

  const nome = document
    .querySelector(DOMStrings.inputDisciplina)
    .value.toUpperCase();

  if (nome == "") return alert("Selecione um professor!");

  if (document.querySelector(DOMStrings.inputDisciplina).value == "")
    return alert("Preencha o campo disciplina!");

  const professoresID = Array.from(
    document.querySelector(DOMStrings.selectProfessores).selectedOptions
  ).map((e) => ({ id: e.value, nome: e.text }));

  const disciplina = {
    disciplina: nome,
    id: Date.now(),
    professores: professoresID,
  };

  /** verificar se o nome da disciplina já está cadastrada  */
  const disciplinas = DATABASE.getDisciplinas();

  if (disciplinas) {
    const disciplinaExistente = disciplinas.find(
      (d) => d.disciplina == disciplina.disciplina
    );

    if (disciplinaExistente) {
      console.log("Adicionar novo professor");
      const professores = disciplinaExistente.professores;

      const professoresNovos = disciplina.professores.filter(
        (professor) => !professores.find((p) => p.id == professor.id)
      );
      if (professoresNovos.length == 0)
        return alert("Todos os professores já foram adicionados!");

      disciplina.professores = [...professores, ...professoresNovos];
      disciplina.id = disciplinaExistente.id;

      DATABASE.deteleDisciplina(disciplinaExistente.id, false);
      DATABASE.setDisciplina(disciplina);
      atualizarTabelaDisciplinas();
      return;
    }
  }

  DATABASE.setDisciplina(disciplina);
  atualizarTabelaDisciplinas();
  document.querySelector(DOMStrings.inputDisciplina).value = "";
  $("select").val("").select2();
};

const removerDisciplina = (id) => {
  if (!confirm("Deseja remover a disciplina?")) return;
  DATABASE.deteleDisciplina(id, true);
  atualizarTabelaDisciplinas();
};

const editarDisciplina = (id) => {
  document.querySelector(DOMStrings.btnCadastar).dataset.action = "edit";
  const disciplina = DATABASE.getDisciplinaById(id);
  if (!disciplina) return;

  document.querySelector(DOMStrings.inputDisciplina).value =
    disciplina.disciplina;
  const professores = disciplina.professores.map((e) => e.id);

  $("select").val(professores).select2();

  document.querySelector(DOMStrings.btnCadastar).dataset.id = id;
};

const atualizarDisciplina = (e) => {
  if (document.querySelector(DOMStrings.btnCadastar).dataset.action !== "edit")
    return;

  const id = e.target.dataset.id;

  DATABASE.deteleDisciplina(id, true);

  DATABASE.setDisciplina({
    disciplina: document.querySelector(DOMStrings.inputDisciplina).value,
    id: id,
    professores: Array.from(
      document.querySelector(DOMStrings.selectProfessores).selectedOptions
    ).map((e) => ({ id: e.value, nome: e.text })),
  });

  atualizarTabelaDisciplinas();
  document.querySelector(DOMStrings.btnCadastar).dataset.action = "create";
  document.querySelector(DOMStrings.btnCadastar).dataset.id = "";
  document.querySelector(DOMStrings.inputDisciplina).value = "";
  $("select").val("").select2();
};

const setupEventListeners = () => {
  document
    .querySelector(DOMStrings.btnCadastar)
    .addEventListener("click", cadastarDisciplina);
  document
    .querySelector(DOMStrings.btnCadastar)
    .addEventListener("click", atualizarDisciplina);
};

const init = (() => {
  insertDataOnSelectProfessores();
  atualizarTabelaDisciplinas();
  setupEventListeners();
})();
