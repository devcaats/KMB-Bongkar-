const Table = ({ children, className = "" }) => (
    <table className={`min-w-full ${className}`}>{children}</table>
);

const TableHeader = ({ children, className = "" }) => (
    <thead className={className}>{children}</thead>
);

const TableBody = ({ children, className = "" }) => (
    <tbody className={className}>{children}</tbody>
);

const TableRow = ({ children, className = "" }) => (
    <tr className={className}>{children}</tr>
);

const TableCell = ({ children, isHeader = false, className = "", ...rest }) => {
    const CellTag = isHeader ? "th" : "td";
    return <CellTag className={className} {...rest}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
