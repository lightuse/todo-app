from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str
    completed: bool = False
    tags: list[str] = []

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    id: int

    class Config:
        from_attributes = True