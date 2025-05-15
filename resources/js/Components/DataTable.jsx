import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";
import SecondaryButton from "./SecondaryButton";

const columnHelper = createColumnHelper();

export function usePagination(initialSize = 5) {
    const [pagination, setPagination] = useState({
        pageSize: initialSize,
        pageIndex: 0,
    });
    const { pageSize, pageIndex } = pagination;

    return {
        // table state
        onPaginationChange: setPagination,
        pagination,
        // API
        limit: pageSize,
        skip: pageSize * pageIndex,
    };
}

export function useSorting(initialField = "id", initialOrder = "ASC") {
    const [sorting, setSorting] = useState([
        { id: initialField, desc: initialOrder === "DESC" },
    ]);

    return {
        sorting,
        onSortingChange: setSorting,
        order: !sorting.length ? initialOrder : sorting[0].desc ? "DESC" : "ASC",
        field: sorting.length ? sorting[0].id : initialField,
    };
}

export const Loader = () => <div>⏳</div>;

export const Pagination = ({ tableLib, sizes }) => {
    return (
        <footer className="flex flex-col-reverse md:flex-row md:justify-between gap-4">
            <div className="flex items-center gap-2">
                <span>Show: </span>
                <select
                    className="w-full md:w-auto text-sm py-2"
                    value={tableLib.getState().pagination.pageSize}
                    onChange={(e) => tableLib.setPageSize(parseInt(e.target.value, 10))}
                >
                    {sizes.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
                <span className="hidden md:block"> items per page</span>
            </div>
            <div className="flex md:justify-start items-center gap-2">
                <SecondaryButton
                    className="w-full"
                    disabled={!tableLib.getCanPreviousPage()}
                    onClick={() => tableLib.setPageIndex(0)}
                >
                    First
                </SecondaryButton>
                <SecondaryButton
                    className="hidden md:block"
                    disabled={!tableLib.getCanPreviousPage()}
                    onClick={tableLib.previousPage}
                >
                    Prev
                </SecondaryButton>
                <span className="hidden md:block md:whitespace-nowrap">{`page ${tableLib.getState().pagination.pageIndex + 1
                    } of ${tableLib.getPageCount()}`}</span>
                <select
                    className="w-full md:hidden text-sm py-2"
                    value={tableLib.getState().pagination.pageIndex}
                    onChange={(e) => tableLib.setPageIndex(parseInt(e.target.value, 10))}
                >
                    {[...Array(tableLib.getPageCount()).keys()].map((index) => (
                        <option key={index} value={index}>
                            {index + 1}
                        </option>
                    ))}
                </select>
                <SecondaryButton
                    className="hidden md:block "
                    disabled={!tableLib.getCanNextPage()}
                    onClick={tableLib.nextPage}
                >
                    Next
                </SecondaryButton>
                <SecondaryButton
                    className="w-full"
                    disabled={!tableLib.getCanNextPage()}
                    onClick={() => tableLib.setPageIndex(tableLib.getPageCount() - 1)}
                >
                    Last
                </SecondaryButton>
            </div>
        </footer>
    )
}

const DataTable = ({
    cols,
    data,
    loading,
    onPaginationChange,
    onSortingChange,
    rowCount,
    pagination,
    sorting,
    withPagination = true,
}) => {
    const tableContainerRef = useRef(null);
    const horizontalScrollPositionRef = useRef(0);

    const columns = useMemo(
        () =>
            cols.map((col) => ({
                ...col,
                ...columnHelper.accessor(col.id, {
                    header: col.header,
                })
            })),
        [cols],
    );

    const tableLib = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        onPaginationChange,
        onSortingChange,
        state: { pagination, sorting },
        rowCount,
    });

    // Save horizontal scroll position before re-render
    useEffect(() => {
        if (tableContainerRef.current) {
            const saveHorizontalScrollPosition = () => {
                if (loading) return;
                horizontalScrollPositionRef.current = tableContainerRef.current.scrollLeft;
            };

            const tableContainer = tableContainerRef.current;
            tableContainer.addEventListener('scroll', saveHorizontalScrollPosition);

            return () => {
                tableContainer.removeEventListener('scroll', saveHorizontalScrollPosition);
            };
        }
    }, []);

    // Restore horizontal scroll position after data updates
    useEffect(() => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollLeft = horizontalScrollPositionRef.current;
        }
    }, [data]);

    return (
        <section className="space-y-4">
            {loading ? <span className="flex items-center gap-2"><div className="animate-spin w-min">⏳</div> Loading...</span> : ''}
            <Table ref={tableContainerRef}>
                <TableHeader>
                    {tableLib.getHeaderGroups().map((headerGroup) => (
                        <TableRow className="hover:bg-muted bg-muted" key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    className={"whitespace-nowrap " + (header.column.getCanSort() ? "cursor-pointer" : "")}
                                    key={header.id}
                                    {...(header.column.getCanSort()
                                        ? { onClick: header.column.getToggleSortingHandler() }
                                        : {})}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}

                                    {header.column.getIsSorted() === "asc" ? (
                                        <span> 🔼</span>
                                    ) : header.column.getIsSorted() === "desc" ? (
                                        <span> 🔽</span>
                                    ) : null}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {tableLib.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {withPagination && <Pagination tableLib={tableLib} sizes={[5, 10, 20]} />}
        </section>
    );
};

export default DataTable;
