// services/dbVenda.js
import * as SQLite from 'expo-sqlite/next';

export async function getDbConnection() {
  console.log("Abrindo conexão com o banco de dados dbVendas.db...");
  const cx = await SQLite.openDatabaseAsync('dbVendas.db');
  console.log("Conexão com dbVendas.db aberta.");
  return cx;
}

export async function createTable() {
  const queryVendas = `CREATE TABLE IF NOT EXISTS tbVendas (
    codigo TEXT NOT NULL PRIMARY KEY,
    data TEXT NOT NULL
  )`;

  const queryProdutosVenda = `CREATE TABLE IF NOT EXISTS tbProdutosVenda (
    vendaCodigo TEXT NOT NULL,
    produtoCodigo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    preco REAL NOT NULL,
    categoria TEXT NOT NULL,
    quantidade INTEGER NOT NULL,
    PRIMARY KEY(vendaCodigo, produtoCodigo),
    FOREIGN KEY(vendaCodigo) REFERENCES tbVendas(codigo)
  )`;

  const cx = await getDbConnection();
  await cx.execAsync(queryVendas);
  await cx.execAsync(queryProdutosVenda);
  await cx.closeAsync();
}

export async function obtemTodasVendas() {
  console.log("Obtendo todas as vendas...");
  let dbCx = await getDbConnection();
  const registros = await dbCx.getAllAsync('SELECT * FROM tbVendas');
  await dbCx.closeAsync();

  return registros.map((registro) => ({
    codigo: registro.codigo,
    data: registro.data,
  }));
}

export async function adicionaVenda(venda, produtos) {
  console.log("Adicionando venda:", venda);
  let dbCx = await getDbConnection();

  const queryVenda = 'INSERT INTO tbVendas (codigo, data) VALUES (?, ?)';
  const resultVenda = await dbCx.runAsync(queryVenda, [venda.codigo, venda.data]);

  for (let produto of produtos) {
    const queryProdutoVenda = `
      INSERT INTO tbProdutosVenda (
        vendaCodigo, produtoCodigo, descricao, preco, categoria, quantidade
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    await dbCx.runAsync(queryProdutoVenda, [
      venda.codigo,
      produto.codigo,
      produto.descricao,
      produto.preco,
      produto.categoria,
      produto.quantidade
    ]);
  }

  await dbCx.closeAsync();
  return resultVenda.changes === 1;
}

export async function obtemProdutosDaVenda(vendaCodigo, dbCx = null) {
  console.log(`Buscando produtos da venda ${vendaCodigo}...`);

  let dbInterna = false;
  if (!dbCx) {
    dbCx = await getDbConnection();
    dbInterna = true;
  }

  const query = 'SELECT * FROM tbProdutosVenda WHERE vendaCodigo = ?';
  const registros = await dbCx.getAllAsync(query, [vendaCodigo]);

  if (dbInterna) await dbCx.closeAsync();

  return registros.map((registro) => ({
    produtoCodigo: registro.produtoCodigo,
    descricao: registro.descricao,
    preco: registro.preco,
    categoria: registro.categoria,
    quantidade: registro.quantidade,
  }));
}

export async function excluiVenda(codigo) {
  let dbCx = await getDbConnection();
  await dbCx.runAsync('DELETE FROM tbProdutosVenda WHERE vendaCodigo = ?', [codigo]);
  const result = await dbCx.runAsync('DELETE FROM tbVendas WHERE codigo = ?', [codigo]);
  await dbCx.closeAsync();
  return result.changes === 1;
}

export async function reiniciarTabelasVenda() {
  const db = await getDbConnection();
  await db.execAsync('DELETE FROM tbProdutosVenda');
  await db.execAsync('DELETE FROM tbVendas');
  await db.closeAsync();
  console.log("Tabelas tbVendas e tbProdutosVenda foram reiniciadas (dados apagados).");
}

export async function recriarTabelasVenda() {
  const db = await getDbConnection();

  await db.execAsync('DROP TABLE IF EXISTS tbProdutosVenda');
  await db.execAsync('DROP TABLE IF EXISTS tbVendas');

  const queryVendas = `
    CREATE TABLE IF NOT EXISTS tbVendas (
      codigo TEXT NOT NULL PRIMARY KEY,
      data TEXT NOT NULL
    )
  `;

  const queryProdutosVenda = `
    CREATE TABLE IF NOT EXISTS tbProdutosVenda (
      vendaCodigo TEXT NOT NULL,
      produtoCodigo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      preco REAL NOT NULL,
      categoria TEXT NOT NULL,
      quantidade INTEGER NOT NULL,
      PRIMARY KEY (vendaCodigo, produtoCodigo)
    )
  `;

  await db.execAsync(queryVendas);
  await db.execAsync(queryProdutosVenda);
  await db.closeAsync();

  console.log("Tabelas tbVendas e tbProdutosVenda foram dropadas e recriadas.");
}

