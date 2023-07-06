(() => {
  const DOMStrings = {
    inputFile: "#inputFile",
    btnUpload: "#upload",
    btnDownload: "#download",
  };

  const downloadJSON = (jsonData, filename) => {
    const blobData = new Blob([JSON.stringify(jsonData)], {
      type: "application/json",
    });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blobData);
    downloadLink.download = filename;

    // Append the download link to the document body
    document.body.appendChild(downloadLink);

    // Simulate a click on the download link
    downloadLink.click();

    // Clean up
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);
  };

  const uploadFile = () => {
    if (!document.querySelector(DOMStrings.inputFile).files.length) {
      alert("Selecione um arquivo");
      return;
    }
    // only jason file
    if (
      !document
        .querySelector(DOMStrings.inputFile)
        .files[0].name.match(/.*\.json$/)
    ) {
      alert("Selecione um arquivo JSON");
      return;
    }

    // ler aquivo json do inputFile
    const file = document.querySelector(DOMStrings.inputFile).files[0];
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (evt) => {
      const data = JSON.parse(evt.target.result);
      console.log(data);
      // salvar no localStorage
      localStorage.setItem("data__horario", JSON.stringify(data.data__horario));
      localStorage.setItem(
        "data__disciplinas",
        JSON.stringify(data.data__disciplinas)
      );
      localStorage.setItem(
        "data__professores",
        JSON.stringify(data.data__professores)
      );

      // success
      alert("Arquivo carregado com sucesso");
      // limpar input
      document.querySelector(DOMStrings.inputFile).value = "";
    };
    reader.onerror = (evt) => {
      console.log("error reading file");
    };
  };

  const downloadFile = () => {
    console.log("downloadFile");
    const horario = DATABASE.getHorario();
    const disciplinas = DATABASE.getDisciplinas();
    const professores = DATABASE.getProfessores();

    const data = {
      data__horario: horario ? horario : [],
      data__disciplinas: disciplinas ? disciplinas : [],
      data__professores: professores ? professores : [],
    };

    // horaio_backup_29-06-2022--150000
    const date = new Date();
    const dateStr = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}--${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
    const filename = `horario_backup_${dateStr}.json`;

    downloadJSON(data, filename);
  };

  const setupEventListeners = () => {
    document
      .querySelector(DOMStrings.btnUpload)
      .addEventListener("click", uploadFile);
    document
      .querySelector(DOMStrings.btnDownload)
      .addEventListener("click", downloadFile);
  };

  const init = (() => {
    setupEventListeners();
  })();
})();
