import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm/TodosViewForm.jsx';
import { useSearchParams } from 'react-router';
import Pagination from '../shared/Pagination';

function TodosPage({
  todoState,
  addTodo,
  completeTodo,
  updateTodo,
  dispatch,
  todoActions,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  //   const totalPages = Math.ceil(todoState.todoList.length / itemsPerPage);

  const filteredTodoList = todoState.todoList;

  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

  const pageTodos = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );

  const onPrev = () => setSearchParams({ page: String(currentPage - 1) });
  const onNext = () => setSearchParams({ page: String(currentPage + 1) });
  return (
    <>
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
      <TodoList
        todoList={pageTodos}
        isLoading={todoState.isLoading}
        error={todoState.errorMessage}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}

export default TodosPage;
