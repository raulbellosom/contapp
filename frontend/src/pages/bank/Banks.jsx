import React, { useCallback, useMemo, useState } from 'react';
import { useBanks } from '../../hooks/useBanks';
const Table = React.lazy(() => import('../../components/Table/Table'));
import { Accordion, Spinner } from 'flowbite-react';
import ModalFormikForm from '../../components/Modals/ModalFormikForm';
import BankFormFields from '../../components/Bank/BankFormFields';
import { BankFormSchema } from '../../components/Bank/BankFormSchema';
import TableHeader from '../../components/Table/TableHeader';
import { FaUniversity } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import TableActions from '../../components/Table/TableActions';
import { BanksColumns } from '../../utils/TableColumns';
import ModalRemove from '../../components/Modals/ModalRemove';
import { FormattedUrlImage } from '../../utils/FormattedUrlImage';
import { GiArchiveResearch } from 'react-icons/gi';
import { TiArrowSortedDown } from 'react-icons/ti';

const InitValues = {
  name: '',
  country: '',
  logo: null,
  id: '',
};

const Banks = () => {
  const { banks, removeBank, createNewBank, modifyBank, fetchBanks } =
    useBanks();
  const [formValues, setFormValues] = useState(InitValues);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const filteredBanks = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return banks.filter((bank) =>
      bank.name.toLowerCase().includes(lowerCaseSearchTerm),
    );
  }, [banks, searchTerm]);

  const sortedBanks = useMemo(() => {
    const sorted = [...filteredBanks];
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
  }, [filteredBanks, sortConfig]);

  const paginatedBanks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedBanks.slice(startIndex, endIndex);
  }, [sortedBanks, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredBanks.length / itemsPerPage);
  }, [filteredBanks, itemsPerPage]);

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
    removeBank.mutate(id);
    setShowModalRemove(false);
  };

  const handleSubmit = (values) => {
    if (editMode) {
      modifyBank.mutate(values);
    } else {
      createNewBank.mutate(values);
    }
    setShowModal(false);
    setFormValues(InitValues);
    setEditMode(false);
  };

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  if (fetchBanks.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (fetchBanks.isError) {
    return (
      <div className="text-center text-red-500">
        <p>Error al cargar las cuentas: {fetchBanks.error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto w-full">
        <div className="mb-4 w-full">
          <TableHeader
            title={'Bancos'}
            icon={FaUniversity}
            actions={[
              {
                label: 'Nuevo Banco',
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
        {paginatedBanks && paginatedBanks.length > 0 ? (
          <table className="w-full">
            <thead className="bg-contapp-dark text-white w-full">
              <tr className="w-full">
                <th className="md:hidden py-3 px-4 text-left w-fit md:w-48 rounded-tl-xl hover:bg-contapp-primary-light cursor-pointer">
                  Banco
                </th>
                <th className="md:hidden py-3 px-4 text-left w-full md:w-40 rounded-tr-xl md:rounded-none hover:bg-contapp-primary-light cursor-pointer">
                  Nombre de la Cuenta
                </th>
                {BanksColumns.map((col, index) => (
                  <th
                    key={index}
                    onClick={() =>
                      col.id === 'name'
                        ? handleSort('name')
                        : col.id === 'country'
                          ? handleSort('country')
                          : null
                    }
                    className={`hidden md:table-cell py-3 px-4 text-left cursor-pointer hover:bg-contapp-primary-light hover:text-white ${
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
              {paginatedBanks.map((bank) => (
                <tr
                  className="hidden md:table-row md:border-b w-full md:hover:bg-indigo-100 odd:bg-indigo-50 border-b border-b-neutral-100"
                  key={bank.id}
                >
                  <td className="font-bold p-4">
                    <img
                      src={FormattedUrlImage(bank.logo)}
                      alt={bank.name}
                      className="w-8 h-8 rounded-md inline-block mr-2"
                    />
                    {bank.name}
                  </td>
                  <td className="p-4">{bank.country || 'Sin especificar'}</td>
                  <td className="flex items-center gap-2 max-w-64 p-4">
                    <ActionButtons
                      onEdit={() => {
                        setFormValues(bank);
                        setEditMode(true);
                        setShowModal(true);
                      }}
                      onRemove={() => {
                        setSelectedBank(bank.id);
                        setShowModalRemove(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
              {paginatedBanks.map((bank) => (
                <tr className="table-row md:hidden" key={bank.id}>
                  <td className="w-fit flex flex-col gap-2 text-xs justify-start items-start p-4">
                    <img
                      src={FormattedUrlImage(bank.logo)}
                      alt={bank.name}
                      className="w-8 h-8 rounded-md"
                    />
                  </td>
                  <td className="w-full">
                    <Accordion className="border-none w-full" collapseAll>
                      <Accordion.Panel>
                        <Accordion.Title
                          theme={{
                            open: {
                              on: 'bg-transparent active:bg-transparent ',
                            },
                            flush: {
                              off: 'bg-transparent active:bg-transparent',
                            },
                          }}
                        >
                          {bank.name}
                        </Accordion.Title>
                        <Accordion.Content>
                          <div className="flex flex-col gap-4">
                            <div>
                              <p className="text-sm font-bold">País</p>
                              <p className="text-sm">
                                {bank.country || 'Sin especificar'}
                              </p>
                            </div>
                            <ActionButtons
                              onEdit={() => {
                                setFormValues(bank);
                                setEditMode(true);
                                setShowModal(true);
                              }}
                              onRemove={() => {
                                setSelectedBank(bank.id);
                                setShowModalRemove(true);
                              }}
                            />
                          </div>
                        </Accordion.Content>
                      </Accordion.Panel>
                    </Accordion>
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
            <p>No se encontraron bancos.</p>
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
          formFields={<BankFormFields editMode={editMode} />}
          initialValues={formValues}
          isOpenModal={showModal}
          onClose={() => setShowModal(false)}
          schema={BankFormSchema}
          title={editMode ? 'Editar Banco' : 'Nuevo Banco'}
          size={'lg'}
          onSubmit={handleSubmit}
        />
      )}
      {showModalRemove && (
        <ModalRemove
          isOpenModal={showModalRemove}
          onCloseModal={() => {
            setShowModalRemove(false);
            setSelectedBank(null);
          }}
          removeFunction={() => handleDelete(selectedBank)}
        />
      )}
    </>
  );
};

export default Banks;
