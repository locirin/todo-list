// ===== INITIAL STATE =======
const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
  sortDirection: 'desc',
  sortField: 'createdTime',
  queryString: '',
};

// ====== ACTIONS =======
const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',
  clearError: 'clearError',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  setSortDirection: 'setSortDirection',
  setSortField: 'setSortField',
  setQueryString: 'setQueryString',
};

// ======= REDUCER ===== todosReducer
function todosReducer(state, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };
    case actions.loadTodos:
      return {
        ...state,
        isLoading: false,
        todoList: action.records.map((record) => {
          const todo = { id: record.id, ...record.fields };
          if (todo.isCompleted === undefined) {
            todo.isCompleted = false;
          }
          return todo;
        }),
      };
    case actions.setLoadError:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.error.message,
      };

    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };
    case actions.addTodo: {
      const savedTodo = action.savedTodo;

      if (savedTodo.isCompleted === undefined) {
        savedTodo.isCompleted = false;
      }

      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }

    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    case actions.revertTodo:
    // note: no return here as it goes through to updateTodo
    case actions.updateTodo: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.editedTodo.id ? { ...action.editedTodo } : todo
      );

      const updatedState = {
        ...state,
        todoList: updatedTodos,
      };

      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }

      return updatedState;
    }

    case actions.completeTodo: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.id ? { ...todo, isCompleted: true } : todo
      );

      return {
        ...state,
        todoList: updatedTodos,
      };
    }

    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };

    case actions.setSortDirection:
      return {
        ...state,
        sortDirection: action.sortDirection,
      };

    case actions.setSortField:
      return {
        ...state,
        sortField: action.sortField,
      };

    case actions.setQueryString:
      return {
        ...state,
        queryString: action.queryString,
      };

    default:
      return state;
  }
}

export { initialState, todosReducer, actions };
