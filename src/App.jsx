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
// ======================================================================
// ======================================================================

/* ====  Week 11 Stretch Goal: Refactor Remaining App State into useReducer

useState hooks to be replaced in App.jsx:

  - sortDirection  - useState('desc')           -> todoState.sortDirection
  - sortField      - useState('createdTime')    -> todoState.sortField
  - queryString    - useState('')               -> todoState.queryString

Adding Initial reducer state:
  sortDirection: 'desc',
  sortField: 'createdTime',
  queryString: ''

Required actions:
  - setSortDirection
  - setSortField
  - setQueryString
*/

import './App.css';
import styles from './App.module.css';
import { useEffect, useCallback } from 'react';
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList/TodoList';
import TodosViewForm from './features/TodosViewForm/TodosViewForm';
import TodosPage from './pages/TodosPage';
import logo from './assets/logo.svg';
import { useReducer } from 'react';
import {
  todosReducer as reducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';
import Header from './shared/Header';
import { useLocation } from 'react-router';
import { Routes, Route } from 'react-router';
import About from './pages/About';
import NotFound from './pages/NotFound';

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

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${
  import.meta.env.VITE_TABLE_NAME
}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoState, dispatch] = useReducer(reducer, initialTodosState);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      document.title = 'Todo List';
    } else if (location.pathname === '/about') {
      document.title = 'About';
    } else {
      document.title = 'Not Found';
    }
  }, [location]);

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${todoState.sortField}&sort[0][direction]=${todoState.sortDirection}`;
    let searchQuery = '';
    if (todoState.queryString) {
      searchQuery = `&filterByFormula=SEARCH("${todoState.queryString}", title)`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [
    todoState.sortField,
    todoState.sortDirection,
    todoState.queryString,
    url,
  ]);

  useEffect(() => {
    const fetchTodos = async () => {
      const options = makeOptions('GET', token);

      try {
        dispatch({ type: todoActions.fetchTodos });

        const resp = await fetch(encodeUrl(), options);

        if (!resp.ok) {
          throw new Error(resp.status);
        }
        const { records } = await resp.json();

        dispatch({ type: todoActions.loadTodos, records });
      } catch (err) {
        dispatch({ type: todoActions.setLoadError, error: err });
      }
    };

    fetchTodos();
  }, [
    todoState.sortField,
    todoState.sortDirection,
    todoState.queryString,
    token,
  ]);

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
      dispatch({ type: todoActions.startRequest });

      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error(resp.status);
      }
      const { records } = await resp.json();

      const savedTodo = {
        id: records[0].id,
        title: records[0].fields?.title ?? '',
        isCompleted: Boolean(records[0].fields?.isCompleted),
      };
      dispatch({ type: todoActions.addTodo, savedTodo });

      dispatch({ type: todoActions.endRequest });
    } catch (err) {
      dispatch({ type: todoActions.setLoadError, error: err });
    }
  };

  const completeTodo = async (id) => {
    dispatch({ type: todoActions.completeTodo, id });
    const payload = {
      records: [
        {
          id: id,
          fields: {
            // title: originalTodo.title,
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
      const originalTodo = todoState.todoList.find((todo) => todo.id === id);
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error: err,
      });
    }
  };

  const updateTodo = async (editedTodo) => {
    dispatch({ type: todoActions.updateTodo, editedTodo });

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
      dispatch({ type: todoActions.revertTodo, editedTodo, error: err });
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.leftColumn}>
        <Header title="My Todos" />
        <Routes>
          <Route
            path="/"
            element={
              <TodosPage
                todoState={todoState}
                addTodo={addTodo}
                completeTodo={completeTodo}
                updateTodo={updateTodo}
                dispatch={dispatch}
                todoActions={todoActions}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
      <div className={styles.rightColumn}>
        {todoState.errorMessage && (
          <div className={styles.errorBox}>
            {todoState.errorMessage}
            <button onClick={() => dispatch({ type: todoActions.clearError })}>
              Dismiss
            </button>
          </div>
        )}
        <hr />
      </div>
    </div>
  );
}
export default App;
