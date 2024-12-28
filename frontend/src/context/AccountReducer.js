const accountReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map((account) =>
          account.id === action.payload.id ? action.payload : account,
        ),
      };
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(
          (account) => account.id !== action.payload,
        ),
      };
    default:
      return state;
  }
};

export default accountReducer;
