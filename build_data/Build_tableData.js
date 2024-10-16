import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Получаем путь к текущему файлу
const __dirname = path.dirname(fileURLToPath(import.meta.url))

function createChartTableDataJson(dataPath) {

    const chartData =
        [
            {
              "id": 1,
              "reviewed": true,
              "interviewed": true,
              "reason": "Принят на работу"
            },
            {
              "id": 2,
              "reviewed": false,
              "interviewed": false,
              "reason": "Не подходит по квалификации"
            },
            {
              "id": 3,
              "reviewed": true,
              "interviewed": false,
              "reason": "Не прошел собеседование"
            },
        ]

    fs.writeFileSync(dataPath, JSON.stringify(chartData))
}

export{
    createChartTableDataJson
}