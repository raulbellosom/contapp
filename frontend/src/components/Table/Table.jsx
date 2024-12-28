import { Checkbox, Table as T } from 'flowbite-react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import classNames from 'classnames';

const Table = ({ columns, children, sortBy, sortedBy, selectAll }) => {
  return (
    <div className="relative sm:rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <T hoverable>
          <T.Head className="text-nowrap">
            {columns?.map((col) => (
              <T.HeadCell
                key={col?.id}
                scope="col"
                className={`${col?.order || col?.id === 'checkbox' ? '' : 'pointer-events-none'} p-4 bg-contapp-secondary text-white ${col?.id !== 'checkbox' ? 'cursor-pointer hover:bg-contapp-secondary-light hover:text-white transition-colors ease-in-out duration-100' : ''} ${col?.id === sortedBy && 'bg-contapp-secondary-light'} ${col?.classes}`}
                onClick={col?.id !== 'checkbox' ? () => sortBy(col.id) : null}
              >
                <span
                  className={classNames(
                    'flex flew-row gap-2 items-center',
                    col?.id === 'checkbox' || col?.id === 'actions'
                      ? 'justify-center'
                      : 'justify-start',
                  )}
                >
                  {col.value}
                  {col?.order && col?.id === sortedBy && (
                    <div className="cursor-pointer disabled">
                      {col.order === 'desc' ? <FaArrowDown /> : <FaArrowUp />}
                    </div>
                  )}
                  {col?.id === 'checkbox' && (
                    <Checkbox
                      className="cursor-pointer text-contapp-primary focus:ring-contapp-primary"
                      onChange={selectAll}
                    />
                  )}
                </span>
              </T.HeadCell>
            ))}
          </T.Head>
          <T.Body>{children}</T.Body>
        </T>
      </div>
    </div>
  );
};

export default Table;
