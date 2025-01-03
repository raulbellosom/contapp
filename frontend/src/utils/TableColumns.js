export const AccountsColumns = [
  {
    id: 'bankId',
    value: 'Banco',
    type: 'text',
    order: 'asc',
  },
  {
    id: 'name',
    value: 'Nombre',
    type: 'text',
    order: 'asc',
  },
  {
    id: 'type',
    value: 'Tipo',
    type: 'text',
    order: 'asc',
  },
  {
    id: 'balance',
    value: 'Balance',
    type: 'text',
    order: 'asc',
  },
  {
    id: 'color',
    value: 'Color',
    type: 'text',
    order: 'asc',
  },
  {
    id: 'actions',
    value: 'Acciones',
    type: 'actions',
    classes: 'text-center',
  },
];

export const BanksColumns = [
  { id: 'name', value: 'Nombre' },
  { id: 'country', value: 'País' },
  { id: 'actions', value: 'Acciones' },
];

export const TransactionsColumns = [
  { id: 'accountId', value: 'Cuenta', type: 'text', order: 'asc' },
  { id: 'date', value: 'Fecha', type: 'date', order: 'asc' },
  { id: 'amount', value: 'Monto' },
  { id: 'cateogryId', value: 'Categoria' },
  { id: 'description', value: 'Descripción' },
  { id: 'actions', value: 'Acciones' },
];

export const CategoriesColumns = [
  { id: 'name', value: 'Nombre', type: 'text', order: 'asc' },
  { id: 'type', value: 'Tipo', type: 'text', order: 'asc' },
  { id: 'description', value: 'Descripción', type: 'text', order: 'asc' },
  { id: 'actions', value: 'Acciones', type: 'actions' },
];
