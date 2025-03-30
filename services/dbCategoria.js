import * as SQLite from 'expo-sqlite/next';

export async function getDbConnection() {
    console.log("Abrindo conexão com o banco de dados dbCategorias.db...");
    const cx = await SQLite.openDatabaseAsync('dbCategorias.db');
    console.log("Conexão com dbCategorias.db aberta.");
    return cx;
}

export async function createTable() {    
    const query = `CREATE TABLE IF NOT EXISTS tbCategorias
        (
            codigo text not null primary key,
            nome text not null
        )`;
    console.log("Criando tabela tbCategorias com a consulta:", query);
    var cx = await getDbConnection();
    await cx.execAsync(query);   
    console.log("Tabela tbCategorias criada ou já existe.");
    await cx.closeAsync();
    console.log("Conexão fechada após criação da tabela tbCategorias.");
};

export async function obtemTodasCategorias() {
    console.log("Obtendo todas as categorias...");
    var retorno = [];
    let dbCx = await getDbConnection();
    const registros = await dbCx.getAllAsync('SELECT * FROM tbCategorias');
    console.log("Categorias obtidas:", registros);
    await dbCx.closeAsync();
    console.log("Conexão fechada após obter categorias.");

    for (const registro of registros) {
        let obj = {
            codigo: registro.codigo,
            nome: registro.nome
        };
        retorno.push(obj);
    }

    console.log("Categorias processadas:", retorno);
    return retorno;
}

export async function adicionaCategoria(categoria) {
    console.log("Adicionando categoria:", categoria);
    let dbCx = await getDbConnection();
    let query = 'insert into tbCategorias (codigo, nome) values (?,?)';
    const result = await dbCx.runAsync(query, [categoria.codigo, categoria.nome]);
    console.log("Categoria inserida com sucesso:", result);
    await dbCx.closeAsync();
    return result.changes == 1;
}

export async function alteraCategoria(categoria) {
    console.log("Alterando categoria:", categoria);
    let dbCx = await getDbConnection();
    let query = 'update tbCategorias set nome=? where codigo=?';
    const result = await dbCx.runAsync(query, [categoria.nome, categoria.codigo]);
    console.log("Categoria alterada com sucesso:", result);
    await dbCx.closeAsync();
    return result.changes == 1;
}

export async function excluiCategoria(codigo) {
    console.log("Excluindo categoria com código:", codigo);
    let dbCx = await getDbConnection();
    let query = 'delete from tbCategorias where codigo=?';
    const result = await dbCx.runAsync(query, [codigo]);
    console.log("Categoria excluída com sucesso:", result);
    await dbCx.closeAsync();
    return result.changes == 1;
}

export async function excluiTodasCategorias() {
    console.log("Excluindo todas as categorias...");
    let dbCx = await getDbConnection();
    let query = 'delete from tbCategorias';
    await dbCx.execAsync(query);
    console.log("Todas as categorias excluídas.");
    await dbCx.closeAsync();
}
