import type { Key, ReactNode, TableHTMLAttributes } from 'react';

export interface TableColumn<Row> {
  id: string;
  header: ReactNode;
  accessor?: keyof Row;
  render?: (row: Row, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;
}

export interface TableProps<Row> extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  columns: TableColumn<Row>[];
  rows: Row[];
  rowKey: keyof Row | ((row: Row, index: number) => Key);
  emptyMessage?: ReactNode;
  caption?: ReactNode;
}

export function Table<Row>({
  columns,
  rows,
  rowKey,
  emptyMessage = 'No data',
  caption,
  className = '',
  ...props
}: TableProps<Row>) {
  const getRowKey = (row: Row, index: number): Key => typeof rowKey === 'function'
    ? rowKey(row, index)
    : String(row[rowKey]);
  return <div className="aisee-table-wrap">
    <table {...props} className={`aisee-table ${className}`.trim()}>
      {caption && <caption>{caption}</caption>}
      <thead><tr>{columns.map((column) => <th key={column.id} scope="col" data-align={column.align ?? 'left'}>{column.header}</th>)}</tr></thead>
      <tbody>{rows.length ? rows.map((row, rowIndex) => <tr key={getRowKey(row, rowIndex)}>
        {columns.map((column) => {
          const content = column.render
            ? column.render(row, rowIndex)
            : column.accessor === undefined ? null : String(row[column.accessor] ?? '');
          return <td key={column.id} data-align={column.align ?? 'left'} data-numeric={column.numeric || undefined}>{content}</td>;
        })}
      </tr>) : <tr><td className="aisee-table__empty" colSpan={columns.length}>{emptyMessage}</td></tr>}</tbody>
    </table>
  </div>;
}
