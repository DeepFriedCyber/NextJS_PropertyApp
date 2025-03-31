'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const sortOptions = [
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Most Recent', value: 'date-desc' },
  { label: 'Most Popular', value: 'views-desc' },
  { label: 'Best Match', value: 'relevance' },
  { label: 'Square Footage', value: 'size-desc' },
] as const;

export function PropertySort({ 
  onSort, 
  currentSort 
}: { 
  onSort: (value: string) => void;
  currentSort: string;
}) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="w-full flex items-center justify-between px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
        <span>
          {sortOptions.find(opt => opt.value === currentSort)?.label || 'Sort by'}
        </span>
        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
      </Menu.Button>
      
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {sortOptions.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => onSort(option.value)}
                    className={`
                      ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                      ${currentSort === option.value ? 'bg-primary-50 text-primary-600' : ''}
                      block px-4 py-2 text-sm w-full text-left
                    `}
                  >
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

