(() => {
  const DOMStrings = {
    selectProfessor: "#professores",
    titleProfessor: ".nome-professor",
    tableHorario: ".horario",
  };
  // carregar lista de professores
  const carregarListaProfessores = () => {
    const professores = DATABASE.getProfessores();

    if (!professores) return;

    // ordenar professores por nome
    professores.sort((a, b) => {
      if (a.nome < b.nome) return -1;
      if (a.nome > b.nome) return 1;
      return 0;
    });

    const select = document.querySelector(DOMStrings.selectProfessor);
    select.innerHTML = "";
    // adicionar opção padrão
    const option = document.createElement("option");
    option.value = "";
    option.innerText = "Selecione um professor";
    select.appendChild(option);

    professores.forEach((professor) => {
      const option = document.createElement("option");
      option.value = professor.id;
      option.innerText = professor.nome;
      select.appendChild(option);
    });
  };

  const atualizarHorario = (idProfessor) => {
    if (!idProfessor) return;

    const horario = DATABASE.getHorario();
    const DOMHorario = document.querySelectorAll(DOMStrings.tableHorario);
    const horarioDOM = [...DOMHorario].filter((_, i) => i % 2 == 1);
    const turmaDOM = [...DOMHorario].filter((_, i) => i % 2 == 0);

    const horarioProfessor = horario.map((col) =>
      col.map((row) => row.filter((e) => e.id_professor == idProfessor))
    );

    horarioProfessor.forEach((c, ci) => {
      c.forEach((r, ri) => {
        if (r.length == 0) {
          horarioDOM[ci + ri * 5].innerHTML = "";
          turmaDOM[ci + ri * 5].innerHTML = "";
          return;
        }

        horarioDOM[ci + ri * 5].innerHTML = "";
        turmaDOM[ci + ri * 5].innerHTML = "";

        const disciplina = document.createElement("span");
        disciplina.classList.add("disciplina");
        disciplina.innerText = r[0].disciplina;
        horarioDOM[ci + ri * 5].appendChild(disciplina);

        const professor = document.createElement("span");
        professor.classList.add("professor");

        if (r.length > 1) {
          professor.innerText =
            "(" + r.map((e) => e.professor).join(", ") + ")";
        } else if (r.length == 1) {
          professor.innerText = "(" + r[0].professor + ")";
        }

        horarioDOM[ci + ri * 5].appendChild(professor);

        const turma = document.createElement("span");
        turma.classList.add("turma");
        turma.innerText = r[0].turma;
        turmaDOM[ci + ri * 5].appendChild(turma);
      });
    });

    console.log(horarioProfessor);
  };

  const setupEventListeners = () => {
    document
      .querySelector(DOMStrings.selectProfessor)
      .addEventListener("change", (e) => {
        atualizarHorario(e.target.value);

        const titleProfessor = document.querySelector(
          DOMStrings.titleProfessor
        );

        if (e.target.value == "") {
          titleProfessor.textContent = "";
          return;
        }
        titleProfessor.textContent =
          e.target.options[e.target.selectedIndex].text;
      });
  };

  const init = (() => {
    carregarListaProfessores();
    setupEventListeners();
  })();
})();
