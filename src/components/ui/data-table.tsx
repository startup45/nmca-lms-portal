
"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    cell?: (item: T) => React.ReactNode;
  }[];
  searchKeys?: string[];
  itemsPerPage?: number;
  emptyMessage?: string;
  showSearch?: boolean;
  className?: string;
  exportOptions?: {
    filename?: string;
    enableCSV?: boolean;
    enablePDF?: boolean;
    enableWord?: boolean;
  };
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  searchKeys = [],
  itemsPerPage = 10,
  emptyMessage = "No data available",
  showSearch = true,
  className = "",
  exportOptions,
  actions
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = searchTerm.trim() === "" 
    ? data
    : data.filter(item => 
        searchKeys.some(key => {
          const value = item[key];
          return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
  // Export functions
  const exportToCSV = () => {
    try {
      const headers = columns.map(col => col.header).join(",");
      const rows = filteredData
        .map(row => 
          columns.map(col => {
            const value = row[col.key];
            // Handle special characters in CSV
            if (typeof value === 'string' && (value.includes(",") || value.includes("\n") || value.includes("\""))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(",")
        )
        .join("\n");
      
      const csvContent = `${headers}\n${rows}`;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${exportOptions?.filename || "export"}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV export successful");
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast.error("Error exporting to CSV");
    }
  };

  const exportToPDF = () => {
    // In a real app, we would use a library like pdfmake or jspdf
    toast.info("PDF export functionality would be implemented here");
  };

  const exportToWord = () => {
    // In a real app, we would use a library like docx
    toast.info("Word export functionality would be implemented here");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {showSearch && searchKeys.length > 0 && (
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
        )}
        
        {exportOptions && (
          <div className="flex flex-wrap gap-2">
            {exportOptions.enableCSV && (
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                Export CSV
              </Button>
            )}
            {exportOptions.enablePDF && (
              <Button variant="outline" size="sm" onClick={exportToPDF}>
                Export PDF
              </Button>
            )}
            {exportOptions.enableWord && (
              <Button variant="outline" size="sm" onClick={exportToWord}>
                Export Word
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className={className}>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.header}</TableHead>
                ))}
                {actions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={actions ? columns.length + 1 : columns.length} className="text-center py-6 text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, idx) => (
                  <TableRow key={idx} className="group">
                    {columns.map((column) => (
                      <TableCell key={`${idx}-${column.key}`} className="[&:has([role=checkbox])]:pl-3">
                        {column.cell ? column.cell(row) : row[column.key]}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell>
                        {actions(row)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {/* Show page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // For pagination logic
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
                if (i === 4) pageNum = totalPages;
                if (i === 3 && totalPages > 5) pageNum = -1; // For ellipsis
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
                if (i === 0) pageNum = 1;
                if (i === 1 && totalPages > 5) pageNum = -1; // For ellipsis
              } else {
                pageNum = currentPage - 2 + i;
                if (i === 0) pageNum = 1;
                if (i === 4) pageNum = totalPages;
                if (i === 1 || i === 3) pageNum = -1; // For ellipsis
              }
              
              if (pageNum === -1) {
                return (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <span className="h-9 w-9 flex items-center justify-center">...</span>
                  </PaginationItem>
                );
              }
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink 
                    onClick={() => setCurrentPage(pageNum)} 
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
