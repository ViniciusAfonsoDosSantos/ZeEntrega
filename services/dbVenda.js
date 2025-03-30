import * as SQLite from 'expo-sqlite/next';

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbVendas.db');
    return cx;
}

export async function createTable() {    
    const query = `CREATE TABLE IF NOT EXISTS tbVendas
        (
            codigo text not null primary key,
            data text not null
        )`;
    var cx = await getDbConnection();
    await cx.execAsync(query);   
    await cx.closeAsync();
    
    const queryProdutosVenda = `CREATE TABLE IF NOT EXISTS tbProdutosVenda
        (
            vendaCodigo text not null,
            produtoCodigo text not null,
            quantidade integer not null,
            foreign key(vendaCodigo) references tbVendas(codigo),
            foreign key(produtoCodigo) references tbProdutos(codigo),
            primary key(vendaCodigo, produtoCodigo)
        )`;
    cx = await getDbConnection();
    await cx.execAsync(queryProdutosVenda);
    await cx.closeAsync();
};

export async function obtemTodasVendas() {
    var retorno = [];
    var dbCx = await getDbConnection();
    const registros = await dbCx.getAllAsync('SELECT * FROM tbVendas');
    await dbCx.closeAsync();

    for (const registro of registros) {
        let obj = {
            codigo: registro.codigo,
            data: registro.data
        };
        retorno.push(obj);
    }

    return retorno;
}

export async function adicionaVenda(venda, produtos) {
    let dbCx = await getDbConnection();
    
    const queryVenda = 'insert into tbVendas (codigo, data) values (?,?)';
    const resultVenda = await dbCx.runAsync(queryVenda, [venda.codigo, venda.data]);

    for (let produto of produtos) {
        const queryProdutoVenda = 'insert into tbProdutosVenda (vendaCodigo, produtoCodigo, quantidade) values (?,?,?)';
        await dbCx.runAsync(queryProdutoVenda, [venda.codigo, produto.codigo, produto.quantidade]);
    }

    await dbCx.closeAsync();
    return resultVenda.changes == 1;
}

export async function excluiVenda(codigo) {
    let dbCx = await getDbConnection();
    
    let queryProdutosVenda = 'delete from tbProdutosVenda where vendaCodigo=?';
    await dbCx.runAsync(queryProdutosVenda, [codigo]);
    
    let queryVenda = 'delete from tbVendas where codigo=?';
    const resultVenda = await dbCx.runAsync(queryVenda, [codigo]);

    await dbCx.closeAsync();
    return resultVenda.changes == 1;
}

export async function excluiTodasVendas() {
    let dbCx = await getDbConnection();
    let queryProdutosVenda = 'delete from tbProdutosVenda';
    await dbCx.execAsync(queryProdutosVenda);

    let queryVendas = 'delete from tbVendas';
    await dbCx.execAsync(queryVendas);

    await dbCx.closeAsync();
}
