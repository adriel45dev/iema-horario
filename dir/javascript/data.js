const DATABASE = (() => {
  const getProfessores = () => {
    let dataJSON = localStorage.getItem("data__professores");
    let data = false;
    if (dataJSON != null) data = JSON.parse(dataJSON);
    return data;
  };

  const setProfessor = (professor) => {
    // const professor = {id: 1, nome: "João"}
    let dataJSON = localStorage.getItem("data__professores");
    let data = [];
    if (dataJSON != null) data = JSON.parse(dataJSON);
    data.push(professor);
    dataJSON = JSON.stringify(data);
    localStorage.setItem("data__professores", dataJSON);
  };

  const getDisciplinas = () => {
    let dataJSON = localStorage.getItem("data__disciplinas");
    let data = false;
    if (dataJSON != null) data = JSON.parse(dataJSON);
    return data;
  };

  const deleteProfessor = (id) => {
    let dataJSON = localStorage.getItem("data__professores");
    let data = [];
    if (dataJSON != null) data = JSON.parse(dataJSON);
    data = data.filter((e) => e.id != id);
    dataJSON = JSON.stringify(data);
    localStorage.setItem("data__professores", dataJSON);

    /** REMOVER PROFESSOR DOS HORARIOS */
    const horarios = getHorario();
    const horariosAtualizados = horarios.map((col) =>
      col.map((row) => row.filter((e) => e.id_professor != id))
    );
    dataJSON = JSON.stringify(horariosAtualizados);
    localStorage.setItem("data__horario", dataJSON);

    // /** REMOVER PROFESSOR DAS DISCIPLINAS */
    const disciplinas = getDisciplinas();
    const disciplinasAtualizadas = disciplinas.map((disciplina) => {
      disciplina.professores = disciplina.professores.filter((e) => e.id != id);
      return disciplina;
    });
    // set disciplinasAtualizadas
    dataJSON = JSON.stringify(disciplinasAtualizadas);
    localStorage.setItem("data__disciplinas", dataJSON);
  };

  const setDisciplina = (disciplina) => {
    console.log("setDisciplina", disciplina);
    let dataJSON = localStorage.getItem("data__disciplinas");
    let data = [];
    if (dataJSON != null) data = JSON.parse(dataJSON);
    data.push(disciplina);
    dataJSON = JSON.stringify(data);
    localStorage.setItem("data__disciplinas", dataJSON);
  };

  const deteleDisciplina = (id, action) => {
    let dataJSON = localStorage.getItem("data__disciplinas");
    let data = [];
    if (dataJSON != null) data = JSON.parse(dataJSON);
    data = data.filter((e) => e.id != id);
    dataJSON = JSON.stringify(data);
    localStorage.setItem("data__disciplinas", dataJSON);

    if (!action) return;

    /** REMOVER DISCIPLINA DOS HORARIOS */
    const horarios = getHorario();
    const horariosAtualizados = horarios.map((col) =>
      col.map((row) => row.filter((e) => e.id_disciplina != id))
    );
    dataJSON = JSON.stringify(horariosAtualizados);
    localStorage.setItem("data__horario", dataJSON);
  };

  const getDisciplinaById = (id) => {
    let dataJSON = localStorage.getItem("data__disciplinas");
    let data = [];
    if (dataJSON != null) data = JSON.parse(dataJSON);
    return data.find((e) => e.id == id);
  };

  const getHorario = () => {
    let dataJSON = localStorage.getItem("data__horario");
    let data = Array.from(
      { length: 5 },
      (c) => (c = Array.from({ length: 9 }, () => []))
    );
    if (dataJSON != null) data = JSON.parse(dataJSON);
    return data;
  };

  const setHorario = (col, row, horario, action) => {
    let dataJSON = localStorage.getItem("data__horario");
    let data = Array.from(
      { length: 5 },
      (c) => (c = Array.from({ length: 9 }, () => []))
    );
    if (dataJSON != null) data = JSON.parse(dataJSON);

    if (action)
      data[col][row] = data[col][row].filter((e) => e.turma != horario.turma);

    data[col][row].push(horario);

    dataJSON = JSON.stringify(data);
    localStorage.setItem("data__horario", dataJSON);
  };

  const deleteHorario = (col, row, turma) => {
    let dataJSON = localStorage.getItem("data__horario");
    let data = Array.from(
      { length: 5 },
      (c) => (c = Array.from({ length: 9 }, () => []))
    );
    if (dataJSON != null) data = JSON.parse(dataJSON);
    data[col][row] = data[col][row].filter((e) => e.turma != turma);

    dataJSON = JSON.stringify(data);
    localStorage.setItem("data__horario", dataJSON);
  };

  const limparHorario = () => {
    localStorage.removeItem("data__horario");
  };

  return {
    getProfessores,
    setProfessor,
    deleteProfessor,
    getDisciplinas,
    setDisciplina,
    deteleDisciplina,
    getDisciplinaById,
    getHorario,
    setHorario,
    deleteHorario,
    limparHorario,
  };
})();
