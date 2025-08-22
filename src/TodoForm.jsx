import { useState } from 'react';
import { useRef } from 'react';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const inputRef = useRef(null);

  function handleAddTodo(event) {
    event.preventDefault();
    const title = workingTodoTitle.trim();
    if (title === '') return;
    onAddTodo(title);
    setWorkingTodoTitle('');

    if (inputRef.current) inputRef.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        id="todoTitle"
        name="title"
        type="text"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
        ref={inputRef}
      />
      <button type="submit" disabled={workingTodoTitle.trim() === ''}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
