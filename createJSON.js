import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const jsonFilePath = path.join(__dirname, 'future_dates.json');

const generateRandomTimes = () => {
  const hours = [];
  const startHour = 10,
    endHour = 20;
  const numTimes = Math.floor(Math.random() * 5) + 4;

  while (hours.length < numTimes) {
    const hour =
      Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
    if (!hours.includes(hour)) {
      hours.push(hour);
    }
  }

  return hours.sort();
};

const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

const generateFutureDatesJson = () => {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  let jsonData = { date: [] };
  let currentMonthData = null;

  for (let i = 0; i < 60; i++) {
    let year = currentDate.getFullYear();
    let month = currentDate.toLocaleString('ru-RU', { month: 'long' });
    let day = currentDate.getDate();

    if (!currentMonthData || currentMonthData.month !== month) {
      currentMonthData = {
        month: month,
        day: {}, // Инициализация как пустой объект
      };
      jsonData.date.push(currentMonthData);
    }

    currentMonthData.day[day] = generateRandomTimes(); // Непосредственное добавление данных

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return jsonData;
};

const writeFutureDatesJson = async () => {
  try {
    const futureDatesJson = generateFutureDatesJson();
    await fs.writeFile(
      jsonFilePath,
      JSON.stringify(futureDatesJson, null, 4),
      'utf8',
    );
    console.log('Файл успешно создан: ' + jsonFilePath);
  } catch (error) {
    console.error('Ошибка при записи файла: ', error);
  }
};

writeFutureDatesJson();
