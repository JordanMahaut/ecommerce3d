function Table({ children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {children}
        </table>
      </div>
    </div>
  );
}

function Head({ children }) {
  return (
    <thead className="bg-slate-100">
      {children}
    </thead>
  );
}

function Body({ children }) {
  return (
    <tbody className="divide-y divide-slate-200">
      {children}
    </tbody>
  );
}

function Row({ children }) {
  return (
    <tr className="hover:bg-slate-50 transition">
      {children}
    </tr>
  );
}

function Cell({ children, header = false }) {
  const Component = header ? "th" : "td";

  return (
    <Component className="px-6 py-4 text-left text-sm">
      {children}
    </Component>
  );
}

Table.Head = Head;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;

export default Table;