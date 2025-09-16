// =========================
// CLI de Estudantes (simples)
// =========================

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ====== Dados (memória) ======
/** @type {{nome: string, idade: number, notas: number[]}[]} */
const estudantes = [
  { nome: "Pablo Henrique Dias", idade: 19, notas: [10, 8, 9.5] },
];

// ====== Utilidades (puras) ======

/** Exibe um título bonitinho no console */
function printTitle(texto) {
  console.log("\n=== " + texto.toUpperCase() + " ===");
}

/** Tira espaços duplicados e deixa lower-case para comparar nomes */
function normalizeName(nome) {
  return String(nome || "").trim().replace(/\s+/g, " ").toLowerCase();
}

/** Converte entrada do usuário em array de números válidos (0-10) */
function parseNotas(input) {
  if (!input) return [];
  const partes = String(input)
    .split(/[,\s;]+/) // aceita vírgula, espaço ou ponto-e-vírgula
    .map((p) => p.replace(",", ".")) // "8,5" -> "8.5"
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 0 && n <= 10);
  return partes;
}

/** Média de um estudante (segura para listas vazias) */
function mediaDoEstudante(estudante) {
  const notas = estudante.notas || [];
  if (notas.length === 0) return 0;
  const soma = notas.reduce((acc, n) => acc + n, 0);
  return soma / notas.length;
}

/** Média geral (média das médias) */
function mediaGeralTurma(lista) {
  if (lista.length === 0) return 0;
  const medias = lista.map(mediaDoEstudante);
  const soma = medias.reduce((acc, m) => acc + m, 0);
  return soma / medias.length;
}

/** Retorna o estudante com maior média (ou null se vazio) */
function melhorAluno(lista) {
  if (lista.length === 0) return null;
  let melhor = lista[0];
  for (let i = 1; i < lista.length; i++) {
    if (mediaDoEstudante(lista[i]) > mediaDoEstudante(melhor)) {
      melhor = lista[i];
    }
  }
  return melhor;
}

// ====== UI (entrada/saída) ======

function mostrarMenu() {
  printTitle("Menu");
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
  printTitle("Cadastrar Estudante");
  rl.question("Nome: ", (nome) => {
    rl.question("Idade: ", (idadeStr) => {
      rl.question("Notas separadas por vírgula (ex: 8,7,10): ", (entradaNotas) => {
        const idade = parseInt(idadeStr);
        const notas = parseNotas(entradaNotas);

        // Mantém simples, mas evita NaN e notas vazias
        if (!nome.trim() || !Number.isFinite(idade)) {
          console.log("❌ Nome e idade válidos são obrigatórios.");
          return mostrarMenu();
        }
        if (notas.length === 0) {
          console.log("❌ Informe pelo menos uma nota válida (0 a 10).");
          return mostrarMenu();
        }

        estudantes.push({ nome: nome.trim(), idade, notas });
        console.log("✅ Estudante cadastrado!");
        mostrarMenu();
      });
    });
  });
}

function listarEstudantes() {
  printTitle("Lista de Estudantes");
  if (estudantes.length === 0) {
    console.log("Nenhum estudante cadastrado.");
    return mostrarMenu();
  }
  estudantes.forEach((e, i) => {
    console.log(`${i + 1}. ${e.nome} - Idade: ${e.idade}`);
  });
  mostrarMenu();
}

function buscarEstudante() {
  printTitle("Buscar Estudante");
  rl.question("Digite o nome: ", (nomeBusca) => {
    const alvo = normalizeName(nomeBusca);
    const encontrado = estudantes.find(
      (e) => normalizeName(e.nome) === alvo
    );
    if (encontrado) {
      console.log("✅ Encontrado:");
      console.log(
        `Nome: ${encontrado.nome} | Idade: ${encontrado.idade} | Notas: [${encontrado.notas.join(
          ", "
        )}] | Média: ${mediaDoEstudante(encontrado).toFixed(2)}`
      );
    } else {
      console.log("❌ Não encontrado.");
    }
    mostrarMenu();
  });
}

function calcularMedias() {
  printTitle("Médias");
  if (estudantes.length === 0) {
    console.log("Não há estudantes cadastrados.");
    return mostrarMenu();
  }

  // 1) Média individual
  estudantes.forEach((e) => {
    console.log(`${e.nome} → Média: ${mediaDoEstudante(e).toFixed(2)}`);
  });

  // 2) Média geral
  const geral = mediaGeralTurma(estudantes);
  console.log(`\n📊 Média geral da turma: ${geral.toFixed(2)}`);

  // 3) Melhor aluno
  const melhor = melhorAluno(estudantes);
  if (melhor) {
    console.log(
      `🏅 Maior média: ${melhor.nome} (${mediaDoEstudante(melhor).toFixed(2)})`
    );
  }

  mostrarMenu();
}

// ====== Start ======
mostrarMenu();

