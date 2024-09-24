// Importando dependências
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); // Importar o dotenv

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Criando a aplicação Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Obter a porta e a URI do MongoDB das variáveis de ambiente
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://leonardotanaka0513:KunZuvo6B6qq3hFe@esp32db.cf2vc.mongodb.net/?retryWrites=true&w=majority&appName=esp32db';

// Conectando ao MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((error) => console.error('Falha ao conectar ao MongoDB:', error));

// Definindo o esquema e o modelo para os dados recebidos
const espDataSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  status: String,
  timestamp: { type: Date, default: Date.now }
});

const EspData = mongoose.model('EspData', espDataSchema);

// Rota POST para receber os dados do ESP32
app.post('/posicao', async (req, res) => {
  try {
    const { x, y, status } = req.body;

    const newData = new EspData({
      x,
      y,
      status
    });

    await newData.save();
    res.status(200).send('Dados recebidos e armazenados com sucesso!');
    console.log(`Dados recebidos: x=${x}, y=${y}, status=${status}`);
  } catch (error) {
    console.error('Erro ao salvar os dados:', error);
    res.status(500).send('Erro ao salvar os dados no servidor.');
  }
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
