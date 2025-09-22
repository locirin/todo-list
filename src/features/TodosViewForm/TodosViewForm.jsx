import { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled-Components
const StyledForm = styled.form`
  padding: 0.5rem; /* Adding spacing inside the form */
  gap: 0.75rem; /* Adding space between Search row and Sort row */
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  margin-right: 0.5rem;
  padding: 0.25rem;
`;

const StyledSelect = styled.select`
  margin-right: 0.5rem;
  padding: 0.25rem;
`;

const StyledButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
`;

function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);
  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);
  const preventRefresh = (e) => {
    e.preventDefault();
  };
  return (
    <StyledForm onSubmit={preventRefresh}>
      <div>
        <label htmlFor="search">Search todos:</label>
        <StyledInput
          id="search"
          type="text"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <StyledButton type="button" onClick={() => setLocalQueryString('')}>
          Clear
        </StyledButton>
      </div>
      <div>
        <label htmlFor="sortBy">Sort by</label>
        <StyledSelect
          id="sortBy"
          name="sortBy"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </StyledSelect>
        <label htmlFor="sortDirection">Direction</label>
        <StyledSelect
          id="sortDirection"
          name="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </StyledSelect>
      </div>
    </StyledForm>
  );
}

export default TodosViewForm;
