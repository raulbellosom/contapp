import React, { useCallback, useMemo, useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
const Table = React.lazy(() => import('../../components/Table/Table'));
import { Accordion, Spinner } from 'flowbite-react';
import ModalFormikForm from '../../components/Modals/ModalFormikForm';
import CategoryFormFields from '../../components/Category/CategoryFormFields';
import {
  categoryFormSchema,
  categoryTypesValues,
} from '../../components/Category/CategoryFormSchema';
import TableHeader from '../../components/Table/TableHeader';
import { FaTags } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import TableActions from '../../components/Table/TableActions';
import { CategoriesColumns } from '../../utils/TableColumns';
import ModalRemove from '../../components/Modals/ModalRemove';
import { GiArchiveResearch } from 'react-icons/gi';
import { TiArrowSortedDown } from 'react-icons/ti';

const InitValues = {
  name: '',
  type: '',
  description: '',
  id: '',
};

const Category = () => {
  const {
    categories,
    removeCategory,
    createNewCategory,
    modifyCategory,
    fetchCategories,
  } = useCategories();
  const [formValues, setFormValues] = useState(InitValues);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const filteredCategories = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(lowerCaseSearchTerm),
    );
  }, [categories, searchTerm]);

  const sortedCategories = useMemo(() => {
    const sorted = [...filteredCategories];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredCategories, sortConfig]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedCategories.slice(startIndex, endIndex);
  }, [sortedCategories, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredCategories.length / itemsPerPage);
  }, [filteredCategories, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = (id) => {
    removeCategory.mutate(id);
    setShowModalRemove(false);
  };

  const handleSubmit = (values) => {
    if (editMode) {
      modifyCategory.mutate(values);
    } else {
      createNewCategory.mutate(values);
    }
    setShowModal(false);
    setFormValues(InitValues);
    setEditMode(false);
  };

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  if (fetchCategories.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (fetchCategories.isError) {
    return (
      <div className="text-center text-red-500">
        <p>Error al cargar las categorías: {fetchCategories.error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto w-full">
        <div className="mb-4 w-full">
          <TableHeader
            title={'Categorías'}
            icon={FaTags}
            actions={[
              {
                label: 'Nueva Categoría',
                action: () => {
                  setFormValues(InitValues);
                  setEditMode(false);
                  setShowModal(true);
                },
                color: 'primary',
                icon: IoMdAdd,
              },
            ]}
          />
        </div>
        <div className="py-4">
          <TableActions handleSearchTerm={handleSearch} />
        </div>
        {paginatedCategories && paginatedCategories.length > 0 ? (
          <table className="w-full">
            <thead className="bg-contapp-dark text-white w-full">
              <tr className="w-full">
                {CategoriesColumns.map((col, index) => (
                  <th
                    key={index}
                    onClick={() => handleSort(col.id)}
                    className={`py-3 px-4 text-left cursor-pointer hover:bg-contapp-primary-light hover:text-white ${
                      sortConfig.key === col.id ? 'font-bold' : ''
                    }`}
                  >
                    {col.value}
                    {sortConfig.key === col.id && (
                      <TiArrowSortedDown
                        className={`inline ml-1 ${
                          sortConfig.direction === 'asc'
                            ? 'rotate-0'
                            : 'rotate-180'
                        }`}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((category) => (
                <tr
                  className="border-b border-b-neutral-100 w-full hover:bg-indigo-100 odd:bg-indigo-50"
                  key={category.id}
                >
                  <td className="p-4">{category.name}</td>
                  <td className="p-4">
                    {
                      categoryTypesValues.find(
                        (type) => type.value === category.type,
                      ).label
                    }
                  </td>
                  <td className="p-4">
                    {category.description || 'Sin descripción'}
                  </td>
                  <td className="flex items-center gap-2 p-4">
                    <ActionButtons
                      onEdit={() => {
                        setFormValues(category);
                        setEditMode(true);
                        setShowModal(true);
                      }}
                      onRemove={() => {
                        setSelectedCategory(category.id);
                        setShowModalRemove(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center flex-col gap-2 text-gray-500">
            <GiArchiveResearch
              size="12em"
              className="text-contapp-primary-light"
            />
            <p>No se encontraron categorías.</p>
          </div>
        )}
        <div className="flex gap-4 flex-col md:flex-row justify-between md:items-center mt-4">
          <div className="flex justify-start items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm font-medium">
              Mostrar:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded px-2 py-1 text-sm"
            >
              {[5, 10, 20, 30, 50].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center md:justify-end items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    page === currentPage
                      ? 'bg-contapp-primary text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <ModalFormikForm
          saveLabel={editMode ? 'Actualizar' : 'Crear'}
          formFields={<CategoryFormFields editMode={editMode} />}
          initialValues={formValues}
          isOpenModal={showModal}
          onClose={() => setShowModal(false)}
          schema={categoryFormSchema}
          title={editMode ? 'Editar Categoría' : 'Nueva Categoría'}
          size={'lg'}
          onSubmit={handleSubmit}
        />
      )}
      {showModalRemove && (
        <ModalRemove
          isOpenModal={showModalRemove}
          onCloseModal={() => {
            setShowModalRemove(false);
            setSelectedCategory(null);
          }}
          removeFunction={() => handleDelete(selectedCategory)}
        />
      )}
    </>
  );
};

export default Category;
