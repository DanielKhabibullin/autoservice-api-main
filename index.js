import { updateJsonFile } from './updateJsonFile.js';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/api', async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, 'schedule.json'),
      'utf8',
    );
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).send('Ошибка при чтении файла: ' + err);
  }
});

app.post('/api/orders', async (req, res) => {
  const newOrder = req.body;

  try {
    const ordersFilePath = path.join(__dirname, 'orders.json');

    let orders = await fs.readFile(ordersFilePath, 'utf8');
    orders = JSON.parse(orders);

    orders.push(newOrder);

    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 4), 'utf8');

    res.status(200).send('Заказ успешно добавлен');
  } catch (err) {
    res.status(500).send('Ошибка при записи файла: ' + err);
  }
});

updateJsonFile();

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
