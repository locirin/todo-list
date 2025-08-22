import TodoListItem from './TodoListItem';

function TodoList({ todoList, onCompleteTodo }) {
  //  sifting out completed todo tasks
  const visible = todoList.filter((t) => !t.isCompleted);
  // displaying msg in no uncompleted todo tasks listed
  if (visible.length === 0) {
    return <p>Add todo above to get started</p>;
  }
  // rendering uncompleted todo tasks only
  return (
    <ul>
      {visible.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
