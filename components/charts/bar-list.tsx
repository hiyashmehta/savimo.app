import { BarList } from '@tremor/react';

const datahero = [
  { name: '/home', value: 456 },
  { name: '/imprint', value: 351 },
  { name: '/cancellation', value: 51 },
];

export const BarListHero = () => (
  <>
    <BarList data={datahero} className="mx-auto max-w-sm" />
  </>
);