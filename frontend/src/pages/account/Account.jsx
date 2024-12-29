import React, { useCallback, useMemo, useState } from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import { useBanks } from '../../hooks/useBanks';
const Table = React.lazy(() => import('../../components/Table/Table'));
import { Accordion, Spinner, Table as T } from 'flowbite-react';
import ModalFormikForm from '../../components/Modals/ModalFormikForm';
import AccountFormFields from '../../components/Account/AccountFormFields';
import {
  AccountFormSchema,
  AccountTypesValues,
} from '../../components/Account/AccountFormSchema';
import TableHeader from '../../components/Table/TableHeader';
import { FaWallet } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import TableActions from '../../components/Table/TableActions';
import { AccountsColumns } from '../../utils/TableColumns';
import ModalRemove from '../../components/Modals/ModalRemove';
import { FormattedUrlImage } from '../../utils/FormattedUrlImage';
import { parseMoney } from '../../utils/formatValues';
import { TiArrowSortedDown } from 'react-icons/ti';
import { GiArchiveResearch } from 'react-icons/gi';

const InitValues = {
  name: '',
  type: '',
  balance: 0,
  color: '#000000',
  bankId: '',
  id: '',
};

const Account = () => {
  const {
    accounts,
    fetchAccounts,
    removeAccount,
    createNewAccount,
    modifyAccount,
  } = useAccounts();

  const { banks } = useBanks();
  const [formValues, setFormValues] = useState(InitValues);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const filteredAccounts = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return accounts.filter((account) => {
      const bankName = account.bank?.name?.toLowerCase() || '';
      const accountName = account.name.toLowerCase();
      const accountTypeLabel =
        AccountTypesValues.find(
          (type) => type.value === account.type,
        )?.label.toLowerCase() || '';
      const accountBalance = account.balance.toString();

      return (
        bankName.includes(lowerCaseSearchTerm) ||
        accountName.includes(lowerCaseSearchTerm) ||
        accountTypeLabel.includes(lowerCaseSearchTerm) ||
        accountBalance.includes(lowerCaseSearchTerm)
      );
    });
  }, [accounts, searchTerm]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAccounts = useMemo(() => {
    const sorted = [...filteredAccounts];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Si la columna a ordenar es `type`, usa la etiqueta en español
        if (sortConfig.key === 'type') {
          const aLabel =
            AccountTypesValues.find((type) => type.value === aValue)?.label ||
            '';
          const bLabel =
            AccountTypesValues.find((type) => type.value === bValue)?.label ||
            '';
          aValue = aLabel;
          bValue = bLabel;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredAccounts, sortConfig]);

  const handleDelete = (id) => {
    removeAccount.mutate(id);
    setShowModalRemove(false);
  };

  const handleSubmit = (values) => {
    if (editMode) {
      modifyAccount.mutate(values);
    } else {
      createNewAccount.mutate(values);
    }
    setShowModal(false);
    setFormValues(InitValues);
    setEditMode(false);
  };

  const handleRefreshData = () => {
    fetchAccounts.refetch();
  };

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Estado de carga y error del fetch
  if (fetchAccounts.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (fetchAccounts.isError) {
    return (
      <div className="text-center text-red-500">
        <p>Error al cargar las cuentas: {fetchAccounts.error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto w-full">
        <div className=" mb-4 w-full">
          <TableHeader
            title={'Cuentas'}
            icon={FaWallet}
            actions={[
              {
                label: 'Nueva Cuenta',
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
          <TableActions
            onRefreshData={handleRefreshData}
            handleSearchTerm={handleSearch}
          />
        </div>
        {filteredAccounts && filteredAccounts?.length > 0 ? (
          <table className="w-full">
            <thead className="bg-contapp-dark text-white w-full">
              <tr className="w-full">
                <th className="md:hidden py-3 px-4 text-left w-fit md:w-48 rounded-tl-xl hover:bg-contapp-primary-light cursor-pointer">
                  Banco
                </th>
                <th className="md:hidden py-3 px-4 text-left w-full md:w-40 rounded-tr-xl md:rounded-none hover:bg-contapp-primary-light cursor-pointer">
                  Nombre de la Cuenta
                </th>
                {AccountsColumns.map((col, index) => {
                  return (
                    <th
                      key={index}
                      onClick={() =>
                        col.id !== 'actions' &&
                        col.id !== 'color' &&
                        handleSort(col.id)
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
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sortedAccounts.map((account) => (
                <tr
                  className="hidden md:table-row md:border-b w-full md:hover:bg-indigo-100 odd:bg-indigo-50 border-b border-b-neutral-100"
                  key={account.id}
                >
                  <td className="font-bold p-4">
                    <img
                      src={FormattedUrlImage(account.bank?.logo)}
                      alt={account.bank?.name}
                      className="w-8 h-8 rounded-md inline-block mr-2"
                    />
                    {account.bank?.name}
                  </td>
                  <td className="p-4">{account.name}</td>
                  <td className="p-4">
                    {
                      AccountTypesValues?.find(
                        (type) => type.value === account.type,
                      )?.label
                    }
                  </td>
                  <td className="p-4">{parseMoney(account.balance)}</td>
                  <td className="p-4 text-center">
                    <span
                      className="inline-block w-6 h-6 rounded-full"
                      style={{ backgroundColor: account.color }}
                    ></span>
                  </td>
                  <td className="flex items-center gap-2 max-w-64 p-4">
                    <ActionButtons
                      onEdit={() => {
                        setFormValues(account);
                        setEditMode(true);
                        setShowModal(true);
                      }}
                      onRemove={() => {
                        setSelectedAccount(account.id);
                        setShowModalRemove(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
              {filteredAccounts.map((account) => (
                <tr className="table-row md:hidden" key={account.id}>
                  <td className="w-fit flex flex-col gap-2 text-xs justify-start items-start p-4">
                    <img
                      src={FormattedUrlImage(account.bank?.logo)}
                      alt={account.bank?.name}
                      className="w-8 h-8 rounded-md"
                    />
                    <p className="text-xs">{account.bank?.name}</p>
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
                          {account.name}
                        </Accordion.Title>
                        <Accordion.Content>
                          <div className="flex flex-col gap-4">
                            <div>
                              <p className="text-sm font-bold">Tipo</p>
                              <p className="text-sm">
                                {
                                  AccountTypesValues?.find(
                                    (type) => type.value === account.type,
                                  )?.label
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-bold">Balance</p>
                              <p className="text-sm">
                                {parseMoney(account.balance)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-bold">
                                Color representativo
                              </p>
                              <span
                                className="inline-block w-6 h-6 rounded-full"
                                style={{ backgroundColor: account.color }}
                              ></span>
                            </div>
                            <ActionButtons
                              onEdit={() => {
                                setFormValues(account);
                                setEditMode(true);
                                setShowModal(true);
                              }}
                              onRemove={() => {
                                setSelectedAccount(account.id);
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
            <p>No se encontraron cuentas.</p>
          </div>
        )}
      </div>
      <ModalFormikForm
        saveLabel={editMode ? 'Actualizar' : 'Crear'}
        formFields={
          <AccountFormFields
            accountTypes={AccountTypesValues}
            banks={banks}
            editMode={editMode}
          />
        }
        initialValues={formValues}
        isOpenModal={showModal}
        onClose={() => setShowModal(false)}
        schema={AccountFormSchema}
        title={editMode ? 'Editar Cuenta' : 'Nueva Cuenta'}
        size={'xl'}
        onSubmit={handleSubmit}
      />
      <ModalRemove
        isOpenModal={showModalRemove}
        onCloseModal={() => {
          setShowModalRemove(false);
          setSelectedAccount(null);
        }}
        removeFunction={() => handleDelete(selectedAccount)}
      />
    </>
  );
};

export default Account;
