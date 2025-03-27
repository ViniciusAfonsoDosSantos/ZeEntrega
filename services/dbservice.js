import * as SQLite from 'expo-sqlite/next'; // npx expo install expo-sqlite
// para instalar:  
//npx expo install expo-sqlite
//https://docs.expo.dev/versions/latest/sdk/sqlite-next/

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbUsuarios.db');
    return cx;
}

export async function createTable() {    
    const query = `CREATE TABLE IF NOT EXISTS tbContatos
        (
            id text not null primary key,
            nome text not null,
            telefone text not null          
        )`;
    var cx = await getDbConnection();
    await cx.execAsync(query);   
    await cx.closeAsync() ;
};

export async function obtemTodosContatos() {

    var retorno = []
    var dbCx = await getDbConnection();
    const registros = await dbCx.getAllAsync('SELECT * FROM tbContatos');
    await dbCx.closeAsync() ;

    for (const registro of registros) {        
        let obj = {
            id: registro.id,
            nome: registro.nome,
            telefone: registro.telefone            
        }
        retorno.push(obj);
    }

    return retorno;
}

export async function adicionaContato(contato) {    
    let dbCx = await getDbConnection();    
    let query = 'insert into tbContatos (id, nome, telefone) values (?,?,?)';
    const result = await dbCx.runAsync(query, [contato.id, contato.nome, contato.telefone]);    
    await dbCx.closeAsync() ;    
    return result.changes == 1;    
}

export async function alteraContato(contato) {
    let dbCx = await getDbConnection();
    let query = 'update tbContatos set nome=?, telefone=? where id=?';
    const result = await dbCx.runAsync(query, [contato.nome, contato.telefone, contato.id]);
    await dbCx.closeAsync() ;
    return result.changes == 1;
}

export async function excluiContato(id) {
    let dbCx = await getDbConnection();
    let query = 'delete from tbContatos where id=?';
    const result = await dbCx.runAsync(query, id);
    await dbCx.closeAsync() ;
    return result.changes == 1;    
}

export async function excluiTodosContatos() {
    let dbCx = await getDbConnection();
    let query = 'delete from tbContatos ';    
    await dbCx.execAsync(query);    
    await dbCx.closeAsync() ;
}
