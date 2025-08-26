function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <li className="todo-item">
      <label className="todo-label">
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onCompleteTodo(todo.id)}
        />

        <span className="todo-title">{todo.title}</span>
      </label>
    </li>
  );
}

export default TodoListItem;
