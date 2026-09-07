import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/cn'
import { MicroLabel } from '../typography/MicroLabel'
import { Skeleton } from '../feedback/Skeleton'

/**
 * One description of a set of rows, drawn two ways.
 *
 * Above the small breakpoint it is a real `<table>`: a caption, a header that
 * stays put while the body scrolls, one hairline between rows, and numbers set
 * in tabular figures and aligned right so a column of them can be compared
 * down its edge rather than read one at a time.
 *
 * Below it, a table is the wrong object — five columns in 320 pixels is either
 * a sideways scroll or four words a line. So the same rows are re-laid as
 * cards: the column marked `primary` becomes the card's heading, and the rest
 * become label-and-value pairs. Nothing is dropped, because a column worth
 * showing on a laptop is worth showing on a phone.
 *
 * Loading, empty and failed are three different answers and look like three
 * different things — a placeholder that matches the rows that are coming, the
 * caller's own empty state, and a stated failure.
 *
 * @param {object} props
 * @param {string} props.caption - what the table is, for a screen reader
 * @param {{key: string, header: string, numeric?: boolean, primary?: boolean,
 *   align?: 'left'|'right', width?: string, render?: (row: object) => any,
 *   hideOnCard?: boolean}[]} props.columns
 * @param {object[]} props.rows
 * @param {(row: object) => string} props.getRowKey
 */
export function DataTable({
  className,
  caption,
  columns,
  rows,
  getRowKey,
  loading = false,
  loadingRows = 4,
  error,
  empty,
  maxHeight,
}) {
  if (error) {
    return (
      <div
        role="alert"
        className={cn(
          'flex items-start gap-3 rounded-df-md border border-df-danger bg-df-danger-soft px-4 py-4 text-[15px] leading-snug text-df-text',
          className
        )}
      >
        <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-df-danger" />
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div role="status" aria-live="polite" className={cn('flex flex-col', className)}>
        <span className="sr-only">{caption}</span>
        <div className="overflow-hidden rounded-df-md border border-df-border">
          <div className="hidden h-11 items-center gap-4 border-b border-df-border bg-df-surface-2 px-4 sm:flex">
            {columns.map(column => (
              <Skeleton key={column.key} className="h-2.5 flex-1" radius="xs" />
            ))}
          </div>
          {Array.from({ length: loadingRows }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border-b border-df-border px-4 py-4 last:border-0"
            >
              {columns.map(column => (
                <Skeleton key={column.key} className="h-3.5 flex-1" radius="xs" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (rows.length === 0) return empty ?? null

  const cardColumns = columns.filter(column => !column.hideOnCard)
  const primary = columns.find(column => column.primary) ?? columns[0]
  const cell = (column, row) => (column.render ? column.render(row) : row[column.key])

  return (
    <div className={className}>
      <div
        className={cn(
          'hidden overflow-hidden rounded-df-md border border-df-border sm:block',
          maxHeight && 'overflow-y-auto'
        )}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <table className="w-full border-collapse text-left text-[15px]">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 z-10">
            <tr className="bg-df-surface-2">
              {columns.map(column => (
                <th
                  key={column.key}
                  scope="col"
                  style={column.width ? { width: column.width } : undefined}
                  className={cn(
                    'whitespace-nowrap border-b border-df-border px-4 py-3 text-[11px] font-700 uppercase tracking-[0.14em] text-df-text-muted',
                    (column.numeric || column.align === 'right') && 'text-right'
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={getRowKey(row)}
                className="border-b border-df-border transition-colors duration-df-fast ease-df-out last:border-0 hover:bg-df-surface"
              >
                {columns.map(column => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-4 py-3.5 align-middle text-df-text-muted',
                      column.primary && 'font-600 text-df-text',
                      column.numeric && 'tabular-nums',
                      (column.numeric || column.align === 'right') && 'text-right'
                    )}
                  >
                    {cell(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 sm:hidden">
        {rows.map(row => (
          <li
            key={getRowKey(row)}
            className="rounded-df-md border border-df-border bg-df-surface p-4"
          >
            <p className="text-[15px] font-600 text-df-text">{cell(primary, row)}</p>
            <dl className="mt-3 flex flex-col gap-2 border-t border-df-border pt-3">
              {cardColumns
                .filter(column => column.key !== primary.key)
                .map(column => (
                  <div key={column.key} className="flex items-baseline justify-between gap-4">
                    <MicroLabel as="dt" tone="faint">
                      {column.header}
                    </MicroLabel>
                    <dd
                      className={cn(
                        'min-w-0 text-right text-[15px] text-df-text-muted',
                        column.numeric && 'tabular-nums'
                      )}
                    >
                      {cell(column, row)}
                    </dd>
                  </div>
                ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}
