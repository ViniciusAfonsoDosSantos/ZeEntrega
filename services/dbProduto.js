import * as SQLite from 'expo-sqlite/next';

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbProdutos.db');
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
    var cx = await getDbConnection();
    await cx.execAsync(query);   
    await cx.closeAsync();
};

export async function obtemTodosProdutos() {
    var retorno = [];
    var dbCx = await getDbConnection();
    const registros = await dbCx.getAllAsync('SELECT * FROM tbProdutos');
    await dbCx.closeAsync();

    for (const registro of registros) {
        let obj = {
            codigo: registro.codigo,
            descricao: registro.descricao,
            preco: registro.preco,
            categoria: registro.categoria
        };
        retorno.push(obj);
    }

    return retorno;
}

export async function adicionaProduto(produto) {
    let dbCx = await getDbConnection();
    let query = 'insert into tbProdutos (codigo, descricao, preco, categoria) values (?,?,?,?)';
    const result = await dbCx.runAsync(query, [produto.codigo, produto.descricao, produto.preco, produto.categoria]);
    await dbCx.closeAsync();
    return result.changes == 1;
}

export async function alteraProduto(produto) {
    let dbCx = await getDbConnection();
    let query = 'update tbProdutos set descricao=?, preco=?, categoria=? where codigo=?';
    const result = await dbCx.runAsync(query, [produto.descricao, produto.preco, produto.categoria, produto.codigo]);
    await dbCx.closeAsync();
    return result.changes == 1;
}

export async function excluiProduto(codigo) {
    let dbCx = await getDbConnection();
    let query = 'delete from tbProdutos where codigo=?';
    const result = await dbCx.runAsync(query, [codigo]);
    await dbCx.closeAsync();
    return result.changes == 1;
}

export async function excluiTodosProdutos() {
    let dbCx = await getDbConnection();
    let query = 'delete from tbProdutos';
    await dbCx.execAsync(query);
    await dbCx.closeAsync();
}
