const bankReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BANKS':
      return { ...state, banks: action.payload };
    case 'ADD_BANK':
      return { ...state, banks: [...state.banks, action.payload] };
    case 'UPDATE_BANK':
      return {
        ...state,
        banks: state.banks.map((bank) =>
          bank.id === action.payload.id ? action.payload : bank,
        ),
      };
    case 'DELETE_BANK':
      return {
        ...state,
        banks: state.banks.filter((bank) => bank.id !== action.payload),
      };
    default:
      return state;
  }
};

export default bankReducer;
