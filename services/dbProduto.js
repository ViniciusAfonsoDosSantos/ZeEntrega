import * as SQLite from 'expo-sqlite/next';

export async function getDbConnection() {
    console.log("Abrindo conexão com o banco de dados dbProdutos.db...");
    const cx = await SQLite.openDatabaseAsync('dbProdutos.db');
    console.log("Conexão com dbProdutos.db aberta.");
    return cx;
}

export async function createTable() {    
    const query = `CREATE TABLE IF NOT EXISTS tbProdutos
        (
            codigo text not null primary key,
            descricao text not null,
            preco real not null,
            categoria text not null,
            foreign key(categoria) references tbCategorias(codigo)
        )`;
    console.log("Criando tabela tbProdutos com a consulta:", query);
    var cx = await getDbConnection();
    await cx.execAsync(query);   
    console.log("Tabela tbProdutos criada ou já existe.");
    await cx.closeAsync();
    console.log("Conexão fechada após criação da tabela tbProdutos.");
};

export async function obtemTodosProdutos() {
    console.log("Obtendo todos os produtos...");
    var retorno = [];
    let dbCx = await getDbConnection();
    const registros = await dbCx.getAllAsync('SELECT * FROM tbProdutos');
    console.log("Produtos obtidos:", registros);
    await dbCx.closeAsync();
    console.log("Conexão fechada após obter produtos.");

    for (const registro of registros) {
        let obj = {
            codigo: registro.codigo,
            descricao: registro.descricao,
            preco: registro.preco,
            categoria: registro.categoria
        };
        retorno.push(obj);
    }

    console.log("Produtos processados:", retorno);
    return retorno;
}

export async function adicionaProduto(produto) {
    console.log("Adicionando produto:", produto);
    let dbCx = await getDbConnection();
    let query = 'insert into tbProdutos (codigo, descricao, preco, categoria) values (?,?,?,?)';
    const result = await dbCx.runAsync(query, [produto.codigo, produto.descricao, produto.preco, produto.categoria]);
    console.log("Produto inserido com sucesso:", result);
    await dbCx.closeAsync();
    return result.changes == 1;
}

export async function alteraProduto(produto) {
    console.log("Alterando produto:", produto);
    let dbCx = await getDbConnection();
    let query = 'update tbProdutos set descricao=?, preco=?, categoria=? where codigo=?';
    const result = await dbCx.runAsync(query, [produto.descricao, produto.preco, produto.categoria, produto.codigo]);
    console.log("Produto alterado com sucesso:", result);
    await dbCx.closeAsync();
    return result.changes == 1;
}

export async function excluiProduto(codigo) {
    console.log("Excluindo produto com código:", codigo);
    let dbCx = await getDbConnection();
    let query = 'delete from tbProdutos where codigo=?';
    console.log(codigo);
    const result = await dbCx.runAsync(query, [codigo]);
    console.log("Produto excluído com sucesso:", result);
    await dbCx.closeAsync();
    return result.changes == 1;
}

export async function excluiTodosProdutos() {
    console.log("Excluindo todos os produtos...");
    let dbCx = await getDbConnection();
    let query = 'delete from tbProdutos';
    await dbCx.execAsync(query);
    console.log("Todos os produtos excluídos.");
    await dbCx.closeAsync();
}

export async function obtemProdutoPorCodigo(codigo) {
    console.log(`Buscando produto com código: ${codigo}`);
    let dbCx = await getDbConnection();
    const query = 'SELECT * FROM tbProdutos WHERE codigo = ?';
    const registros = await dbCx.getAllAsync(query, [codigo]);
    await dbCx.closeAsync();
  
    if (registros.length > 0) {
      const registro = registros[0];
      return {
        codigo: registro.codigo,
        descricao: registro.descricao,
        preco: registro.preco,
        categoria: registro.categoria,
      };
    } else {
      throw new Error('Produto não encontrado');
    }
  }
  
