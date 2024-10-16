import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Recruter, Vacancy, Resume, Interview, Metric, RecruterMetric } from '../db.js';

// Получаем путь к текущему файлу
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Функция для создания JSON файла с данными для гистограммы
function createChartDataJson(dataPath, userid) {

    const currentDate = new Date();
    const dates = [];
    const datesForSearch = [];
    
    for (let i = 0; i < 10; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
    
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
      const year = date.getFullYear();
    
      const formattedDate = `${day}-${month}-${year}`;
      const formattedDateForSearch = `${year}-${month}-${day}`
      dates.push(formattedDate);
      datesForSearch.push(formattedDateForSearch);
    }

    const revievdApplications = []
    const AcceptedApplications = []
    const notAcceptedApplications = []

    for (let i = 0; i < 10; i++) {
        let revievdApplication;
        Resume.findByRecruiterIdAndSubmissionDate(userid, datesForSearch[i], (err, result) => {
            if (err) {
                console.error('Error finding resumes:', err);
            } else {
                const count = result.count; // Получаем количество совпадений
                revievdApplication = count;
            }
        })
        let AcceptedApplication; 
        Resume.findByRecruiterIdSubmissionDateAndStatus(userid, datesForSearch[i], 'open', (err, result) => {
            if (err) {
                console.error('Error finding resumes:', err);
            } else {
                const count = result.count; // Получаем количество совпадений
                AcceptedApplication = count;
            }
        })
        const notAcceptedApplication = revievdApplication - AcceptedApplication;

        revievdApplications.push(revievdApplication)
        console.log(revievdApplications)
        AcceptedApplications.push(revievdApplication)
        console.log(AcceptedApplications)
        notAcceptedApplications.push(notAcceptedApplication)
        console.log(notAcceptedApplications)
    }

    const chartData = {
        labels: [`${dates[9]}`, `${dates[8]}`, `${dates[7]}`, `${dates[6]}`, `${dates[5]}`, `${dates[4]}`, `${dates[3]}`, `${dates[2]}`, `${dates[1]}`, `${dates[0]}`],
        datasets: [
            {
                label: "Reviewed Applications",
                data: [revievdApplications[0], revievdApplications[1], revievdApplications[2], revievdApplications[3], revievdApplications[4], revievdApplications[5], revievdApplications[6], revievdApplications[7], revievdApplications[8], revievdApplications[9]],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            },
            {
                label: "Accepted Applications",
                data: [AcceptedApplications[0], AcceptedApplications[1], AcceptedApplications[2], AcceptedApplications[3], AcceptedApplications[4], AcceptedApplications[5], AcceptedApplications[6], AcceptedApplications[7], AcceptedApplications[8], AcceptedApplications[9]],
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1
            },
            {
                label: "Not accepted Applications",
                data: [notAcceptedApplications[0], notAcceptedApplications[1], notAcceptedApplications[2], notAcceptedApplications[3], notAcceptedApplications[4], notAcceptedApplications[5], notAcceptedApplications[6], notAcceptedApplications[7], notAcceptedApplications[8], notAcceptedApplications[9]],
                backgroundColor: "rgba(38, 140, 50, 0.2)",
                borderColor: "rgba(28, 107, 37, 1)",
                borderWidth: 1
            },
            {
                label: "Interviews Conducted",
                data: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
                backgroundColor: "rgba(255, 159, 64, 0.2)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1
            }
        ]
    };

    fs.writeFileSync(dataPath, JSON.stringify(chartData, null, 2))
}

export{
    createChartDataJson
}
