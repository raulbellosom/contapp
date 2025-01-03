import React, { useCallback, useMemo, useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
const Table = React.lazy(() => import('../../components/Table/Table'));
import { Accordion, Spinner } from 'flowbite-react';
import ModalFormikForm from '../../components/Modals/ModalFormikForm';
import TransactionFormFields from '../../components/Transaction/TransactionFormFields';
import {
  transactionFormSchema,
  transactionTypesValues,
} from '../../components/Transaction/TransactionFormSchema';
import TableHeader from '../../components/Table/TableHeader';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import TableActions from '../../components/Table/TableActions';
import { TransactionsColumns } from '../../utils/TableColumns';
import ModalRemove from '../../components/Modals/ModalRemove';
import { GiArchiveResearch } from 'react-icons/gi';
import { TiArrowSortedDown } from 'react-icons/ti';
import { useAccounts } from '../../hooks/useAccounts';
import { useCategories } from '../../hooks/useCategories';
import { parseMoney, parseToLocalDate } from '../../utils/formatValues';

const InitValues = {
  amount: '',
  type: '',
  date: '',
  description: '',
  categoryId: '',
  accountId: '',
  id: '',
};

const Transactions = () => {
  const {
    transactions,
    removeTransaction,
    createNewTransaction,
    modifyTransaction,
    fetchTransactions,
  } = useTransactions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const [formValues, setFormValues] = useState(InitValues);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const filteredTransactions = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return transactions.filter((transaction) =>
      transaction.description?.toLowerCase().includes(lowerCaseSearchTerm),
    );
  }, [transactions, searchTerm]);

  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions];
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
  }, [filteredTransactions, sortConfig]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedTransactions.slice(startIndex, endIndex);
  }, [sortedTransactions, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredTransactions.length / itemsPerPage);
  }, [filteredTransactions, itemsPerPage]);

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
    removeTransaction.mutate(id);
    setShowModalRemove(false);
  };

  const handleSubmit = (values) => {
    if (editMode) {
      modifyTransaction.mutate(values);
    } else {
      createNewTransaction.mutate(values);
    }
    setShowModal(false);
    setFormValues(InitValues);
    setEditMode(false);
  };

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  if (fetchTransactions.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (fetchTransactions.isError) {
    return (
      <div className="text-center text-red-500">
        <p>
          Error al cargar las transacciones: {fetchTransactions.error.message}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto w-full">
        <div className="mb-4 w-full">
          <TableHeader
            title={'Transacciones'}
            icon={FaMoneyCheckAlt}
            actions={[
              {
                label: 'Nueva Transacción',
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
        {/* Vista responsiva con Accordion */}
        <div className="md:hidden">
          {paginatedTransactions && paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((transaction) => (
              <Accordion key={transaction.id} className="mb-2">
                <Accordion.Panel>
                  <Accordion.Title>
                    {transaction.description || 'Sin descripción'}
                  </Accordion.Title>
                  <Accordion.Content>
                    <p>
                      <strong>Monto:</strong> {parseMoney(transaction.amount)}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{' '}
                      {parseToLocalDate(transaction.date)}
                    </p>
                    <p>
                      <strong>Cuenta:</strong>{' '}
                      {transaction.account?.name || 'Sin cuenta'}
                    </p>
                    <p>
                      <strong>Categoría:</strong>{' '}
                      {transaction.category?.name || 'Sin categoría'}
                    </p>
                    <ActionButtons
                      onEdit={() => {
                        setFormValues(transaction);
                        setEditMode(true);
                        setShowModal(true);
                      }}
                      onRemove={() => {
                        setSelectedTransaction(transaction.id);
                        setShowModalRemove(true);
                      }}
                    />
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
            ))
          ) : (
            <div className="flex items-center flex-col gap-2 text-gray-500">
              <GiArchiveResearch
                size="12em"
                className="text-contapp-primary-light"
              />
              <p>No se encontraron transacciones.</p>
            </div>
          )}
        </div>
        {/* Vista de tabla para pantallas más grandes */}
        <div className="hidden md:block">
          {paginatedTransactions && paginatedTransactions.length > 0 ? (
            <table className="w-full">
              <thead className="bg-contapp-dark text-white w-full">
                <tr className="w-full">
                  {TransactionsColumns.map((col, index) => (
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
                {paginatedTransactions.map((transaction) => (
                  <tr
                    className="border-b border-b-neutral-100 w-full hover:bg-indigo-100 odd:bg-indigo-50"
                    key={transaction.id}
                  >
                    <td className="p-4 flex flex-row gap-2 items-center">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: transaction.account?.color }}
                      ></div>
                      <p className="font-semibold">
                        {transaction.account?.name || 'Sin cuenta'}
                      </p>
                    </td>
                    <td className="p-4">
                      {parseToLocalDate(transaction.date)}
                    </td>
                    <td className="p-4">{parseMoney(transaction.amount)}</td>
                    <td className="p-4">
                      {transaction.category?.name || 'Sin categoría'}
                    </td>
                    <td className="p-4">
                      {transaction.description || 'Sin descripción'}
                    </td>
                    <td className="flex items-center gap-2 p-4">
                      <ActionButtons
                        onEdit={() => {
                          setFormValues(transaction);
                          setEditMode(true);
                          setShowModal(true);
                        }}
                        onRemove={() => {
                          setSelectedTransaction(transaction.id);
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
              <p>No se encontraron transacciones.</p>
            </div>
          )}
        </div>
        {/* Paginación */}
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
          formFields={
            <TransactionFormFields
              editMode={editMode}
              accounts={accounts}
              transactionTypes={transactionTypesValues}
              categories={categories}
            />
          }
          initialValues={formValues}
          isOpenModal={showModal}
          onClose={() => setShowModal(false)}
          schema={transactionFormSchema}
          title={editMode ? 'Editar Transacción' : 'Nueva Transacción'}
          size={'lg'}
          onSubmit={handleSubmit}
        />
      )}
      {showModalRemove && (
        <ModalRemove
          isOpenModal={showModalRemove}
          onCloseModal={() => {
            setShowModalRemove(false);
            setSelectedTransaction(null);
          }}
          removeFunction={() => handleDelete(selectedTransaction)}
        />
      )}
    </>
  );
};

export default Transactions;
