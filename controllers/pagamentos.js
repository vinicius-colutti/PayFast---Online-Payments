module.exports = (app) =>{
  app.get('/pagamentos/list', (req, res) => {
    console.log("TESTESTE");
    res.send("TEATTETAT");
  });

  app.delete('/pagamentos/add/:id', (req, res) =>{

    let id = req.params.id; 
    console.log("Cancelando o pagamento");
    let pagamento = {};  
    pagamento.status = 'CANCELADO';
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
    pagamento.status = 'CONFIRMADO';
    pagamento.id = id;
    let connection = new app.DAO.connection();
    let pagamentoDao = new app.DAO.PagamentoDao(connection);

    pagamentoDao.atualizaStatus(pagamento, (erro, resultado) =>{
        if(erro){
          console.log("Erro ao confimar o status");
          res.status(500).send(erro);
        }else{
          console.log("pagamento confirmado");
          res.status(200).json(pagamento);
        }

    });
  });

  app.post('/pagamentos/add', (req, res) => {
    req.assert("pagamento.forma_de_pagamento",
        "Forma de pagamento eh obrigatorio").notEmpty();
    req.assert("pagamento.valor",
      "Valor eh obrigatorio e deve ser um decimal")
        .notEmpty().isFloat();
    let erros = req.validationErrors();

    if(erros){
      console.log("Erro de validacao");
      res.status(400).send(erros);
      return;
    }
    var pagamento = req.body["pagamento"];
    console.log('processando uma requisição de um novo pagamento');
    pagamento.status = 'CRIADO';
    pagamento.data = new Date;
    let connection = new app.DAO.connection();
    let pagamentoDao = new app.DAO.PagamentoDao(connection);

    pagamentoDao.salva(pagamento, function(erro, resultado){
      if(erro){
        console.log("erro ao inserir no banco de dados");
        res.status(500).send(erro);
      }else{
        pagamento.id = resultado.insertId;
        console.log("pagamento criado");
        if(pagamento.forma_de_pagamento == 'cartao'){
          let cartao = req.body["cartao"];
          let clienteCartoes = new app.servicos.clienteCartoes();
          clienteCartoes.autoriza(cartao, (exception, request, response, retorno)=>{
              if(exception){
                console.log(exception);
                res.status(400).send(exception);
                return;
              }
              res.location('pagamentos/add/'+resultado.insertId);
             let response = {
            dados_do_pagamanto: pagamento,
            cartao: retorno,
            links: [
              {
                href:"http://localhost:3000/pagamentos/add/"
                        + pagamento.id,
                rel:"confirmar",
                method:"PUT"
              },
              {
                href:"http://localhost:3000/pagamentos/add/"
                        + pagamento.id,
                rel:"cancelar",
                method:"DELETE"
              }
            ]
          }
          res.status(201).json(response);
          });
          

        }else{
          res.location('pagamentos/add/'+resultado.insertId);
          let response = {
            dados_do_pagamanto: pagamento,
            links: [
              {
                href:"http://localhost:3000/pagamentos/add/"
                        + pagamento.id,
                rel:"confirmar",
                method:"PUT"
              },
              {
                href:"http://localhost:3000/pagamentos/add/"
                        + pagamento.id,
                rel:"cancelar",
                method:"DELETE"
              }
            ]
          }
          res.status(201).json(response);
        }
       
      }
    });
  });
};
