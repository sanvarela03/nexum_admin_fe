import React from 'react'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/react'

// Define the shape of each column
interface ColumnDefinition {
  name: string
  uid: string
}

// Generic table props
interface AppTableProps<T> {
  list: T[]
  columns: ColumnDefinition[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderCell: (item: T, columnKey: string, ...args: any[]) => React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderCellArgs?: any[]
}

// Generic reusable table component
export default function AppTable<T>({
  list,
  columns,
  renderCell,
  renderCellArgs = [],
}: AppTableProps<T>) {
  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={list}>
        {(item) => (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <TableRow key={(item as any).id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey as string, ...renderCellArgs)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
