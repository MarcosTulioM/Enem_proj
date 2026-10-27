"""
RAG Engine: Semantic Similarity Search over the 100+ Nota 1000 Real Essays Dataset.
Enables instant retrieval of exemplar essays, productive repertoires, and structural benchmarks.
"""
import json
import os
import re
from typing import List, Dict, Any, Optional
from app.schemas.models import Redacao1000

class RAGEngine:
    def __init__(self, corpus_path: Optional[str] = None):
        if not corpus_path:
            corpus_path = os.path.join(os.path.dirname(__file__), "..", "data", "corpus", "redacoes_nota_1000.json")
        self.corpus_path = corpus_path
        self.essays: List[Dict[str, Any]] = []
        self._load_corpus()

    def _load_corpus(self):
        if os.path.exists(self.corpus_path):
            with open(self.corpus_path, "r", encoding="utf-8") as f:
                self.essays = json.load(f)
        else:
            self.essays = []

    def get_all_essays(self) -> List[Dict[str, Any]]:
        return self.essays

    def get_essay_by_id(self, essay_id: str) -> Optional[Dict[str, Any]]:
        for e in self.essays:
            if e["id"] == essay_id:
                return e
        return None

    def search_similar_essays(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        if not self.essays:
            return []

        query_tokens = set(re.findall(r"\b\w{4,}\b", query.lower()))
        if not query_tokens:
            return self.essays[:top_k]

        scored_essays = []
        for e in self.essays:
            # Score based on theme, repertoire categories, and full text matching
            theme_tokens = set(re.findall(r"\b\w{4,}\b", e["theme"].lower()))
            text_tokens = set(re.findall(r"\b\w{4,}\b", e["full_text"].lower()))
            rep_tokens = set(re.findall(r"\b\w{4,}\b", " ".join(e.get("repertoire_categories", [])).lower()))

            theme_overlap = len(query_tokens.intersection(theme_tokens)) * 4.0
            rep_overlap = len(query_tokens.intersection(rep_tokens)) * 2.0
            text_overlap = len(query_tokens.intersection(text_tokens)) * 0.5

            score = theme_overlap + rep_overlap + text_overlap
            scored_essays.append((score, e))

        scored_essays.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored_essays[:top_k]]

    def filter_essays(
        self,
        year: Optional[int] = None,
        repertoire_category: Optional[str] = None,
        c5_agent: Optional[str] = None,
        search_term: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        results = self.essays
        if year:
            results = [e for e in results if e.get("year") == year]
        if repertoire_category:
            results = [e for e in results if any(repertoire_category.lower() in cat.lower() for cat in e.get("repertoire_categories", []))]
        if c5_agent:
            results = [e for e in results if c5_agent.lower() in str(e.get("c5_agent_type", "")).lower()]
        if search_term:
            term = search_term.lower()
            results = [
                e for e in results
                if term in e.get("theme", "").lower()
                or term in e.get("author", "").lower()
                or term in e.get("full_text", "").lower()
            ]
        return results
