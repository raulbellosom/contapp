import React, { useReducer, useEffect } from 'react';
import CategoryContext from './CategoryContext';
import CategoryReducer from './CategoryReducer';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/main.api';

export const CategoryProvider = ({ children }) => {
  const initialState = {
    categories: [],
  };

  const [state, dispatch] = useReducer(CategoryReducer, initialState);

  const { data: categories, isSuccess } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (isSuccess && categories) {
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    }
  }, [isSuccess, categories]);

  return (
    <CategoryContext.Provider value={{ state, dispatch }}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
