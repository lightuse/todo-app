export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  tags?: string[];
};

export type TodoCreate = Omit<Todo, 'id'>;
