import { useState } from 'react';
import { useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';

const StyledForm = styled.form`
  padding: 0.5rem;
  /* Instructionsa requirement: spacing inside form */
`;

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }

  &:disabled {
    font-style: italic;
    /* Instructions requirement: italic when disabled */
    cursor: not-allowed;
  }
`;

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const inputRef = useRef(null);

  function handleAddTodo(event) {
    event.preventDefault();
    const title = workingTodoTitle.trim();
    if (title === '') return;
    onAddTodo({ title, isCompleted: false });
    setWorkingTodoTitle('');

    if (inputRef.current) inputRef.current.focus();
  }

  return (
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
        ref={inputRef}
      />

      <StyledButton disabled={workingTodoTitle.trim() === ''}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
