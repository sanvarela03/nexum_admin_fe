import React from 'react'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from '@heroui/react'

// Define the shape of each column
interface ColumnDefinition {
  name: string
  uid: string
}

interface AppTableProps<T> {
  list: T[]
  columns: ColumnDefinition[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderCell: (item: T, columnKey: string, ...args: any[]) => React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderCellArgs?: any[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  rowsPerPage: number
  onRowsPerPageChange: (rowsPerPage: number) => void
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20]

export default function AppTable<T>({
  list,
  columns,
  renderCell,
  renderCellArgs = [],
  page,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}: AppTableProps<T>) {
  return (
    <Table
      aria-label="Example table with custom cells"
      topContent={
        <div className="flex w-full justify-end items-center gap-2">
          <span className="text-sm text-gray-500">Usuarios por página:</span>
          <select
            className="text-sm border rounded px-2 py-1"
            value={rowsPerPage}
            onChange={(e) => {
              onRowsPerPageChange(Number(e.target.value))
              onPageChange(1)
            }}
          >
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      }
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPages}
            onChange={onPageChange}
          />
        </div>
      }
    >
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
          <TableRow key={(item as any).userId}>
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