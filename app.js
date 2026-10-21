const express = require('express');

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Servidor de News Explorer funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});