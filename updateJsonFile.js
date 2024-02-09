import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const jsonFilePath = path.join(__dirname, 'schedule.json');

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

export const updateJsonFile = async () => {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf8');
    const schedule = JSON.parse(data);

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 60);

    const todayMonth = today.toLocaleString('ru-RU', { month: 'long' });
    const futureMonth = futureDate.toLocaleString('ru-RU', { month: 'long' });
    const todayDay = today.getDate().toString();
    const futureDay = futureDate.getDate().toString();

    schedule.forEach(item => {
      if (item.date) {
        // Удаление текущего дня
        const currentMonthData = item.date.find(m => m.month === todayMonth);
        if (currentMonthData && currentMonthData.day[todayDay]) {
          delete currentMonthData.day[todayDay];
        }

        // Добавление нового дня
        let futureMonthData = item.date.find(m => m.month === futureMonth);
        if (!futureMonthData) {
          futureMonthData = { month: futureMonth, day: {} };
          item.date.push(futureMonthData);
        }
        futureMonthData.day[futureDay] = generateRandomTimes();
      }
    });

    await fs.writeFile(jsonFilePath, JSON.stringify(schedule, null, 4), 'utf8');
    console.log('Файл успешно обновлен.');
  } catch (err) {
    console.error('Ошибка при работе с файлом:', err);
  }
};
