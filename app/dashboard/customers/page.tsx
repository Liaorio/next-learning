import { fetchFilteredCustomers } from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import Table from '@/app/ui/customers/table';
import { TableRowSkeleton } from '@/app/ui/skeletons';

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams;
  const query = params?.query || '';
  const customers = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Customers
        </h1>
        <Link
          href="/dashboard/customers/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="hidden md:block">Add Customer</span>{' '}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <Suspense key={query} fallback={<TableRowSkeleton />}>
            <Table customers={customers} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}