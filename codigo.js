let listaChurrasco = ["Carne", "Linguiça", "Frango", "Pão de Alho", "Refrigerante", "Carvão"];

console.log("Lista inicial:", listaChurrasco);

// 1. Remover "Frango" (índice 2)
let removido = listaChurrasco.splice(2, 1);
console.log("Removido:", removido);
console.log("Após remover Frango:", listaChurrasco);

// 2. Adicionar "Queijo Coalho" no lugar de "Frango" (mesmo índice)
listaChurrasco.splice(2, 0, "Queijo Coalho");
console.log("Após adicionar Queijo Coalho:", listaChurrasco);

// 3. Substituir "Refrigerante" por "Cerveja"
listaChurrasco.splice(4, 1, "Cerveja");
console.log("Após substituir Refrigerante por Cerveja:", listaChurrasco);

// 4. Inserir "Sal Grosso" no início sem remover nada
listaChurrasco.splice(0, 0, "Sal Grosso");
console.log("Após adicionar Sal Grosso no início:", listaChurrasco);

// 5. Remover os dois últimos itens
let ultimosRemovidos = listaChurrasco.splice(-2);
console.log("Removidos do final:", ultimosRemovidos);
console.log("Lista final:", listaChurrasco);