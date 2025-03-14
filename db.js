import sqlite3 from 'sqlite3';
const dbname = 'later.sqlite';
const db = new sqlite3.Database(dbname);

db.serialize(() => {
    const createHRManagerTable = `
    CREATE TABLE IF NOT EXISTS "HRManager" (
        "id" INTEGER NOT NULL PRIMARY KEY,
        "first_name" TEXT NOT NULL,
        "last_name" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "photo" TEXT,
        "department" INTEGER NOT NULL
    );
    `;

    const createDepartmentTable = `
    CREATE TABLE IF NOT EXISTS "Department" (
        "id" INTEGER NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "director_id" INTEGER NOT NULL,
        FOREIGN KEY("director_id") REFERENCES "HRManager"("id")
    );
    `;

    const createRecruitersTable = `
    CREATE TABLE IF NOT EXISTS "Recruiters" (
        "id" INTEGER NOT NULL PRIMARY KEY,
        "first_name" TEXT NOT NULL,
        "last_name" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "registration_date" DATE NOT NULL,
        "photo" TEXT,
        "department" INTEGER,
        FOREIGN KEY("department") REFERENCES "Department"("id")
    );
    `;

    const createVacanciesTable = `
    CREATE TABLE IF NOT EXISTS "Vacancies" (
        "id" INTEGER NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "creation_date" DATE NOT NULL,
        "closing_date" DATE NOT NULL,
        "status" TEXT NOT NULL
    );
    `;

    const createResumesTable = `
    CREATE TABLE IF NOT EXISTS "Resumes" (
        "id" INTEGER NOT NULL PRIMARY KEY,
        "vacancy_id" INTEGER NOT NULL,
        "recruiter_id" INTEGER NOT NULL,
        "processing_date" DATE NOT NULL,
        "status" TEXT NOT NULL,
        FOREIGN KEY("recruiter_id") REFERENCES "Recruiters"("id"),
        FOREIGN KEY("vacancy_id") REFERENCES "Vacancies"("id")
    );
    `;

    const createInterviewTable = `
    CREATE TABLE IF NOT EXISTS "Interview" (
        "id" INTEGER NOT NULL PRIMARY KEY,
        "recruiter_id" INTEGER,
        "resume_id" INTEGER NOT NULL,
        "scheduled_time" TIMESTAMP,
        "status" TEXT,
        FOREIGN KEY("resume_id") REFERENCES "Resumes"("id")
    );
    `;

    const createMetricsTable = `
    CREATE TABLE IF NOT EXISTS "Metrics" (
        "id" INTEGER NOT NULL PRIMARY KEY,
        "recruiter_id" INTEGER NOT NULL,
        "processed_resumes" INTEGER NOT NULL,
        "accepted_resumes" INTEGER NOT NULL,
        "rejected_resumes" INTEGER NOT NULL,
        "conducted_interviews" INTEGER NOT NULL,
        "average_closing_time" INTEGER NOT NULL,
        "vacancy_id" INTEGER NOT NULL,
        FOREIGN KEY("recruiter_id") REFERENCES "Recruiters"("id"),
        FOREIGN KEY("vacancy_id") REFERENCES "Vacancies"("id")
    );
    `;

    const tables = [
        { sql: createHRManagerTable, name: 'HRManager' },
        { sql: createDepartmentTable, name: 'Department' },
        { sql: createRecruitersTable, name: 'Recruiters' },
        { sql: createVacanciesTable, name: 'Vacancies' },
        { sql: createResumesTable, name: 'Resumes' },
        { sql: createInterviewTable, name: 'Interview' },
        { sql: createMetricsTable, name: 'Metrics' }
    ];

    tables.forEach(({ sql, name }) => {
        db.run(sql, (err) => {
            if (err) {
                console.error(`Error creating ${name} table:`, err);
                process.exit(1); // Останавливаем выполнение скрипта при ошибке
            } else {
                console.log(`${name} table created successfully`);
            }
        });
    });
});

class HRManager {
    static all(cb) {
        db.all("SELECT * FROM HRManager", cb);
    }

    static add(first_name, last_name, password, email, department, photo = null, cb) {
        const sql = `
            INSERT INTO HRManager (first_name, last_name, password, email, department, photo)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.run(sql, [first_name, last_name, password, email, department, photo], cb);
    }

    static findById(id, cb) {
        db.get("SELECT * FROM HRManager WHERE id = ?", [id], cb);
    }

    static findByEmail(email, cb) {
        db.get("SELECT * FROM HRManager WHERE email = ?", [email], cb);
    }

    static update(id, first_name, last_name, password, email, department, photo = null, cb) {
        const sql = `
            UPDATE HRManager
            SET first_name = ?, last_name = ?, password = ?, email = ?, department = ?, photo = ?
            WHERE id = ?
        `;
        db.run(sql, [first_name, last_name, password, email, department, photo, id], cb);
    }

    static delete(id, cb) {
        db.run("DELETE FROM HRManager WHERE id = ?", [id], cb);
    }
}

class Department {
    static all(cb) {
        db.all("SELECT * FROM Department", cb);
    }

    static add(name, director_id, cb) {
        const sql = `
            INSERT INTO Department (name, director_id)
            VALUES (?, ?)
        `;
        db.run(sql, [name, director_id], cb);
    }

    static findById(id, cb) {
        db.get("SELECT * FROM Department WHERE id = ?", [id], cb);
    }

    static update(id, name, director_id, cb) {
        const sql = `
            UPDATE Department
            SET name = ?, director_id = ?
            WHERE id = ?
        `;
        db.run(sql, [name, director_id, id], cb);
    }

    static delete(id, cb) {
        db.run("DELETE FROM Department WHERE id = ?", [id], cb);
    }
}

class Recruiter {
    static all(cb) {
        db.all("SELECT * FROM Recruiters", cb);
    }

    static add(first_name, last_name, password, email, registration_date, department = null, photo = null, cb) {
        const sql = `
            INSERT INTO Recruiters (first_name, last_name, password, email, registration_date, department, photo)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(sql, [first_name, last_name, password, email, registration_date, department, photo], cb);
    }

    static findById(id, cb) {
        db.get("SELECT * FROM Recruiters WHERE id = ?", [id], cb);
    }

    static findByEmail(email, cb) {
        db.get("SELECT * FROM Recruiters WHERE email = ?", [email], cb);
    }

    static update(id, first_name, last_name, password, email, registration_date, department = null, photo = null, cb) {
        const sql = `
            UPDATE Recruiters
            SET first_name = ?, last_name = ?, password = ?, email = ?, registration_date = ?, department = ?, photo = ?
            WHERE id = ?
        `;
        db.run(sql, [first_name, last_name, password, email, registration_date, department, photo, id], cb);
    }

    static delete(id, cb) {
        db.run("DELETE FROM Recruiters WHERE id = ?", [id], cb);
    }
}

class Vacancy {
    static all(cb) {
        db.all("SELECT * FROM Vacancies", cb);
    }

    static add(title, description, type, creation_date, closing_date, status, cb) {
        const sql = `
            INSERT INTO Vacancies (title, description, type, creation_date, closing_date, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.run(sql, [title, description, type, creation_date, closing_date, status], cb);
    }

    static findById(id, cb) {
        db.get("SELECT * FROM Vacancies WHERE id = ?", [id], cb);
    }

    static update(id, title, description, type, creation_date, closing_date, status, cb) {
        const sql = `
            UPDATE Vacancies
            SET title = ?, description = ?, type = ?, creation_date = ?, closing_date = ?, status = ?
            WHERE id = ?
        `;
        db.run(sql, [title, description, type, creation_date, closing_date, status, id], cb);
    }

    static delete(id, cb) {
        db.run("DELETE FROM Vacancies WHERE id = ?", [id], cb);
    }
}

class Resume {
    static all(cb) {
        db.all("SELECT * FROM Resumes", cb);
    }

    static add(vacancy_id, recruiter_id, processing_date, status, cb) {
        const sql = `
            INSERT INTO Resumes (vacancy_id, recruiter_id, processing_date, status)
            VALUES (?, ?, ?, ?)
        `;
        db.run(sql, [vacancy_id, recruiter_id, processing_date, status], cb);
    }

    static findById(id, cb) {
        db.get("SELECT * FROM Resumes WHERE id = ?", [id], cb);
    }

    static findByRecruiterId(recruiter_id, cb) {
        db.all("SELECT * FROM Resumes WHERE recruiter_id = ?", [recruiter_id], cb);
    }

    static update(id, vacancy_id, recruiter_id, processing_date, status, cb) {
        const sql = `
            UPDATE Resumes
            SET vacancy_id = ?, recruiter_id = ?, processing_date = ?, status = ?
            WHERE id = ?
        `;
        db.run(sql, [vacancy_id, recruiter_id, processing_date, status, id], cb);
    }

    static delete(id, cb) {
        db.run("DELETE FROM Resumes WHERE id = ?", [id], cb);
    }
}

class Interview {
    static all(cb) {
        db.all("SELECT * FROM Interview", cb);
    }

    static add(resume_id, recruiter_id, scheduled_time, status, cb) {
        const sql = `
            INSERT INTO Interview (resume_id, recruiter_id, scheduled_time, status)
            VALUES (?, ?, ?, ?)
        `;
        db.run(sql, [resume_id, recruiter_id, scheduled_time, status], cb);
    }

    static findById(id, cb) {
        db.get("SELECT * FROM Interview WHERE id = ?", [id], cb);
    }

    static findByResumeId(resume_id, cb) {
        db.all("SELECT * FROM Interview WHERE resume_id = ?", [resume_id], cb);
    }

    static update(id, resume_id, recruiter_id, scheduled_time, status, cb) {
        const sql = `
            UPDATE Interview
            SET resume_id = ?, recruiter_id = ?, scheduled_time = ?, status = ?
            WHERE id = ?
        `;
        db.run(sql, [resume_id, recruiter_id, scheduled_time, status, id], cb);
    }

    static delete(id, cb) {
        db.run("DELETE FROM Interview WHERE id = ?", [id], cb);
    }
}

class Metric {
    static all(cb) {
        db.all("SELECT * FROM Metrics", cb);
    }

    static add(recruiter_id, processed_resumes, accepted_resumes, rejected_resumes, conducted_interviews, average_closing_time, vacancy_id, cb) {
        const sql = `
            INSERT INTO Metrics (recruiter_id, processed_resumes, accepted_resumes, rejected_resumes, conducted_interviews, average_closing_time, vacancy_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(sql, [recruiter_id, processed_resumes, accepted_resumes, rejected_resumes, conducted_interviews, average_closing_time, vacancy_id], cb);
    }

    static findById(id, cb) {
        db.get("SELECT * FROM Metrics WHERE id = ?", [id], cb);
    }

    static findByRecruiterId(recruiter_id, cb) {
        db.all("SELECT * FROM Metrics WHERE recruiter_id = ?", [recruiter_id], cb);
    }

    static update(id, recruiter_id, processed_resumes, accepted_resumes, rejected_resumes, conducted_interviews, average_closing_time, vacancy_id, cb) {
        const sql = `
            UPDATE Metrics
            SET recruiter_id = ?, processed_resumes = ?, accepted_resumes = ?, rejected_resumes = ?, conducted_interviews = ?, average_closing_time = ?, vacancy_id = ?
            WHERE id = ?
        `;
        db.run(sql, [recruiter_id, processed_resumes, accepted_resumes, rejected_resumes, conducted_interviews, average_closing_time, vacancy_id, id], cb);
    }

    static delete(id, cb) {
        db.run("DELETE FROM Metrics WHERE id = ?", [id], cb);
    }
}

export { db, HRManager, Department, Recruiter, Vacancy, Resume, Interview, Metric };

