import { useContext } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import CategoryContext from '../context/CategoryContext';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/main.api';
import Notifies from '../components/Notifies/Notifies';

export const useCategories = () => {
  const { state, dispatch } = useContext(CategoryContext);
  const queryClient = useQueryClient();

  // Obtener todas las categorías
  const fetchCategories = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    onSuccess: (data) => {
      dispatch({ type: 'SET_CATEGORIES', payload: data });
    },
    onError: () => {
      Notifies('error', 'Error al obtener las categorías');
    },
  });

  // Crear una nueva categoría
  const createNewCategory = useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      Notifies('success', 'Categoría creada correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al crear la categoría');
    },
  });

  // Actualizar una categoría existente
  const modifyCategory = useMutation({
    mutationFn: updateCategory,
    onSuccess: (updatedCategory) => {
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      Notifies('success', 'Categoría actualizada correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al actualizar la categoría');
    },
  });

  // Eliminar una categoría
  const removeCategory = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (id) => {
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      Notifies('success', 'Categoría eliminada correctamente');
    },
    onError: () => {
      Notifies('error', 'Error al eliminar la categoría');
    },
  });

  return {
    categories: state.categories,
    fetchCategories,
    createNewCategory,
    modifyCategory,
    removeCategory,
  };
};
