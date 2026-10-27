"""
Local File Implementation of IStudentRepository.
Stores student profiles, submission history, and analytics in local JSON files.
"""
import json
import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from app.repositories.base import IStudentRepository
from app.schemas.models import (
    StudentProfile,
    SubmissionHistoryItem,
    CorrectionResult,
    StudentAnalytics,
    RecurringIssue
)

class LocalFileStudentRepository(IStudentRepository):
    def __init__(self, storage_dir: Optional[str] = None):
        if not storage_dir:
            storage_dir = os.path.join(os.path.dirname(__file__), "..", "data", "storage")
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)
        self.profiles_path = os.path.join(self.storage_dir, "profiles.json")
        self.submissions_path = os.path.join(self.storage_dir, "submissions.json")
        self._init_files()

    def _init_files(self):
        if not os.path.exists(self.profiles_path):
            default_profile = {
                "id": "default",
                "name": "Meu Perfil",
                "created_at": datetime.now().isoformat(),
                "avatar_color": "#10B981"
            }
            with open(self.profiles_path, "w", encoding="utf-8") as f:
                json.dump([default_profile], f, ensure_ascii=False, indent=2)

        if not os.path.exists(self.submissions_path):
            with open(self.submissions_path, "w", encoding="utf-8") as f:
                json.dump([], f, ensure_ascii=False, indent=2)

    async def create_profile(self, name: str) -> StudentProfile:
        profiles = await self.get_profiles()
        new_profile = StudentProfile(
            id=f"prof-{uuid.uuid4().hex[:8]}",
            name=name.strip() or "Estudante",
            created_at=datetime.now(),
            avatar_color="#3B82F6"
        )
        profiles.append(new_profile)
        with open(self.profiles_path, "w", encoding="utf-8") as f:
            json.dump([p.model_dump(mode="json") for p in profiles], f, ensure_ascii=False, indent=2)
        return new_profile

    async def get_profiles(self) -> List[StudentProfile]:
        try:
            with open(self.profiles_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return [StudentProfile(**item) for item in data]
        except Exception:
            return [StudentProfile(id="default", name="Meu Perfil", created_at=datetime.now())]

    async def delete_profile(self, profile_id: str) -> List[StudentProfile]:
        profiles = [p for p in await self.get_profiles() if p.id != profile_id]
        if not profiles:
            profiles = [StudentProfile(id="default", name="Meu Perfil", created_at=datetime.now(), avatar_color="#10B981")]
        with open(self.profiles_path, "w", encoding="utf-8") as f:
            json.dump([p.model_dump(mode="json") for p in profiles], f, ensure_ascii=False, indent=2)

        try:
            with open(self.submissions_path, "r", encoding="utf-8") as f:
                submissions = json.load(f)
            filtered_subs = [s for s in submissions if s.get("profile_id") != profile_id]
            with open(self.submissions_path, "w", encoding="utf-8") as f:
                json.dump(filtered_subs, f, ensure_ascii=False, indent=2)
        except Exception:
            pass
        return profiles

    async def save_submission(self, profile_id: str, result: CorrectionResult) -> str:
        with open(self.submissions_path, "r", encoding="utf-8") as f:
            submissions = json.load(f)

        data = result.model_dump(mode="json")
        data["profile_id"] = profile_id
        submissions.append(data)

        with open(self.submissions_path, "w", encoding="utf-8") as f:
            json.dump(submissions, f, ensure_ascii=False, indent=2)

        return result.id

    async def get_history(self, profile_id: str) -> List[SubmissionHistoryItem]:
        with open(self.submissions_path, "r", encoding="utf-8") as f:
            submissions = json.load(f)

        user_subs = [s for s in submissions if s.get("profile_id") == profile_id]
        history = []
        for s in user_subs:
            scores = s.get("competency_scores", {})
            history.append(SubmissionHistoryItem(
                id=s["id"],
                timestamp=datetime.fromisoformat(s["timestamp"]) if isinstance(s["timestamp"], str) else s["timestamp"],
                theme=s["theme"],
                total_score=s["total_score"],
                c1=scores.get("C1", {}).get("score", 0),
                c2=scores.get("C2", {}).get("score", 0),
                c3=scores.get("C3", {}).get("score", 0),
                c4=scores.get("C4", {}).get("score", 0),
                c5=scores.get("C5", {}).get("score", 0),
                word_count=s.get("metrics", {}).get("total_words", 0)
            ))
        history.sort(key=lambda x: x.timestamp, reverse=True)
        return history

    async def get_submission_detail(self, submission_id: str) -> Optional[CorrectionResult]:
        with open(self.submissions_path, "r", encoding="utf-8") as f:
            submissions = json.load(f)
        for s in submissions:
            if s.get("id") == submission_id:
                return CorrectionResult(**s)
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

        # Progression chronologically
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

        # Check recurring issues from actual annotations
        with open(self.submissions_path, "r", encoding="utf-8") as f:
            submissions = json.load(f)
        user_subs = [s for s in submissions if s.get("profile_id") == profile_id]

        issue_counts: Dict[str, Dict[str, Any]] = {}
        for s in user_subs:
            for ann in s.get("annotations", []):
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
