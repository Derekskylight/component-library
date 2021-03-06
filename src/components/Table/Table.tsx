import React from 'react';
import { ColumnHeader } from './ColumnHeader';
import { Row } from './Row';
import cx from 'classnames';

export type Column<T> = {
  name: string | JSX.Element;
  cell: React.FC<{ row: T }>;
  sort?: (row: T) => number | string;
  width?: string;
  className?: string;
};

export type SortOrder = 'ascending' | 'descending';

export type TableProps<T> = {
  id: string;
  data: T[];
  rowKey: (row: T) => number | string;
  rowId?: (row: T) => string;
  columns: Column<T>[];
  defaultSortColumn?: number;
  defaultSortOrder?: SortOrder;
  onRowClick?: (row: T) => () => any;
  fullWidth?: boolean;
  caption?: string;
  className?: string;
  rowExpansionRender?: (row: T) => JSX.Element;
};

export type TableSort = {
  sortColumn?: number;
  sortOrder?: SortOrder;
};

export class Table<T> extends React.Component<TableProps<T>, TableSort> {
  constructor(props: TableProps<T>) {
    super(props);

    const { defaultSortColumn, defaultSortOrder } = props;
    this.state = { sortColumn: defaultSortColumn, sortOrder: defaultSortOrder };
  }

  setTableSort = (sort: TableSort) => {
    this.setState(sort);
  };

  render() {
    const {
      id,
      data,
      rowKey,
      rowId,
      columns,
      onRowClick,
      fullWidth,
      caption,
      rowExpansionRender,
      className,
    } = this.props;
    const { sortColumn, sortOrder } = this.state;

    const cells = columns.map((column) => column.cell);

    let sortedData = data;

    if (typeof sortColumn !== 'undefined' && sortOrder) {
      const sortBy = columns[sortColumn].sort;

      if (sortBy) {
        sortedData = data.sort((a, b) => {
          const aBy = sortBy(a);
          const bBy = sortBy(b);

          // prettier-ignore
          if (aBy === bBy) {
						return 0;
					} else if ((aBy < bBy) === (sortOrder === 'ascending')) {
						return -1;
					} else {
						return 1;
					}
        });
      }
    }

    return (
      <table
        id={id}
        className={cx(
          'oec-table',
          { 'oec-table--full-width': fullWidth },
          className
        )}
      >
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column, index) => (
              <ColumnHeader
                name={column.name}
                sortable={!!column.sort}
                sorted={sortColumn === index}
                sortOrder={sortOrder}
                index={index}
                key={index}
                setTableSort={this.setTableSort}
                width={column.width}
                className={column.className}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <Row
              row={row}
              cells={cells}
              onClick={onRowClick}
              id={!!rowId ? rowId(row) : undefined}
              key={rowKey(row)}
              expansionRender={rowExpansionRender}
            />
          ))}
        </tbody>
      </table>
    );
  }
}
