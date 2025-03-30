import * as SQLite from 'expo-sqlite/next';

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbCategorias.db');
    return cx;
}

export async function createTable() {    
    const query = `CREATE TABLE IF NOT EXISTS tbCategorias
        (
            codigo text not null primary key,
            nome text not null
        )`;
    var cx = await getDbConnection();
    await cx.execAsync(query);   
    await cx.closeAsync();
};

export async function obtemTodasCategorias() {
    var retorno = [];
    var dbCx = await getDbConnection();
    const registros = await dbCx.getAllAsync('SELECT * FROM tbCategorias');
    await dbCx.closeAsync();

    for (const registro of registros) {
        let obj = {
            codigo: registro.codigo,
            nome: registro.nome
        };
        retorno.push(obj);
    }

    return retorno;
}

export async function adicionaCategoria(categoria) {
    let dbCx = await getDbConnection();
    let query = 'insert into tbCategorias (codigo, nome) values (?,?)';
    const result = await dbCx.runAsync(query, [categoria.codigo, categoria.nome]);
    await dbCx.closeAsync();
    return result.changes == 1;
}

export async function alteraCategoria(categoria) {
    let dbCx = await getDbConnection();
    let query = 'update tbCategorias set nome=? where codigo=?';
    const result = await dbCx.runAsync(query, [categoria.nome, categoria.codigo]);
    await dbCx.closeAsync();
    return result.changes == 1;
}

export async function excluiCategoria(codigo) {
    let dbCx = await getDbConnection();
    let query = 'delete from tbCategorias where codigo=?';
    const result = await dbCx.runAsync(query, [codigo]);
    await dbCx.closeAsync();
    return result.changes == 1;
}

export async function excluiTodasCategorias() {
    let dbCx = await getDbConnection();
    let query = 'delete from tbCategorias';
    await dbCx.execAsync(query);
    await dbCx.closeAsync();
}
