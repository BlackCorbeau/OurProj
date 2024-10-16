import sqlite3 from 'sqlite3';
const dbname = 'later.sqlite';
const db = new sqlite3.Database(dbname);

db.serialize(() => {
    const createRecrutersTable = `
    CREATE TABLE IF NOT EXISTS "Recruters" (
        "id" INTEGER NOT NULL,
        "first_name" TEXT NOT NULL,
        "last_name" TEXT NOT NULL,
        "password" INTEGER NOT NULL,
        "email" TEXT NOT NULL,
        "registration_date" DATE NOT NULL,
        "photo" TEXT,
        "department" INTEGER,
        PRIMARY KEY("id")
    );
    `;

    const createVacanciesTable = `
    CREATE TABLE IF NOT EXISTS "Vacancies" (
        "id" INTEGER NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "creation_date" DATE NOT NULL,
        "closing_date" DATE NOT NULL,
        "status" TEXT NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
    );
    `;

    const createResumesTable = `
    CREATE TABLE IF NOT EXISTS "Resumes" (
        "id" INTEGER NOT NULL,
        "vacancy_id" INTEGER NOT NULL,
        "recruiter_id" INTEGER NOT NULL,
        "processing_date" DATE NOT NULL,
        "status" TEXT NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT),
        FOREIGN KEY("recruiter_id") REFERENCES "Recruters"("id"),
        FOREIGN KEY("vacancy_id") REFERENCES "Vacancies"("id")
    );
    `;

    const createInterviewTable = `
    CREATE TABLE IF NOT EXISTS "Interview" (
        "id" INTEGER NOT NULL,
        "recruiter_id" INTEGER,
        "resume_id" INTEGER NOT NULL,
        "scheduled_time" TIMESTAMP,
        "status" TEXT,
        PRIMARY KEY("id" AUTOINCREMENT),
        FOREIGN KEY("resume_id") REFERENCES "Resumes"("id")
    );
    `;

    const createMetricsTable = `
    CREATE TABLE IF NOT EXISTS "Metrics" (
        "id" INTEGER NOT NULL,
        "vacancy_id" INTEGER NOT NULL,
        "processed_resumes" INTEGER NOT NULL,
        "conducted_interviews" INTEGER NOT NULL,
        "average_closing_time" INTEGER NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT),
        FOREIGN KEY("vacancy_id") REFERENCES "Vacancies"("id")
    );
    `;

    const createRecrutersMetricsTable = `
    CREATE TABLE IF NOT EXISTS "RecrutersMetrics" (
        "id" INTEGER NOT NULL,
        "recruiter_id" INTEGER NOT NULL,
        "processed_resumes" INTEGER NOT NULL,
        "open_resumes" INTEGER NOT NULL,
        "close_resumes" INTEGER NOT NULL,
        "conducted_interviews" INTEGER NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT),
        FOREIGN KEY("recruiter_id") REFERENCES "Recruters"("id")
    );
    `;

    db.run(createRecrutersTable, (err) => {
        if (err) {
            console.error('Error creating Recruters table:', err);
        } else {
            console.log('Recruters table created successfully');
        }
    });

    db.run(createVacanciesTable, (err) => {
        if (err) {
            console.error('Error creating Vacancies table:', err);
        } else {
            console.log('Vacancies table created successfully');
        }
    });

    db.run(createResumesTable, (err) => {
        if (err) {
            console.error('Error creating Resumes table:', err);
        } else {
            console.log('Resumes table created successfully');
        }
    });

    db.run(createInterviewTable, (err) => {
        if (err) {
            console.error('Error creating Interview table:', err);
        } else {
            console.log('Interview table created successfully');
        }
    });

    db.run(createMetricsTable, (err) => {
        if (err) {
            console.error('Error creating Metrics table:', err);
        } else {
            console.log('Metrics table created successfully');
        }
    });

    db.run(createRecrutersMetricsTable, (err) => {
        if (err) {
            console.error('Error creating RecrutersMetrics table:', err);
        } else {
            console.log('RecrutersMetrics table created successfully');
        }
    });
});

class Recruter {
    static allRecruters(cb) {
        db.all("SELECT * FROM Recruters", cb);
    }

    static addRecruter(first_name, last_name, password, email, registration_date, cb) {
        const sql = "INSERT INTO Recruters (first_name, last_name, password, email, registration_date, photo) VALUES (?, ?, ?, ?, ?, ?)";
        db.run(sql, first_name, last_name, password, email, registration_date, '2.jpg', cb);
    }

    static findByEmail(email, cb) {
        db.get("SELECT * FROM Recruters WHERE email = ?", [email], cb);
    }

    static updateRecruter(id, first_name, last_name, password, email, registration_date, cb) {
        const sql = "UPDATE Recruters SET first_name = ?, last_name = ?, password = ?, email = ?, registration_date = ? WHERE id = ?";
        db.run(sql, first_name, last_name, password, email, registration_date, id, cb);
    }

    static deleteRecruter(id, cb) {
        const sql = "DELETE FROM Recruters WHERE id = ?";
        db.run(sql, id, cb);
    }
}

class Vacancy {
    static allVacancies(cb) {
        db.all("SELECT * FROM Vacancies", cb);
    }

    static addVacancy(title, description, type, creation_date, closing_date, status, cb) {
        const sql = "INSERT INTO Vacancies (title, description, type, creation_date, closing_date, status) VALUES (?, ?, ?, ?, ?, ?)";
        db.run(sql, title, description, type, creation_date, closing_date, status, cb);
    }

    static updateVacancy(id, title, description, type, creation_date, closing_date, status, cb) {
        const sql = "UPDATE Vacancies SET title = ?, description = ?, type = ?, creation_date = ?, closing_date = ?, status = ? WHERE id = ?";
        db.run(sql, title, description, type, creation_date, closing_date, status, id, cb);
    }

    static deleteVacancy(id, cb) {
        const sql = "DELETE FROM Vacancies WHERE id = ?";
        db.run(sql, id, cb);
    }
}

class Resume {
    static allResumes(cb) {
        db.all("SELECT * FROM Resumes", cb);
    }

    static addResume(vacancy_id, recruiter_id, processing_date, status, cb) {
        const sql = "INSERT INTO Resumes (vacancy_id, recruiter_id, processing_date, status) VALUES (?, ?, ?, ?)";
        db.run(sql, vacancy_id, recruiter_id, processing_date, status, cb);
    }

    static updateResume(id, vacancy_id, recruiter_id, processing_date, status, cb) {
        const sql = "UPDATE Resumes SET vacancy_id = ?, recruiter_id = ?, processing_date = ?, status = ? WHERE id = ?";
        db.run(sql, vacancy_id, recruiter_id, processing_date, status, id, cb);
    }

    static deleteResume(id, cb) {
        const sql = "DELETE FROM Resumes WHERE id = ?";
        db.run(sql, id, cb);
    }
    static findByRecruiterIdAndSubmissionDate(recruiter_id, processing_date, cb) {
        const sql = "SELECT COUNT(*) as count FROM Resumes WHERE recruiter_id = ? AND processing_date = ?";
        db.get(sql, [recruiter_id,processing_date], cb);
    }

    static findByRecruiterIdSubmissionDateAndStatus(recruiter_id, processing_date, status, cb) {
        const sql = "SELECT COUNT(*) as count FROM Resumes WHERE recruiter_id = ? AND processing_date = ? AND status = ?";
        db.get(sql, [recruiter_id, processing_date, status], cb);
    }
}

class Interview {
    static allInterviews(cb) {
        db.all("SELECT * FROM Interview", cb);
    }

    static addInterview(resume_id, recruiter_id, scheduled_time, status, cb) {
        const sql = "INSERT INTO Interview (resume_id, recruiter_id, scheduled_time, status) VALUES (?, ?, ?, ?)";
        db.run(sql, resume_id, recruiter_id, scheduled_time, status, cb);
    }

    static updateInterview(resume_id, recruiter_id, scheduled_time, status, cb) {
        const sql = "UPDATE Interview SET resume_id = ?, scheduled_time = ?, status = ? WHERE id = ?";
        db.run(sql, resume_id, recruiter_id, scheduled_time, status, cb);
    }

    static deleteInterview(id, cb) {
        const sql = "DELETE FROM Interview WHERE id = ?";
        db.run(sql, id, cb);
    }
    static findByIndex(index, cb) {
        const sql = "SELECT COUNT(*) as count FROM Interview WHERE id = ?";
        db.get(sql, [index], cb);
    }
}

class Metric {
    static allMetrics(cb) {
        db.all("SELECT * FROM Metrics", cb);
    }

    static addMetric(vacancy_id, processed_resumes, conducted_interviews, average_closing_time, cb) {
        const sql = "INSERT INTO Metrics (vacancy_id, processed_resumes, conducted_interviews, average_closing_time) VALUES (?, ?, ?, ?)";
        db.run(sql, vacancy_id, processed_resumes, conducted_interviews, average_closing_time, cb);
    }

    static updateMetric(id, vacancy_id, processed_resumes, conducted_interviews, average_closing_time, cb) {
        const sql = "UPDATE Metrics SET vacancy_id = ?, processed_resumes = ?, conducted_interviews = ?, average_closing_time = ? WHERE id = ?";
        db.run(sql, vacancy_id, processed_resumes, conducted_interviews, average_closing_time, id, cb);
    }

    static deleteMetric(id, cb) {
        const sql = "DELETE FROM Metrics WHERE id = ?";
        db.run(sql, id, cb);
    }
}

class RecruterMetric {
    static allRecruterMetrics(cb) {
        db.all("SELECT * FROM RecrutersMetrics", cb);
    }

    static addRecruterMetric(recruiter_id, processed_resumes, open_resumes, close_resumes, conducted_interviews, cb) {
        const sql = "INSERT INTO RecrutersMetrics (recruiter_id, processed_resumes, open_resumes, close_resumes, conducted_interviews) VALUES (?, ?, ?, ?, ?)";
        db.run(sql, recruiter_id, processed_resumes, open_resumes, close_resumes, conducted_interviews, cb);
    }

    static updateRecruterMetric(id, recruiter_id, processed_resumes, open_resumes, close_resumes, conducted_interviews, cb) {
        const sql = "UPDATE RecrutersMetrics SET recruiter_id = ?, processed_resumes = ?, open_resumes = ?, close_resumes = ?, conducted_interviews = ? WHERE id = ?";
        db.run(sql, recruiter_id, processed_resumes, open_resumes, close_resumes, conducted_interviews, id, cb);
    }

    static deleteRecruterMetric(id, cb) {
        const sql = "DELETE FROM RecrutersMetrics WHERE id = ?";
        db.run(sql, id, cb);
    }
}

export { db, Recruter, Vacancy, Resume, Interview, Metric, RecruterMetric };

