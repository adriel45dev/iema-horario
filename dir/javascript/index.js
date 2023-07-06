(() => {
  const DOMStrings = {
    selectTurma: "#turma",
    selectProfessor: "#professor",
    selectDisciplina: "#disciplina",
    tableHorario: "#horario",
    btnAdicionar: "#adicionar",
    btnRemover: "#remover",
    btnApagar: "#apagar",
    btnApagarTudo: "#apagar-tudo",
    btnBaixar: "#baixar",
    btnExcel: "#baixar-excel",
    titleTurma: ".turma",
  };

  const INSTITUCIONAL = [{ id: -1, nome: "INSTITUCIONAL" }];
  const DISCIPLINAS_INSTITUCIONAIS = [
    {
      id: -1,
      disciplina: "TAM",
      professores: INSTITUCIONAL,
      color: "#F7CAAC",
    },
    {
      id: -2,
      disciplina: "AVALIAÇÃO",
      professores: INSTITUCIONAL,
      color: "#F7CAAC",
    },
    {
      id: -3,
      disciplina: "ELETIVA",
      professores: INSTITUCIONAL,
      color: "#F7CAAC",
    },
    {
      id: -4,
      disciplina: "TUTORIA",
      professores: INSTITUCIONAL,
      color: "#F7CAAC",
    },
  ];

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

    professores.push(...INSTITUCIONAL);

    const select = document.querySelector(DOMStrings.selectProfessor);
    select.innerHTML = "";
    // adicionar opção padrão
    const option = document.createElement("option");
    option.value = "0";
    option.innerText = "Selecione um professor";
    select.appendChild(option);

    professores.forEach((professor) => {
      const option = document.createElement("option");
      option.value = professor.id;
      option.innerText = professor.nome;
      select.appendChild(option);
    });
  };

  // carregar lista de disciplinas
  const carregarListaDisciplinas = () => {
    const disciplinas = DATABASE.getDisciplinas();
    if (!disciplinas) return;

    // ordenar disciplinas por nome
    disciplinas.sort((a, b) => {
      if (a.disciplina < b.disciplina) return -1;
      if (a.disciplina > b.disciplina) return 1;
      return 0;
    });

    const select = document.querySelector(DOMStrings.selectDisciplina);
    select.innerHTML = "";
    // adicionar opção padrão
    const option = document.createElement("option");
    option.value = "0";
    option.innerText = "Selecione uma disciplina";
    select.appendChild(option);

    disciplinas.forEach((disciplina) => {
      const option = document.createElement("option");
      option.value = disciplina.id;
      option.innerText = disciplina.disciplina;
      select.appendChild(option);
    });
  };

  // exibir disciplinas relacionadas ao professor
  const exibirDisciplinas = (idProfessor) => {
    if (!idProfessor) {
      carregarListaDisciplinas();
      carregarListaProfessores();
      return;
    }

    // if (
    //   document.querySelector(DOMStrings.selectDisciplina).selectedOptions[0]
    //     .value != ""
    // )
    //   return;

    const disciplinas = DATABASE.getDisciplinas();

    const select = document.querySelector(DOMStrings.selectDisciplina);
    select.innerHTML = "";

    // adicionar opção padrão
    const option = document.createElement("option");
    option.value = "0";
    option.innerText = "Selecione uma disciplina";
    select.appendChild(option);

    if (!disciplinas) return;

    if (idProfessor == -1) disciplinas.push(...DISCIPLINAS_INSTITUCIONAIS);

    disciplinas.forEach((disciplina) => {
      // verificar se o professor está relacionado a disciplina
      const professor = disciplina.professores.find(
        (professor) => professor.id == idProfessor
      );
      if (professor) {
        const option = document.createElement("option");
        option.value = disciplina.id;
        option.innerText = disciplina.disciplina;
        select.appendChild(option);
      }
    });
  };

  const marcarHorariosOcupados = (idProfessor) => {
    document.querySelectorAll(".ocupado")?.forEach((e) => {
      e.classList.remove("ocupado");
    });
    const horario = DATABASE.getHorario();
    const DOMhorario = document.querySelectorAll(".horario");

    horario.forEach((c, ci) => {
      c.forEach((r, ri) => {
        r.filter((e) => e.id_professor == idProfessor).forEach((e) => {
          DOMhorario[ci + ri * 5].classList.add("ocupado");
        });
      });
    });
  };

  // exibir horário
  const atualizarHorario = () => {
    document.querySelectorAll(".ocupado")?.forEach((e) => {
      e.classList.remove("ocupado");
    });

    if (document.querySelector(DOMStrings.selectProfessor).value != "") {
      marcarHorariosOcupados(
        document.querySelector(DOMStrings.selectProfessor).value
      );
    }

    const turma = document.querySelector(DOMStrings.selectTurma).value;
    const horario = DATABASE.getHorario();
    const DOMhorario = document.querySelectorAll(".horario");

    const horarioTurma = horario.map((c) =>
      c.map((r) => r.filter((e) => e.turma == turma))
    );

    if (!horarioTurma) return;

    horarioTurma.forEach((c, ci) => {
      c.forEach((r, ri) => {
        if (r.length == 0) {
          DOMhorario[ci + ri * 5].innerHTML = "";
          return;
        }

        DOMhorario[ci + ri * 5].innerHTML = "";

        const disciplina = document.createElement("span");
        disciplina.classList.add("disciplina");
        disciplina.innerText = r[0].disciplina;
        DOMhorario[ci + ri * 5].appendChild(disciplina);

        const professor = document.createElement("span");
        professor.classList.add("professor");

        if (r.length > 1) {
          professor.innerText =
            "(" + r.map((e) => e.professor).join(", ") + ")";
        } else if (r.length == 1) {
          professor.innerText = "(" + r[0].professor + ")";
        }

        DOMhorario[ci + ri * 5].appendChild(professor);
      });
    });
  };

  const cadastrarHorario = (col, row) => {
    if (document.querySelector(DOMStrings.btnRemover).checked) return;
    const professor = document.querySelector(DOMStrings.selectProfessor);
    const disciplina = document.querySelector(DOMStrings.selectDisciplina);

    if (professor.value == 0 || disciplina.value == 0) {
      alert("Selecione um professor e uma disciplina");
      return;
    }

    const horario = {
      id_professor: professor.value,
      professor: professor.selectedOptions[0].innerText,
      disciplina: disciplina.selectedOptions[0].innerText,
      id_disciplina: disciplina.value,
      turma: document.querySelector(DOMStrings.selectTurma).value,
    };

    const btnAdicionar = document.querySelector(DOMStrings.btnAdicionar);

    if (professor.value == -1 && btnAdicionar.checked) {
      const turmas = [
        101, 102, 103, 104, 201, 202, 203, 204, 301, 302, 303, 304,
      ];

      turmas.forEach((t) => {
        DATABASE.setHorario(col, row, { ...horario, turma: t }, true);
      });

      atualizarHorario();
      return;
    }

    if (professor.value == -1 && !btnAdicionar.checked) {
      DATABASE.setHorario(col, row, horario, true);
      atualizarHorario();
      return;
    }

    // verificar se o professor já está cadastrado no horário
    const horarioAtual = DATABASE.getHorario()[col][row];

    if (horarioAtual.length > 0) {
      const professor = horarioAtual.find(
        (h) => h.id_professor == horario.id_professor
      );

      if (professor != undefined && professor.turma != horario.turma) {
        alert("Professor já alocado nesse horário");
        return;
      } else if (
        professor != undefined &&
        professor.disciplina == horario.disciplina
      ) {
        alert("Disciplina já cadastrada");
        return;
      }
    }

    // verficar se no mesmo horário já existe uma disciplina cadastrada
    const horarioAtualTurma = horarioAtual.filter(
      (h) => h.turma == horario.turma
    );

    let action = false;
    if (
      horarioAtualTurma.length > 0 &&
      horarioAtualTurma[0].id_disciplina != horario.id_disciplina
    ) {
      action = confirm("Deseja substituir a disciplina?");
      if (!action) return;
    }

    // se action == true, substituir disciplina
    DATABASE.setHorario(col, row, horario, action);
    atualizarHorario();
  };

  const removerHorario = (col, row) => {
    if (!document.querySelector(DOMStrings.btnRemover).checked) return;
    if (!confirm("Deseja remover a disciplina?")) return;

    DATABASE.deleteHorario(
      col,
      row,
      document.querySelector(DOMStrings.selectTurma).value
    );
    atualizarHorario();
  };

  const apagarHorario = () => {
    if (!confirm("Deseja apagar todos os horários?")) return;
    DATABASE.limparHorario();
    atualizarHorario();
  };

  const apagarHorarioTurma = () => {
    if (!confirm("Deseja apagar o horário da turma?")) return;

    for (let ci = 0; ci < 5; ci++) {
      for (let ri = 0; ri < 9; ri++) {
        DATABASE.deleteHorario(
          ci,
          ri,
          document.querySelector(DOMStrings.selectTurma).value
        );
      }
    }

    atualizarHorario();
  };

  function exportTableToExcel(tableId, filename) {
    const table = document.getElementById(tableId);

    // Create a worksheet from the table data
    const worksheet = XLSX.utils.table_to_sheet(table);

    // Set cell background color (Example: red)
    const redCellStyle = { fill: { bgColor: { rgb: "FF0000FF" } } };

    // Iterate over each cell in the worksheet and apply the cell style
    for (const cellAddress in worksheet) {
      if (!worksheet.hasOwnProperty(cellAddress)) continue;
      const cell = worksheet[cellAddress];
      cell.s = redCellStyle;
    }

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    // Convert the workbook to Excel format and initiate the file download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xls",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/vnd.ms-excel" });

    // Create a temporary link element to initiate the file download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(data);
    link.download = `${filename}.xls`;
    link.click();
  }

  const setupEventListeners = () => {
    document
      .querySelector(DOMStrings.selectProfessor)
      .addEventListener("change", (e) => {
        const idProfessor = e.target.value;
        exibirDisciplinas(idProfessor);
        marcarHorariosOcupados(idProfessor);
      });

    document.querySelectorAll(".horario").forEach((e, i) => {
      e.addEventListener("click", (e) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        cadastrarHorario(col, row);
        removerHorario(col, row);
      });
    });

    // atualizar horário na mudança de turma
    document
      .querySelector(DOMStrings.selectTurma)
      .addEventListener("change", (e) => {
        atualizarHorario();

        // mudar nome da turma
        document.querySelector(DOMStrings.titleTurma).innerText =
          e.target.selectedOptions[0].dataset.curso;
      });

    // apagar horário
    document
      .querySelector(DOMStrings.btnApagar)
      .addEventListener("click", () => {
        apagarHorarioTurma();
      });
    // apagar horário da turma
    document
      .querySelector(DOMStrings.btnApagarTudo)
      .addEventListener("click", () => {
        apagarHorario();
      });

    document
      .querySelector(DOMStrings.btnExcel)
      .addEventListener("click", () => {
        exportTableToExcel(
          "horario",
          "horario-" + document.querySelector(DOMStrings.selectTurma).value
        );
      });
  };

  const init = (() => {
    carregarListaProfessores();
    carregarListaDisciplinas();
    setupEventListeners();
    atualizarHorario();

    document.querySelector(DOMStrings.titleTurma).innerText =
      document.querySelector(
        DOMStrings.selectTurma
      ).selectedOptions[0].dataset.curso;
  })();
})();

// exportTableToExcel("horario");
