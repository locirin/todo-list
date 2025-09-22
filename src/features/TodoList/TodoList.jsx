import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';

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
    <ul className={styles.todoList}>
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
