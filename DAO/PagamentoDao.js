function PagamentoDao(connection) {
    this._connection = connection;
}

PagamentoDao.prototype.salva = function(pagamento,callback) {
  let stmt = `INSERT INTO pagamentos (forma_de_pagamento, valor, moeda, descricao, status) values(?, ?, ?, ?, ?)`;
  let todo = [pagamento.forma_de_pagamento, pagamento.valor, pagamento.moeda, pagamento.descricao, pagamento.status];
  this._connection.query(stmt, todo);
  console.log("inserido");
}

PagamentoDao.prototype.lista = function(callback) {
    this._connection.query('select * from pagamentos',callback);
}

PagamentoDao.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from pagamentos where id = ?",[id],callback);
}



PagamentoDao.prototype.atualizaStatus = function (pagamento,callback) {

    let stmt = `UPDATE pagamentos set status = ? where id_pagamento = ?`;
    let todo = [pagamento.status, pagamento.id];
    this._connection.query(stmt, todo);
    console.log("status atualizado");
}


module.exports = function(){
    return PagamentoDao;moeda, descricao, status
};
