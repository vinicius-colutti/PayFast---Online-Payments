module.exports = (app) =>{

  app.get('/pagamentos/list', (req, res) => {
    let connection = new app.DAO.connection();
    let pagamentoDao = new app.DAO.PagamentoDao(connection);
    pagamentoDao.lista(res);
  });

  app.delete('/pagamentos/add/:id', (req, res) =>{

    let id = req.params.id; 
    console.log("Cancelando o pagamento");
    let pagamento = {};  
    pagamento.status = 'CANCEL';
    pagamento.id = id;
    let connection = new app.DAO.connection();
    let pagamentoDao = new app.DAO.PagamentoDao(connection);

    pagamentoDao.atualizaStatus(pagamento, (erro, resultado) =>{
        if(erro){
          console.log("Erro ao cancelar o pagamento");
          res.status(500).send(erro);
        }else{
          console.log("pagamento cancelado");
          res.status(204).json(pagamento);
        }

    });

  });

  app.put('/pagamentos/add/:id', (req, res) =>{

    let id = req.params.id; 
    console.log("Confirmando o pagamento");
    let pagamento = {};  
    pagamento.status = 'CONFIRMED';
    pagamento.id = id;
    let connection = new app.DAO.connection();
    let pagamentoDao = new app.DAO.PagamentoDao(connection);

    pagamentoDao.atualizaStatus(pagamento, res)

  });

  app.post('/pagamentos/add', (req, res) => {

      let pagamento = req.body.pagamento;
      pagamento.status = "PENDING";
      let connection = new app.DAO.connection();
      let pagamentoDao = new app.DAO.PagamentoDao(connection);

      if(pagamento.cartao){
        console.log("OK")
        pagamentoDao.salvaComCartao(pagamento, res)
      }else{
        console.log("OK")
        pagamentoDao.salva(pagamento, res)
      }

  });
}
