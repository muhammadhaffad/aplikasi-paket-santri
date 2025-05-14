import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
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

export const Loader = () => <div className="loader">⏳</div>;

export const Pagination = ({ tableLib, sizes }) => {
    return (
        <footer className="flex flex-col-reverse md:flex-row md:justify-between gap-4">
            <div className="flex items-center gap-2">
                <span>Show: </span>
                <select
                    className="w-full md:w-auto text-sm py-2"
                    value={tableLib.getState().pageSize}
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
}) => {
    const columns = useMemo(
        () =>
            cols.map(({ id, header, enableSorting }) => ({
                ...columnHelper.accessor(id, {
                    header,
                }),
                enableSorting,
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
    return (
        <section className="space-y-4">
            <Table>
                <TableHeader>
                    {tableLib.getHeaderGroups().map((headerGroup) => (
                        <TableRow className="hover:bg-muted bg-muted" key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    className={header.column.getCanSort() ? "cursor-pointer" : ""}
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
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan="100%">
                                <Loader />
                            </TableCell>
                        </TableRow>
                    ) : (
                        tableLib.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <Pagination tableLib={tableLib} sizes={[5, 10, 20]} />
        </section>
    );
};

export default DataTable;
