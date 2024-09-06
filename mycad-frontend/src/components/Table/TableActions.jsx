import React from 'react';
import TableSearchByHeader from './TableSearchByHeader';
import { TextInput, Dropdown } from 'flowbite-react';
import { TbFilter } from 'react-icons/tb';
import { LuSearch } from 'react-icons/lu';
import { getButtonClassNames } from '../../utils/getButtonClassNames';

const TableActions = ({
  handleSearchTerm,
  onCheckFilter,
  filters,
  headers,
  deepSearch,
  setDeepSearch,
  vehicleConditions,
}) => {
  const CustomDropdownItem = ({ name }) => {
    return (
      <li className="flex items-center cursor-pointer hover:bg-neutral-100 px-4 py-1.5">
        <input
          id={name}
          type="checkbox"
          checked={filters?.includes(name)}
          className="w-4 h-4 bg-gray-100 border-gray-300 cursor-pointer rounded text-purple-600 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          onChange={() => onCheckFilter(name)}
        />
        <label
          htmlFor={name}
          className="ml-2 text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-100"
        >
          {name}
        </label>
      </li>
    );
  };
  return (
    <div className="w-full flex flex-wrap gap-4 justify-stretch">
      <div className="w-full flex gap-4 justify-between">
        <div className="w-full md:w-[40vw]">
          <form className="flex items-center">
            <div className="relative w-full">
              <TextInput
                icon={LuSearch}
                type="search"
                placeholder="Buscar vehículo"
                className="bg-transparent"
                onChange={handleSearchTerm}
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: '5px',
                  border: '1px solid #e2e8f0',
                }}
              />
            </div>
          </form>
        </div>
        <div className="flex justify-end">
          <Dropdown
            renderTrigger={() => (
              <button className={getButtonClassNames('indigo', false)}>
                <i>
                  <TbFilter size={18} />
                </i>
                <span className="ml-2">Filtrar</span>
              </button>
            )}
            placement="bottom-end"
            className="w-fit"
            outline
          >
            <>
              <div className="flex items-center px-4 py-2">
                <h2 className="text-sm font-semibold">
                  Filtrar por Condiciones
                </h2>
              </div>
              <Dropdown.Divider />
              <CustomDropdownItem
                key="all"
                name={
                  vehicleConditions?.length === filters?.length
                    ? 'Quitar todos'
                    : 'Seleccionar todos'
                }
              />
              <Dropdown.Divider />
              {vehicleConditions &&
                vehicleConditions?.map((condition) => (
                  <CustomDropdownItem
                    key={condition?.id}
                    name={condition?.name}
                  />
                ))}
            </>
          </Dropdown>
        </div>
      </div>
      <div className="w-full col-span-12 whitespace-nowrap flex flex-wrap">
        <TableSearchByHeader
          currentFilters={deepSearch}
          setCurrentFilters={setDeepSearch}
          headers={headers}
        />
      </div>
    </div>
  );
};

export default React.memo(TableActions);
