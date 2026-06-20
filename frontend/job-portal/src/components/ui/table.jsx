import { cn } from "@/lib/utils";

function Table({ className, ...props }) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }) {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />;
}

function TableBody({ className, ...props }) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

function TableRow({ className, ...props }) {
  return <tr data-slot="table-row" className={cn("border-b border-[var(--rushd-border)] transition-colors hover:bg-[var(--rushd-card)]", className)} {...props} />;
}

function TableHead({ className, ...props }) {
  return <th data-slot="table-head" className={cn("h-12 whitespace-nowrap px-4 text-right align-middle text-xs font-bold text-[var(--rushd-muted)]", className)} {...props} />;
}

function TableCell({ className, ...props }) {
  return <td data-slot="table-cell" className={cn("whitespace-nowrap px-4 py-4 align-middle", className)} {...props} />;
}

function TableCaption({ className, ...props }) {
  return <caption data-slot="table-caption" className={cn("mt-4 text-sm text-[var(--rushd-muted)]", className)} {...props} />;
}

export { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow };
