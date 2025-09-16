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

/**
 * Converte entrada do usuário em array de números válidos (0–10)
 * e sinaliza se houve número negativo na entrada.
 * Retorna um objeto { notas, temNegativo }.
 */
function parseNotas(input) {
  const result = { notas: [], temNegativo: false };
  if (!input) return result;

  const tokens = String(input)
    .split(/[,\s;]+/)           // aceita vírgula, espaço ou ponto-e-vírgula
    .filter(Boolean)
    .map((s) => s.replace(",", ".")); // aceita "8,5"

  const numeros = tokens.map(Number);

  // Detecta qualquer número negativo informado
  if (numeros.some((n) => Number.isFinite(n) && n < 0)) {
    result.temNegativo = true;
    return result;
  }

  // Mantém apenas valores válidos de 0 a 10
  result.notas = numeros.filter((n) => Number.isFinite(n) && n >= 0 && n <= 10);
  return result;
}

/** Média de um estudante (retorna 0 se não houver notas) */
function mediaDoEstudante(estudante) {
  const notas = estudante.notas || [];
  if (notas.length === 0) return 0;
  const soma = notas.reduce((acc, n) => acc + n, 0);
  return soma / notas.length;
}

// ====== Menu / UI ======

function mostrarMenu() {
  printTitle("Menu");
  console.log("1 - Cadastrar estudante");
  console.log("2 - Listar estudantes");
  console.log("3 - Buscar estudante");
  console.log("4 - Calcular médias (individual, geral e maior média)");
  console.log("5 - Listar por situação (aprovados/recuperação/reprovados)");
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
      case "5":
        listarPorSituacao();
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
        // Validação de idade: inteiro e não negativo
        const idade = Number(String(idadeStr).trim());
        const idadeEhInteira = Number.isInteger(idade);

        const { notas, temNegativo } = parseNotas(entradaNotas);

        if (!nome.trim()) {
          console.log("❌ Nome é obrigatório.");
          return mostrarMenu();
        }

        if (!idadeEhInteira || !Number.isFinite(idade)) {
          console.log("❌ Idade deve ser um número inteiro válido.");
          return mostrarMenu();
        }

        if (idade < 0) {
          console.log("❌ Idade não pode ser negativa.");
          return mostrarMenu();
        }

        if (temNegativo) {
          console.log("❌ Não são permitidos números negativos nas notas.");
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
    const encontrado = estudantes.find((e) => normalizeName(e.nome) === alvo);

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

  // 1) Médias individuais
  const medias = estudantes.map((e) => ({
    nome: e.nome,
    media: mediaDoEstudante(e),
  }));

  medias.forEach((m) => {
    console.log(`${m.nome} → Média: ${m.media.toFixed(2)}`);
  });

  // 2) Média geral (média das médias)
  const somaMedias = medias.reduce((acc, m) => acc + m.media, 0);
  const mediaGeral = somaMedias / medias.length;
  console.log(`\n📊 Média geral da turma: ${mediaGeral.toFixed(2)}`);

  // 3) Maior média
  let melhor = medias[0];
  for (let i = 1; i < medias.length; i++) {
    if (medias[i].media > melhor.media) {
      melhor = medias[i];
    }
  }
  console.log(`🏅 Maior média: ${melhor.nome} (${melhor.media.toFixed(2)})`);

  mostrarMenu();
}

function listarPorSituacao() {
  printTitle("Situação dos Estudantes");
  if (estudantes.length === 0) {
    console.log("Não há estudantes cadastrados.");
    return mostrarMenu();
  }

  const aprovados = [];
  const recuperacao = [];
  const reprovados = [];

  estudantes.forEach((e) => {
    const media = mediaDoEstudante(e);
    const item = { nome: e.nome, media };

    if (media >= 7.0) {
      aprovados.push(item);
    } else if (media >= 5.0) {
      recuperacao.push(item); // 5.0 a 6.99...
    } else {
      reprovados.push(item); // abaixo de 5.0
    }
  });

  // Ordena por média (decrescente) para ler melhor
  aprovados.sort((a, b) => b.media - a.media);
  recuperacao.sort((a, b) => b.media - a.media);
  reprovados.sort((a, b) => b.media - a.media);

  function printLista(titulo, lista) {
    console.log(`\n${titulo}:`);
    if (lista.length === 0) {
      console.log("  (nenhum)");
    } else {
      lista.forEach((it, i) =>
        console.log(`  ${i + 1}. ${it.nome} — Média: ${it.media.toFixed(2)}`)
      );
    }
  }

  printLista("✅ Aprovados (média >= 7.0)", aprovados);
  printLista("🟡 Recuperação (média entre 5.0 e 6.9)", recuperacao);
  printLista("❌ Reprovados (média < 5.0)", reprovados);

  mostrarMenu();
}

// ====== Start ======
mostrarMenu();

