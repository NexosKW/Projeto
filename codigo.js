const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const estudantes = [
  { nome: "Pablo Henrique Dias", idade: 19, notas: [10, 8, 9.5] },
];

function mostrarMenu() {
  console.log("\n=== MENU ===");
  console.log("1 - Cadastrar estudante");
  console.log("2 - Listar estudantes");
  console.log("3 - Buscar estudante");
  console.log("4 - Calcular médias");
  console.log("0 - Sair");

  rl.question("Escolha uma opção: ", (opcao) => {
    switch (opcao) {
      case "1":
        cadastrarEstudante();
        break;
      case "2":
        listarEstudantes();
        break;
      case "3":
        buscarEstudante();
        break;
      case "4":
        calcularMedias();
        break;
      case "0":
        console.log("Saindo...");
        rl.close();
        break;
      default:
        console.log("Opção inválida!");
        mostrarMenu();
    }
  });
}

function cadastrarEstudante() {
  rl.question("Nome: ", (nome) => {
    rl.question("Idade: ", (idade) => {
      rl.question("Notas separadas por vírgula: ", (entradaNotas) => {
        const notas = entradaNotas.split(",").map(Number);
        estudantes.push({ nome, idade: parseInt(idade), notas });
        console.log("✅ Estudante cadastrado!");
        mostrarMenu();
      });
    });
  });
}

function listarEstudantes() {
  console.log("\n=== LISTA DE ESTUDANTES ===");
  estudantes.forEach((e, i) => {
    console.log(`${i + 1}. ${e.nome} - Idade: ${e.idade}`);
  });
  mostrarMenu();
}

function buscarEstudante() {
  rl.question("Digite o nome: ", (nomeBusca) => {
    const encontrado = estudantes.find(
      (e) => e.nome.toLowerCase() === nomeBusca.toLowerCase()
    );
    if (encontrado) {
      console.log("✅ Encontrado:", encontrado);
    } else {
      console.log("❌ Não encontrado.");
    }
    mostrarMenu();
  });
}

function calcularMedias() {
  console.log("\n=== MÉDIAS ===");
  estudantes.forEach((e) => {
    const soma = e.notas.reduce((acc, n) => acc + n, 0);
    const media = soma / e.notas.length;
    console.log(`${e.nome} → Média: ${media.toFixed(2)}`);
  });
  mostrarMenu();
}

mostrarMenu();
