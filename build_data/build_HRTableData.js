import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Получаем путь к текущему файлу
const __dirname = path.dirname(fileURLToPath(import.meta.url))

function createChartHRTableDataJson(dataPath) {

    const chartData =
    [
        { "id": 1, "name": "Alice Smith", "email": "alice@example.com" },
        { "id": 2, "name": "Bob Johnson", "email": "bob@example.com" },
        { "id": 3, "name": "Charlie Brown", "email": "charlie@example.com" },
        { "id": 4, "name": "David White", "email": "david@example.com" },
        { "id": 5, "name": "Eve Black", "email": "eve@example.com" },
        { "id": 6, "name": "Frank Green", "email": "frank@example.com" }
    ]

    fs.writeFileSync(dataPath, JSON.stringify(chartData))
}

export{
    createChartHRTableDataJson
}