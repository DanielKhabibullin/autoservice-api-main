import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const jsonFilePath = path.join(__dirname, 'schedule.json');
const futureDatesFilePath = path.join(__dirname, 'future_dates.json');

const getNextMonth = currentMonth => {
  const monthsInRussian = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ];

  const currentMonthIndex = monthsInRussian.indexOf(currentMonth);
  const nextMonthIndex = (currentMonthIndex + 1) % 12;

  return monthsInRussian[nextMonthIndex];
};

export const updateJsonFile = async () => {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf8');
    const schedule = JSON.parse(data);
    const futureDatesData = await fs.readFile(futureDatesFilePath, 'utf8');
    const futureDates = JSON.parse(futureDatesData);
    // Получаем текущую дату
    const today = new Date();
    const todayMonth = today.toLocaleString('ru-RU', { month: 'long' });
    const todayDay = today.getDate().toString();
    schedule.forEach(item => {
      if (item.date) {
        item.date.forEach(monthData => {
          if (
            monthData.month !== todayMonth &&
            monthData.month !== getNextMonth(todayMonth) &&
            monthData.month !== getNextMonth(getNextMonth(todayMonth))
          ) {
            monthData.day = {};
          } else if (monthData.month === todayMonth) {
            //Очищаем все предыдущие даты в этом месяце
            const todayDayInt = parseInt(todayDay, 10);
            const monthDayKeys = Object.keys(monthData.day).map(Number);
            monthDayKeys.forEach(day => {
              if (day <= todayDayInt) {
                delete monthData.day[day];
              }
            });
          }
        });
      }
    });
    schedule.forEach(item => {
      if (item.date) {
        item.date.forEach(monthData => {
          const futureMonthData = futureDates.date.find(m => m.month === monthData.month);

          if (futureMonthData) {
            Object.keys(futureMonthData.day).forEach(day => {
              monthData.day[day] = futureMonthData.day[day];
            });
          }
        });
      }
    });

    await fs.writeFile(jsonFilePath, JSON.stringify(schedule, null, 4), 'utf8');
    console.log('Файл успешно обновлен.');
  } catch (err) {
    console.error('Ошибка при работе с файлом:', err);
  }
};
