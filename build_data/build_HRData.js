import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Получаем путь к текущему файлу
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Функция для создания JSON файла с данными для гистограммы
function createHRChartDataJson(dataPath) {
    
    const currentDate = new Date();
    const dates = [];
    
    for (let i = 0; i < 10; i++) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - i);

        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const year = date.getFullYear();

        const formattedDate = `${month}-${year}`;
        dates.push(formattedDate);
    }
    

    const chartData = {
        labels: [`${dates[9]}`, `${dates[8]}`, `${dates[7]}`, `${dates[6]}`, `${dates[5]}`, `${dates[4]}`, `${dates[3]}`, `${dates[2]}`, `${dates[1]}`, `${dates[0]}`],
        datasets:[{
        "label": "Performance",
        "data": [65, 59, 80, 81, 56, 55, 40],
        "backgroundColor": "rgba(75, 192, 192, 0.2)",
        "borderColor": "rgba(75, 192, 192, 1)",
        "borderWidth": 1
    }]
    };

    fs.writeFileSync(dataPath, JSON.stringify(chartData, null, 2))
}

export{
    createHRChartDataJson
}