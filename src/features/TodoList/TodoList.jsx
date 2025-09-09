import TodoListItem from './TodoListItem';

function TodoList({
  todoList,
  isLoading,
  error,
  onCompleteTodo,
  onUpdateTodo,
}) {
  if (isLoading) {
    return <p>Todo list loading...</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }
  const visible = todoList.filter((t) => !t.isCompleted);

  if (visible.length === 0) {
    return <p>Add a todo above to get started</p>;
  }
  return (
    <ul>
      {visible.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
