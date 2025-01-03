import { Badge } from '@/shared/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useReducer } from 'react'

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('name', {
    header: () => <span>name</span>,
    cell: ({ row, getValue }) => (
      <a href={row.original.html_url} target="_blank" rel="noreferrer">
        {getValue()}
      </a>
    ),
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('topics', {
    header: 'topics',
    cell: ({ row }) => {
      return (
        <>
          {row.original.topics.map((topic) => {
            return (
              <Badge
                key={topic}
                className={{ 'mr-1': true, 'bg-white': topic !== 'deprecated' }}
                variant={topic === 'deprecated' ? 'secondary' : 'outline'}
              >
                {topic}
              </Badge>
            )
          })}
        </>
      )
    },
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('description', {
    header: 'description',
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('created_at', {
    header: 'created_at',
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('updated_at', {
    header: 'updated_at',
    footer: (info) => info.column.id
  }),
  columnHelper.accessor('pushed_at', {
    header: 'pushed_at',
    footer: (info) => info.column.id
  })
]

type RepositoriesListProps = {
  data: any[]
}

export const RepositoriesList = ({ data }: RepositoriesListProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })
  const rerender = useReducer(() => ({}), {})[1]

  return (
    <div className="p-2">
      <button onClick={() => rerender()} className="p-2 border">
        Rerender
      </button>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <>
                <TableRow
                  key={row.id}
                  style={{
                    backgroundColor: row.original?.topics?.includes('deprecated') ? '#ccc' : 'none'
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              </>
            )
          })}
        </TableBody>
      </Table>
      <div className="h-4" />
    </div>
  )
}
