// Importa a aplicação Express configurada a partir do app.js
const app = require("./app");

// Define a porta em que o servidor irá rodar.
// Ele busca a porta na variável de ambiente 'PORT'. Se não encontrar, usa a 3001 como padrão.
const PORT = process.env.PORT || 3001;

// Inicia o servidor e o faz "escutar" por requisições na porta definida.
app.listen(PORT, () => {
  // Imprime uma mensagem no console para sabermos que o servidor iniciou com sucesso.
  console.log(`🚀 Servidor BusEasy rodando na porta ${PORT}`);
});
