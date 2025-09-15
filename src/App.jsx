import './App.css';
import { useState, useEffect } from 'react';
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList/TodoList';
import TodosViewForm from './features/TodosViewForm/TodosViewForm';

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

function handleError(
  err,
  setError,
  todoList,
  setTodoList,
  originalTodo = null
) {
  console.error(err);

  if (originalTodo) {
    setError(`${err.message}. Reverting todo...`);
    const revertedTodos = todoList.map((todo) =>
      todo.id === originalTodo.id ? originalTodo : todo
    );
    setTodoList(revertedTodos);
  } else {
    setError(err.message);
  }
}
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${
  import.meta.env.VITE_TABLE_NAME
}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

// this is encodeUrl util
const encodeUrl = ({ sortField, sortDirection, queryString }) => {
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  let searchQuery = '';
  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}", title)`;
  }

  return encodeURI(`${url}?${sortQuery}${searchQuery}`);
};
function App() {
  const [todoList, setTodoList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  //added new state for sorting
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');

  const [queryString, setQueryString] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      const options = makeOptions('GET', token);

      try {
        setIsLoading(true);
        setError('');

        const resp = await fetch(
          encodeUrl({ sortField, sortDirection, queryString }),
          options
        );

        if (!resp.ok) {
          throw new Error(resp.message);
        }
        const { records } = await resp.json();

        const todos = records.map(mapRecordToTodo);

        setTodoList(todos);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
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
      setIsSaving(true);
      const resp = await fetch(
        encodeUrl({ sortField, sortDirection, queryString }),
        options
      );

      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const { records } = await resp.json();

      const savedTodo = mapRecordToTodo(records[0]);

      setTodoList([...todoList, savedTodo]);
    } catch (err) {
      handleError(err, setError, todoList, setTodoList);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    const updatedTodos = todoList.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    );
    setTodoList(updatedTodos);
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
      const resp = await fetch(
        encodeUrl({ sortField, sortDirection, queryString }),
        options
      );

      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (err) {
      handleError(err, setError, todoList, setTodoList, originalTodo);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    setTodoList(updatedTodos);

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
      const resp = await fetch(
        encodeUrl({ sortField, sortDirection, queryString }),
        options
      );

      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (err) {
      handleError(err, setError, todoList, setTodoList, originalTodo);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <TodoList
        todoList={todoList}
        isLoading={isLoading}
        error={error}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />

      <hr />

      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />
    </div>
  );
}

export default App;
