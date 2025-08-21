from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    completed = Column(Boolean, default=False)
    # store tags as a comma-separated string in the DB, expose as list via property
    _tags = Column("tags", String, default="")

    @property
    def tags(self):
        if not getattr(self, "_tags", None):
            return []
        return [t for t in self._tags.split(",") if t]

    @tags.setter
    def tags(self, value):
        # accept list or comma-separated string
        if isinstance(value, list):
            self._tags = ",".join([str(v).strip() for v in value if str(v).strip()])
        elif isinstance(value, str):
            self._tags = value
        else:
            self._tags = ""
