import React, { useState } from "react";
import "../styles/MemberTable.css";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
const columnHelper = createColumnHelper();

const MemberTable = ({ data, onEdit, onDelete, onRenew, showRenewButton }) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("fullName", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("emailAddress", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("phoneNumber", {
      header: "Phone",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("gender", {
      header: "Gender",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("dateOfBirth", {
      header: "DOB",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("address", {
      header: "Address",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("membershipType", {
      header: "Membership",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("membershipStartDate", {
      header: "Start Date",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("membershipEndDate", {
      header: "End Date",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("active", {
      header: "Active",
      cell: (info) => (info.getValue() ? "Yes" : "No"),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="action-buttons">
          <button onClick={() => onEdit(row.original)} className="edit-btn">
            Edit
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="delete-btn"
          >
            Delete
          </button>
          {showRenewButton && (
            <button onClick={() => onRenew(row.original)} className="renew-btn">
              Renew
            </button>
          )}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="member-table-container">
      <input
        className="member-search-input"
        type="text"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search members..."
      />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
