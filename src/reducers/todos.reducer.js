// adding initial state
const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

// adding todosReducer schema + switch
function todosReducer(state, action) {
  switch (action.type) {
    case 'fetch/start':
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };
    case 'fetch/success':
      return {
        ...state,
        isLoading: false,
        todoList: action.todoList,
      };
    case 'fetch/error':
      return {
        ...state,
        isLoading: false,
        errorMessage: action.errorMessage,
      };
    case 'save/start':
      return {
        ...state,
        isSaving: true,
        errorMessage: '',
      };
    case 'save/success':
      return {
        ...state,
        isSaving: false,
        todoList: action.todoList,
      };
    case 'save/error':
      return {
        ...state,
        isSaving: false,
        errorMessage: action.errorMessage,
      };

    default:
      return state;
  }
}

export { initialState, todosReducer };
