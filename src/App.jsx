/* ==== Week 11 Reducer Plan: useReducer

These useState hooks will be replaced in App.jsx:
  - todoList      - useState([])            -> state.todoList
  - isLoading     - useState(false)         -> state.isLoading
  - isSaving      - useState(false)         -> state.isSaving
  - error (or errorMessage) - useState('')  -> state.errorMessage

Initial reducer state will look like:
  {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: ''
  }

Action types that will be needed:
  - fetch/start
  - fetch/success
  - fetch/error
  - save/start
  - save/success
  - save/error
  - todo/add
  - todo/update
  - todo/delete
  - todo/toggle
*/

import './App.css';
import styles from './App.module.css';
import { useState, useEffect, useCallback } from 'react';
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList/TodoList';
import TodosViewForm from './features/TodosViewForm/TodosViewForm';
import logo from './assets/logo.svg';
import { useReducer } from 'react';
import { initialState, todosReducer } from './reducers/todos.reducer';

function makeOptions(method, token, payload = null) {
  const options = {
    method,
    headers: {
      Authorization: token,
    },
  };
  if (payload) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(payload);
  }
  return options;
}
function mapRecordToTodo(record) {
  const todo = {
    id: record.id,
    ...record.fields,
  };
  if (!todo.isCompleted) {
    todo.isCompleted = false;
  }
  return todo;
}

// function handleError(
//   err,
//   setError,
//   todoList,
//   setTodoList,
//   originalTodo = null
// ) {
//   console.error(err);

//   if (originalTodo) {
//     setError(`${err.message}. Reverting todo...`);
//     const revertedTodos = todoList.map((todo) =>
//       todo.id === originalTodo.id ? originalTodo : todo
//     );
//     setTodoList(revertedTodos);
//   } else {
//     setError(err.message);
//   }
// }
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${
  import.meta.env.VITE_TABLE_NAME
}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [state, dispatch] = useReducer(todosReducer, initialState);

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');

  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}", title)`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString, url]);

  useEffect(() => {
    const fetchTodos = async () => {
      const options = makeOptions('GET', token);

      try {
        dispatch({ type: 'fetch/start' });

        const resp = await fetch(encodeUrl(), options);

        if (!resp.ok) {
          throw new Error(resp.status);
        }
        const { records } = await resp.json();

        const todos = records.map(mapRecordToTodo);

        dispatch({ type: 'fetch/success', todoList: todos });
      } catch (err) {
        dispatch({ type: 'fetch/error', errorMessage: err.message });
      }
    };

    fetchTodos();
  }, [sortField, sortDirection, queryString, token]);

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    const options = makeOptions('POST', token, payload);

    try {
      dispatch({ type: 'save/start' });
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error(resp.status);
      }
      const { records } = await resp.json();

      const savedTodo = mapRecordToTodo(records[0]);

      const updatedTodos = [...state.todoList, savedTodo];
      dispatch({ type: 'save/success', todoList: updatedTodos });
    } catch (err) {
      dispatch({ type: 'save/error', errorMessage: err.message });
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = state.todoList.find((todo) => todo.id === id);
    const updatedTodos = state.todoList.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    );
    dispatch({ type: 'save/success', todoList: updatedTodos });
    const payload = {
      records: [
        {
          id: id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    const options = makeOptions('PATCH', token, payload);

    try {
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error(resp.status);
      }
    } catch (err) {
      dispatch({ type: 'save/error', errorMessage: err.message });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = state.todoList.find(
      (todo) => todo.id === editedTodo.id
    );
    const updatedTodos = state.todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    dispatch({ type: 'save/success', todoList: updatedTodos });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = makeOptions('PATCH', token, payload);

    try {
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error(resp.status);
      }
    } catch (err) {
      dispatch({ type: 'save/error', errorMessage: err.message });
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.leftColumn}>
        <h1 className={styles.title}>
          <img src={logo} alt="" className={styles.logo} />
          My Todos
        </h1>
        <TodoForm onAddTodo={addTodo} isSaving={state.isSaving} />

        <TodosViewForm
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          queryString={queryString}
          setQueryString={setQueryString}
        />
      </div>
      <div className={styles.rightColumn}>
        {state.errorMessage && (
          <div className={styles.errorBox}>{state.errorMessage}</div>
        )}

        <TodoList
          todoList={state.todoList}
          isLoading={state.isLoading}
          error={state.errorMessage}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
        />

        <hr />
      </div>
    </div>
  );
}
export default App;
