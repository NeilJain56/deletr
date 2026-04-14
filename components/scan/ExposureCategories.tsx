import type { ExposureCategories as Categories } from "@/types/scan";

interface Props {
  categories: Categories;
}

function CategoryRow({
  label,
  value,
  color,
  details,
}: {
  label: string;
  value: string;
  color: "red" | "amber" | "green";
  details?: string[];
}) {
  const dotColor = {
    red: "bg-danger",
    amber: "bg-warning",
    green: "bg-teal",
  }[color];

  return (
    <div className="py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
          <span className="text-[14px] text-foreground">{label}</span>
        </div>
        <span className="text-[13px] text-muted-foreground">{value}</span>
      </div>
      {details && details.length > 0 && (
        <div className="ml-[18px] mt-1.5 flex flex-col gap-0.5">
          {details.map((detail, i) => (
            <span key={i} className="text-[12px] text-muted-foreground/50">
              {detail}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function ExposureCategories({ categories }: Props) {
  const rd = categories.redactedDetails;
  const rows = [
    {
      label: "Addresses",
      value: `${categories.addresses} found`,
      color: categories.addresses > 2 ? "red" : "amber",
      details: rd?.addresses,
    },
    {
      label: "Phone numbers",
      value: `${categories.phoneNumbers} found`,
      color: categories.phoneNumbers > 1 ? "red" : "amber",
      details: rd?.phoneNumbers,
    },
    {
      label: "Email addresses",
      value: `${categories.emailAddresses} found`,
      color: categories.emailAddresses > 1 ? "red" : "amber",
      details: rd?.emailAddresses,
    },
    {
      label: "Known associates",
      value:
        categories.knownAssociates > 0
          ? `${categories.knownAssociates} found`
          : "Not found",
      color: categories.knownAssociates > 0 ? "amber" : "green",
      details: rd?.associates,
    },
    {
      label: "Property records",
      value: categories.propertyRecords ? "Exposed" : "Not found",
      color: categories.propertyRecords ? "red" : "green",
    },
    {
      label: "Financial records",
      value: categories.financialRecords ? "Exposed" : "Not found",
      color: categories.financialRecords ? "red" : "green",
    },
  ] as const;

  return (
    <div className="rounded-xl border border-border">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-[13px] text-muted-foreground">Exposure categories</h3>
      </div>
      <div className="divide-y divide-border px-5">
        {rows.map((row) => (
          <CategoryRow key={row.label} {...row} />
        ))}
      </div>
    </div>
  );
}
