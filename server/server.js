const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('server/db.json');
const middlewares = jsonServer.defaults();

// Habilita CORS para permitir requisições do frontend
server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Rota personalizada para salvar configurações
server.put('/config', (req, res) => {
    const db = router.db; // Acessa o banco de dados
    db.set('config', req.body).write();
    res.jsonp(req.body);
});

// Usa o roteador padrão do JSON Server
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`JSON Server rodando em http://localhost:${PORT}`);
});