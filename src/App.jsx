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
import logo from './assets/logo.svg';
import { useReducer } from 'react';
import {
  todosReducer as reducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

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

      // const savedTodo = mapRecordToTodo(records[0]);

      dispatch({ type: todoActions.addTodo, savedTodo: records[0] });

      dispatch({ type: todoActions.endRequest });
    } catch (err) {
      dispatch({ type: todoActions.setLoadError, error: err });
    }
  };

  const completeTodo = async (id) => {
    // const originalTodo = state.todoList.find((todo) => todo.id === id);
    // const updatedTodos = state.todoList.map((todo) =>
    //   todo.id === id ? { ...todo, isCompleted: true } : todo
    // );
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
    // const originalTodo = state.todoList.find(
    //   (todo) => todo.id === editedTodo.id
    // );
    // const updatedTodos = state.todoList.map((todo) =>
    //   todo.id === editedTodo.id ? { ...editedTodo } : todo
    // );
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
        <h1 className={styles.title}>
          <img src={logo} alt="" className={styles.logo} />
          My Todos
        </h1>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

        <TodosViewForm
          sortField={todoState.sortField}
          setSortField={(field) =>
            dispatch({ type: todoActions.setSortField, sortField: field })
          }
          sortDirection={todoState.sortDirection}
          setSortDirection={(dir) =>
            dispatch({ type: todoActions.setSortDirection, sortDirection: dir })
          }
          queryString={todoState.queryString}
          setQueryString={(query) =>
            dispatch({ type: todoActions.setQueryString, queryString: query })
          }
        />
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

        <TodoList
          todoList={todoState.todoList}
          isLoading={todoState.isLoading}
          error={todoState.errorMessage}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
        />

        <hr />
      </div>
    </div>
  );
}
export default App;
