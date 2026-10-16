import { redirect } from "next/navigation";

interface NewReportPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NewReportPage({ searchParams }: NewReportPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const query = new URLSearchParams();

  for (const [key, val] of Object.entries(resolvedParams)) {
    if (typeof val === "string") {
      query.set(key, val);
    } else if (Array.isArray(val) && val[0]) {
      query.set(key, val[0]);
    }
  }

  const queryString = query.toString();
  const target = queryString ? `/daily-report?${queryString}` : "/daily-report";

  redirect(target);
}
