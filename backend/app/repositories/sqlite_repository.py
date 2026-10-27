"""
SQLite Local Repository implementation for ENEM Platform.
Stores:
- User Profiles
- Essay Submissions & Evaluations
- Official ENEM Questions Database
- Simulated Exam Sessions & Answers
- 3-Method Performance Analytics (Raw %, Estimated TRI, Weakness Radar)
"""
import sqlite3
import json
import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any, Tuple

from app.repositories.base import IStudentRepository
from app.schemas.models import (
    StudentProfile,
    SubmissionHistoryItem,
    CorrectionResult,
    StudentAnalytics,
    RecurringIssue,
    EnemQuestion,
    SubjectInfo,
    SimulatedAnswerItem,
    QuestionFeedbackResult,
    SimulatedSessionResult,
    SimulatedHistoryItem
)
from app.data.questions.questions_seed import QUESTIONS_DATA, SUBJECTS_INFO


class SqliteEnemRepository(IStudentRepository):
    def __init__(self, db_path: Optional[str] = None):
        if not db_path:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
            os.makedirs(base_dir, exist_ok=True)
            db_path = os.path.join(base_dir, "enem_local.db")
        self.db_path = db_path
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()

            # 1. Profiles Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_profiles (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                created_at TEXT NOT NULL,
                avatar_color TEXT DEFAULT '#10B981',
                hints_enabled_default INTEGER DEFAULT 1
            )
            """)

            # 2. Essay Submissions Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS essay_submissions (
                id TEXT PRIMARY KEY,
                profile_id TEXT NOT NULL,
                theme TEXT NOT NULL,
                total_score INTEGER NOT NULL,
                c1 INTEGER NOT NULL,
                c2 INTEGER NOT NULL,
                c3 INTEGER NOT NULL,
                c4 INTEGER NOT NULL,
                c5 INTEGER NOT NULL,
                word_count INTEGER NOT NULL,
                raw_json TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                FOREIGN KEY(profile_id) REFERENCES user_profiles(id)
            )
            """)

            # 3. Official ENEM Questions Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS enem_questions (
                id TEXT PRIMARY KEY,
                year INTEGER NOT NULL,
                exam_day INTEGER NOT NULL,
                area TEXT NOT NULL,
                subject TEXT NOT NULL,
                topic TEXT NOT NULL,
                statement TEXT NOT NULL,
                context_text TEXT,
                option_a TEXT NOT NULL,
                option_b TEXT NOT NULL,
                option_c TEXT NOT NULL,
                option_d TEXT NOT NULL,
                option_e TEXT NOT NULL,
                correct_option TEXT NOT NULL,
                explanation TEXT NOT NULL,
                distractor_analysis TEXT NOT NULL,
                difficulty_tri TEXT NOT NULL,
                historical_success_rate INTEGER NOT NULL,
                golden_tip TEXT NOT NULL
            )
            """)

            # 4. Simulated Sessions Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS simulated_sessions (
                id TEXT PRIMARY KEY,
                profile_id TEXT NOT NULL,
                exam_day INTEGER,
                area_or_subject TEXT NOT NULL,
                total_questions INTEGER NOT NULL,
                correct_count INTEGER NOT NULL,
                raw_accuracy_percentage REAL NOT NULL,
                estimated_tri_score REAL NOT NULL,
                duration_seconds INTEGER NOT NULL,
                timestamp TEXT NOT NULL,
                FOREIGN KEY(profile_id) REFERENCES user_profiles(id)
            )
            """)

            # 5. User Question Answers (For tracking non-repetition and stats)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_question_answers (
                id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                profile_id TEXT NOT NULL,
                question_id TEXT NOT NULL,
                chosen_option TEXT NOT NULL,
                is_correct INTEGER NOT NULL,
                answered_at TEXT NOT NULL,
                FOREIGN KEY(session_id) REFERENCES simulated_sessions(id),
                FOREIGN KEY(question_id) REFERENCES enem_questions(id)
            )
            """)

            # Seed default profile if none exists
            cursor.execute("SELECT COUNT(*) as count FROM user_profiles")
            if cursor.fetchone()["count"] == 0:
                cursor.execute("""
                INSERT INTO user_profiles (id, name, created_at, avatar_color)
                VALUES (?, ?, ?, ?)
                """, ("default", "Estudante ENEM", datetime.now().isoformat(), "#10B981"))

            # Seed Questions if empty
            cursor.execute("SELECT COUNT(*) as count FROM enem_questions")
            if cursor.fetchone()["count"] == 0:
                for q in QUESTIONS_DATA:
                    cursor.execute("""
                    INSERT INTO enem_questions (
                        id, year, exam_day, area, subject, topic, statement, context_text,
                        option_a, option_b, option_c, option_d, option_e,
                        correct_option, explanation, distractor_analysis,
                        difficulty_tri, historical_success_rate, golden_tip
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        q["id"], q["year"], q["exam_day"], q["area"], q["subject"], q["topic"],
                        q["statement"], q.get("context_text"),
                        q["option_a"], q["option_b"], q["option_c"], q["option_d"], q["option_e"],
                        q["correct_option"], q["explanation"], json.dumps(q.get("distractor_analysis", {}), ensure_ascii=False),
                        q["difficulty_tri"], q["historical_success_rate"], q["golden_tip"]
                    ))

            conn.commit()

        # Migrate existing JSON submissions if any
        self._migrate_existing_json()

    def _migrate_existing_json(self):
        try:
            storage_dir = os.path.join(os.path.dirname(__file__), "..", "data", "storage")
            subs_json = os.path.join(storage_dir, "submissions.json")
            if os.path.exists(subs_json):
                with open(subs_json, "r", encoding="utf-8") as f:
                    submissions = json.load(f)
                with self._get_connection() as conn:
                    cursor = conn.cursor()
                    for s in submissions:
                        cursor.execute("SELECT id FROM essay_submissions WHERE id = ?", (s["id"],))
                        if not cursor.fetchone():
                            scores = s.get("competency_scores", {})
                            c1 = scores.get("C1", {}).get("score", 0)
                            c2 = scores.get("C2", {}).get("score", 0)
                            c3 = scores.get("C3", {}).get("score", 0)
                            c4 = scores.get("C4", {}).get("score", 0)
                            c5 = scores.get("C5", {}).get("score", 0)
                            words = s.get("metrics", {}).get("total_words", 0)
                            cursor.execute("""
                            INSERT INTO essay_submissions (
                                id, profile_id, theme, total_score, c1, c2, c3, c4, c5, word_count, raw_json, timestamp
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """, (
                                s["id"], s.get("profile_id", "default"), s.get("theme", ""),
                                s.get("total_score", 0), c1, c2, c3, c4, c5, words,
                                json.dumps(s, ensure_ascii=False), s.get("timestamp", datetime.now().isoformat())
                            ))
                    conn.commit()
        except Exception:
            pass

    # ==============================================================
    # IStudentRepository (Essay & Profiles Implementation)
    # ==============================================================

    async def create_profile(self, name: str) -> StudentProfile:
        prof_id = f"prof-{uuid.uuid4().hex[:8]}"
        clean_name = name.strip() or "Estudante"
        created_at = datetime.now()
        color = "#10B981"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO user_profiles (id, name, created_at, avatar_color)
            VALUES (?, ?, ?, ?)
            """, (prof_id, clean_name, created_at.isoformat(), color))
            conn.commit()
        return StudentProfile(id=prof_id, name=clean_name, created_at=created_at, avatar_color=color)

    async def get_profiles(self) -> List[StudentProfile]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, created_at, avatar_color FROM user_profiles ORDER BY created_at ASC")
            rows = cursor.fetchall()
            return [
                StudentProfile(
                    id=row["id"],
                    name=row["name"],
                    created_at=datetime.fromisoformat(row["created_at"]) if isinstance(row["created_at"], str) else row["created_at"],
                    avatar_color=row["avatar_color"]
                )
                for row in rows
            ]

    async def delete_profile(self, profile_id: str) -> List[StudentProfile]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM user_question_answers WHERE profile_id = ?", (profile_id,))
            cursor.execute("DELETE FROM simulated_sessions WHERE profile_id = ?", (profile_id,))
            cursor.execute("DELETE FROM essay_submissions WHERE profile_id = ?", (profile_id,))
            cursor.execute("DELETE FROM user_profiles WHERE id = ?", (profile_id,))

            cursor.execute("SELECT COUNT(*) as cnt FROM user_profiles")
            row = cursor.fetchone()
            if not row or row["cnt"] == 0:
                cursor.execute("""
                INSERT INTO user_profiles (id, name, created_at, avatar_color)
                VALUES (?, ?, ?, ?)
                """, ("default", "Estudante ENEM", datetime.now().isoformat(), "#10B981"))
            conn.commit()
        return await self.get_profiles()

    async def save_submission(self, profile_id: str, result: CorrectionResult) -> str:
        data_json = result.model_dump_json()
        scores = result.competency_scores
        c1 = scores.get("C1").score if scores.get("C1") else 0
        c2 = scores.get("C2").score if scores.get("C2") else 0
        c3 = scores.get("C3").score if scores.get("C3") else 0
        c4 = scores.get("C4").score if scores.get("C4") else 0
        c5 = scores.get("C5").score if scores.get("C5") else 0
        words = result.metrics.total_words if result.metrics else 0

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO essay_submissions (
                id, profile_id, theme, total_score, c1, c2, c3, c4, c5, word_count, raw_json, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                result.id, profile_id, result.theme, result.total_score,
                c1, c2, c3, c4, c5, words, data_json, result.timestamp
            ))
            conn.commit()
        return result.id

    async def get_history(self, profile_id: str) -> List[SubmissionHistoryItem]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT id, theme, total_score, c1, c2, c3, c4, c5, word_count, timestamp
            FROM essay_submissions
            WHERE profile_id = ?
            ORDER BY timestamp DESC
            """, (profile_id,))
            rows = cursor.fetchall()
            return [
                SubmissionHistoryItem(
                    id=row["id"],
                    timestamp=datetime.fromisoformat(row["timestamp"]) if isinstance(row["timestamp"], str) else row["timestamp"],
                    theme=row["theme"],
                    total_score=row["total_score"],
                    c1=row["c1"],
                    c2=row["c2"],
                    c3=row["c3"],
                    c4=row["c4"],
                    c5=row["c5"],
                    word_count=row["word_count"]
                )
                for row in rows
            ]

    async def get_submission_detail(self, submission_id: str) -> Optional[CorrectionResult]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT raw_json FROM essay_submissions WHERE id = ?", (submission_id,))
            row = cursor.fetchone()
            if row:
                data = json.loads(row["raw_json"])
                return CorrectionResult(**data)
        return None

    async def get_analytics(self, profile_id: str) -> StudentAnalytics:
        history = await self.get_history(profile_id)
        if not history:
            return StudentAnalytics(
                profile_id=profile_id,
                total_essays=0,
                average_score=0.0,
                highest_score=0,
                competency_averages={"C1": 0.0, "C2": 0.0, "C3": 0.0, "C4": 0.0, "C5": 0.0},
                score_progression=[],
                strongest_competency="C1",
                focus_competency="C1",
                recurring_issues=[]
            )

        total_essays = len(history)
        avg_score = round(sum(h.total_score for h in history) / total_essays, 1)
        max_score = max(h.total_score for h in history)

        comp_sums = {"C1": 0, "C2": 0, "C3": 0, "C4": 0, "C5": 0}
        for h in history:
            comp_sums["C1"] += h.c1
            comp_sums["C2"] += h.c2
            comp_sums["C3"] += h.c3
            comp_sums["C4"] += h.c4
            comp_sums["C5"] += h.c5

        comp_avgs = {k: round(v / total_essays, 1) for k, v in comp_sums.items()}
        sorted_comps = sorted(comp_avgs.items(), key=lambda x: x[1], reverse=True)
        strongest = sorted_comps[0][0]
        focus = sorted_comps[-1][0]

        history_chronological = sorted(history, key=lambda x: x.timestamp)
        progression = [
            {
                "index": i + 1,
                "date": h.timestamp.strftime("%d/%m"),
                "score": h.total_score,
                "theme": h.theme[:35] + "..." if len(h.theme) > 35 else h.theme,
                "c1": h.c1,
                "c2": h.c2,
                "c3": h.c3,
                "c4": h.c4,
                "c5": h.c5
            }
            for i, h in enumerate(history_chronological)
        ]

        # Analyze recurring issues
        issue_counts: Dict[str, Dict[str, Any]] = {}
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT raw_json FROM essay_submissions WHERE profile_id = ?", (profile_id,))
            for row in cursor.fetchall():
                sub_data = json.loads(row["raw_json"])
                for ann in sub_data.get("annotations", []):
                    if ann.get("severity") in ["erro", "atencao"]:
                        key = ann.get("title", "Desvio")
                        if key not in issue_counts:
                            issue_counts[key] = {
                                "competency": ann.get("competency", "C1"),
                                "count": 0,
                                "tip": ann.get("layperson_tip", "")
                            }
                        issue_counts[key]["count"] += 1

        recurring = []
        for title, info in issue_counts.items():
            if info["count"] >= 2:
                recurring.append(RecurringIssue(
                    competency=info["competency"],
                    issue_type=title,
                    occurrences=info["count"],
                    description=f"Detectado em {info['count']} correções do seu histórico.",
                    pedagogical_guidance=info["tip"]
                ))

        return StudentAnalytics(
            profile_id=profile_id,
            total_essays=total_essays,
            average_score=avg_score,
            highest_score=max_score,
            competency_averages=comp_avgs,
            score_progression=progression,
            strongest_competency=strongest,
            focus_competency=focus,
            recurring_issues=recurring
        )

    # ==============================================================
    # Simulated Exams & Questions Engine
    # ==============================================================

    async def get_subjects(self) -> List[SubjectInfo]:
        return [SubjectInfo(**item) for item in SUBJECTS_INFO]

    async def get_questions(
        self,
        exam_day: Optional[int] = None,
        area: Optional[str] = None,
        subject: Optional[str] = None,
        limit: int = 10,
        profile_id: Optional[str] = None,
        avoid_already_answered: bool = False
    ) -> List[EnemQuestion]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM enem_questions WHERE 1=1"
            params: List[Any] = []

            if exam_day in [1, 2]:
                query += " AND exam_day = ?"
                params.append(exam_day)

            if area and area.lower() != "all":
                query += " AND area = ?"
                params.append(area.lower())

            if subject and subject.lower() != "all":
                query += " AND subject = ?"
                params.append(subject.lower())

            if avoid_already_answered and profile_id:
                query += """ AND id NOT IN (
                    SELECT question_id FROM user_question_answers WHERE profile_id = ?
                )"""
                params.append(profile_id)

            query += " ORDER BY RANDOM() LIMIT ?"
            params.append(limit)

            cursor.execute(query, tuple(params))
            rows = cursor.fetchall()

            # If avoid_already_answered filtered out everything, re-query without exclusion
            if not rows and avoid_already_answered:
                return await self.get_questions(
                    exam_day=exam_day, area=area, subject=subject, limit=limit,
                    profile_id=profile_id, avoid_already_answered=False
                )

            questions = []
            for r in rows:
                distractor = json.loads(r["distractor_analysis"]) if r["distractor_analysis"] else {}
                questions.append(EnemQuestion(
                    id=r["id"],
                    year=r["year"],
                    exam_day=r["exam_day"],
                    area=r["area"],
                    subject=r["subject"],
                    topic=r["topic"],
                    statement=r["statement"],
                    context_text=r["context_text"],
                    option_a=r["option_a"],
                    option_b=r["option_b"],
                    option_c=r["option_c"],
                    option_d=r["option_d"],
                    option_e=r["option_e"],
                    correct_option=r["correct_option"],
                    explanation=r["explanation"],
                    distractor_analysis=distractor,
                    difficulty_tri=r["difficulty_tri"],
                    historical_success_rate=r["historical_success_rate"],
                    golden_tip=r["golden_tip"]
                ))
            return questions

    async def submit_simulated_session(
        self,
        profile_id: str,
        exam_day: Optional[int],
        area_or_subject: str,
        answers: List[SimulatedAnswerItem],
        duration_seconds: int
    ) -> SimulatedSessionResult:
        session_id = f"sim-{uuid.uuid4().hex[:10]}"
        timestamp = datetime.now()

        # Fetch questions for evaluation
        question_ids = [a.question_id for a in answers]
        questions_dict: Dict[str, sqlite3.Row] = {}

        with self._get_connection() as conn:
            cursor = conn.cursor()
            if question_ids:
                placeholders = ",".join("?" for _ in question_ids)
                cursor.execute(f"SELECT * FROM enem_questions WHERE id IN ({placeholders})", tuple(question_ids))
                for row in cursor.fetchall():
                    questions_dict[row["id"]] = row

        feedbacks: List[QuestionFeedbackResult] = []
        correct_count = 0
        total_questions = len(answers)

        # Subject breakdown for Competency Radar (Method 3)
        subject_stats: Dict[str, Dict[str, int]] = {}

        # TRI variables (Method 2)
        easy_correct, easy_total = 0, 0
        med_correct, med_total = 0, 0
        hard_correct, hard_total = 0, 0

        with self._get_connection() as conn:
            cursor = conn.cursor()
            for ans in answers:
                q_row = questions_dict.get(ans.question_id)
                if not q_row:
                    continue

                correct_opt = q_row["correct_option"]
                is_correct = (ans.chosen_option.upper() == correct_opt.upper())
                if is_correct:
                    correct_count += 1

                # Track TRI difficulty tiers
                diff = q_row["difficulty_tri"].lower()
                if diff == "facil":
                    easy_total += 1
                    if is_correct:
                        easy_correct += 1
                elif diff == "dificil":
                    hard_total += 1
                    if is_correct:
                        hard_correct += 1
                else:
                    med_total += 1
                    if is_correct:
                        med_correct += 1

                # Track Subject Radar
                subj = q_row["subject"]
                if subj not in subject_stats:
                    subject_stats[subj] = {"correct": 0, "total": 0}
                subject_stats[subj]["total"] += 1
                if is_correct:
                    subject_stats[subj]["correct"] += 1

                distractor_dict = json.loads(q_row["distractor_analysis"]) if q_row["distractor_analysis"] else {}
                distractor_note = distractor_dict.get(ans.chosen_option.upper())

                feedback = QuestionFeedbackResult(
                    question_id=ans.question_id,
                    chosen_option=ans.chosen_option.upper(),
                    is_correct=is_correct,
                    correct_option=correct_opt,
                    explanation=q_row["explanation"],
                    distractor_note=distractor_note,
                    difficulty_tri=q_row["difficulty_tri"],
                    historical_success_rate=q_row["historical_success_rate"],
                    golden_tip=q_row["golden_tip"]
                )
                feedbacks.append(feedback)

                # Save individual answer for history and anti-repetition
                cursor.execute("""
                INSERT INTO user_question_answers (
                    id, session_id, profile_id, question_id, chosen_option, is_correct, answered_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    f"ans-{uuid.uuid4().hex[:8]}", session_id, profile_id,
                    ans.question_id, ans.chosen_option.upper(), 1 if is_correct else 0,
                    timestamp.isoformat()
                ))

            # -------------------------------------------------------------
            # Calculation of the 3 Performance Evaluation Methods:
            # -------------------------------------------------------------
            # Method 1: Raw Accuracy Percentage
            raw_accuracy = round((correct_count / max(1, total_questions)) * 100, 1)

            # Method 2: Estimated TRI Score (0 to 1000)
            # In official INEP TRI, answering hard questions correctly while missing easy questions
            # is treated as a guess/chute and receives severe penalties.
            # A coherent student gets easy > medium > hard.
            base_tri = 350.0  # Baseline ENEM floor
            points = 0.0

            # Weight by difficulty
            points += (easy_correct * 80.0)
            points += (med_correct * 120.0)
            points += (hard_correct * 160.0)

            # Coherence index (Item Response Theory penalty)
            coherence_factor = 1.0
            if hard_correct > 0 and easy_correct < (easy_total * 0.5):
                # Penalize incoherence: guessed hard question without mastering easy
                coherence_factor = 0.75
            elif easy_correct == easy_total and med_correct == med_total:
                # Reward exceptional consistency
                coherence_factor = 1.1

            estimated_tri = round(min(1000.0, max(300.0, base_tri + (points * coherence_factor))), 1)

            # Method 3: Competency Radar
            radar: Dict[str, float] = {}
            for subj, st in subject_stats.items():
                radar[subj] = round((st["correct"] / max(1, st["total"])) * 100, 1)

            # Pedagogical advice based on TRI & Radar
            if raw_accuracy >= 80:
                advice = (
                    "Excelente desempenho! Sua coerência pedagógica demonstra sólido domínio dos conceitos fundamentais "
                    "e das questões de nível médio. Para atingir os 800+ no ENEM, dedique atenção aos detalhes das questões difíceis."
                )
            elif raw_accuracy >= 50:
                advice = (
                    "Bom aproveitamento! Fique atento às questões fáceis para garantir a pontuação base da TRI (no ENEM, errar fáceis "
                    "puxa sua nota para baixo mesmo acertando difíceis). Revise os tópicos com menor taxa de acerto no radar."
                )
            else:
                advice = (
                    "Fase de consolidação: foque em identificar os comandos centrais dos enunciados e elimine os distratores óbvios. "
                    "Consulte as Dicas de Ouro e os comentários de cada questão para entender o raciocínio da banca."
                )

            # Save session to SQLite
            cursor.execute("""
            INSERT INTO simulated_sessions (
                id, profile_id, exam_day, area_or_subject, total_questions, correct_count,
                raw_accuracy_percentage, estimated_tri_score, duration_seconds, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                session_id, profile_id, exam_day, area_or_subject, total_questions,
                correct_count, raw_accuracy, estimated_tri, duration_seconds, timestamp.isoformat()
            ))
            conn.commit()

        return SimulatedSessionResult(
            session_id=session_id,
            timestamp=timestamp,
            profile_id=profile_id,
            exam_day=exam_day,
            area_or_subject=area_or_subject,
            total_questions=total_questions,
            correct_count=correct_count,
            raw_accuracy_percentage=raw_accuracy,
            estimated_tri_score=estimated_tri,
            competency_radar=radar,
            question_feedbacks=feedbacks,
            pedagogical_advice=advice
        )

    async def get_simulated_history(self, profile_id: str) -> List[SimulatedHistoryItem]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT id, timestamp, exam_day, area_or_subject, total_questions, correct_count,
                   raw_accuracy_percentage, estimated_tri_score, duration_seconds
            FROM simulated_sessions
            WHERE profile_id = ?
            ORDER BY timestamp DESC
            """, (profile_id,))
            rows = cursor.fetchall()
            return [
                SimulatedHistoryItem(
                    id=r["id"],
                    timestamp=datetime.fromisoformat(r["timestamp"]) if isinstance(r["timestamp"], str) else r["timestamp"],
                    exam_day=r["exam_day"],
                    area_or_subject=r["area_or_subject"],
                    total_questions=r["total_questions"],
                    correct_count=r["correct_count"],
                    raw_accuracy_percentage=r["raw_accuracy_percentage"],
                    estimated_tri_score=r["estimated_tri_score"],
                    duration_seconds=r["duration_seconds"]
                )
                for r in rows
            ]

    async def get_simulated_analytics(self, profile_id: str) -> Dict[str, Any]:
        history = await self.get_simulated_history(profile_id)
        if not history:
            return {
                "total_simulations": 0,
                "total_questions_answered": 0,
                "average_raw_accuracy": 0.0,
                "average_tri_score": 0.0,
                "best_tri_score": 0.0,
                "subject_accuracy": {},
                "tri_progression": []
            }

        total_sims = len(history)
        total_questions = sum(h.total_questions for h in history)
        avg_acc = round(sum(h.raw_accuracy_percentage for h in history) / total_sims, 1)
        avg_tri = round(sum(h.estimated_tri_score for h in history) / total_sims, 1)
        best_tri = max(h.estimated_tri_score for h in history)

        # Subject breakdown across all answers
        subject_stats: Dict[str, Dict[str, int]] = {}
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT q.subject, a.is_correct
            FROM user_question_answers a
            JOIN enem_questions q ON a.question_id = q.id
            WHERE a.profile_id = ?
            """, (profile_id,))
            for row in cursor.fetchall():
                subj = row["subject"]
                if subj not in subject_stats:
                    subject_stats[subj] = {"correct": 0, "total": 0}
                subject_stats[subj]["total"] += 1
                if row["is_correct"]:
                    subject_stats[subj]["correct"] += 1

        subject_radar = {
            s: round((st["correct"] / max(1, st["total"])) * 100, 1)
            for s, st in subject_stats.items()
        }

        # Chronological TRI score progression
        chronological = sorted(history, key=lambda x: x.timestamp)
        progression = [
            {
                "index": i + 1,
                "date": h.timestamp.strftime("%d/%m"),
                "tri_score": h.estimated_tri_score,
                "raw_accuracy": h.raw_accuracy_percentage,
                "area_or_subject": h.area_or_subject
            }
            for i, h in enumerate(chronological)
        ]

        return {
            "total_simulations": total_sims,
            "total_questions_answered": total_questions,
            "average_raw_accuracy": avg_acc,
            "average_tri_score": avg_tri,
            "best_tri_score": best_tri,
            "subject_accuracy": subject_radar,
            "tri_progression": progression
        }
