"""
Central Dependency Provider for Repository Instances.
Ensures single-instance connection to the local SQLite database.
"""
from app.repositories.sqlite_repository import SqliteEnemRepository

_repository_instance: SqliteEnemRepository = None

def get_enem_repository() -> SqliteEnemRepository:
    global _repository_instance
    if _repository_instance is None:
        _repository_instance = SqliteEnemRepository()
    return _repository_instance
