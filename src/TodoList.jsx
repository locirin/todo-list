import TodoListItem from './TodoListItem';

function TodoList({ todoList, onCompleteTodo }) {
  if (todoList.length === 0) {
    return <p>Add todo above to get started</p>;
  }
  return (
    <ul>
      {todoList.map((todo) => {
        if (todo.isCompleted) {
          return null;
        }
        return (
          <TodoListItem
            key={todo.id}
            todo={todo}
            onCompleteTodo={onCompleteTodo}
          />
        );
      })}
    </ul>
  );
}

export default TodoList;
