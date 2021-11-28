// TODO: income / outcome
// TODO: related banking products
import { v4 as uuid } from 'uuid';
import _ from 'lodash';

export const events = {
  retirement: {
    type: 'retirement',
    title: 'Retirement',
    icon: '🧓',
  },
  marriage: {
    type: 'marriage',
    title: 'Marriage',
    icon: '💍',
  },
  children: {
    type: 'children',
    title: 'Expanding family',
    icon: '🍼',
  },
  collegeFund: {
    type: 'collegeFund',
    title: 'College Fund',
    icon: '🎓',
  },
  travel: {
    type: 'travel',
    title: 'Travel', // TODO: friendlier names like "Around the world"
    icon: '✈️',
  },
  familyTrips: {
    type: 'familyTrips',
    title: 'Family trips',
    icon: '🎢',
  },
  propertyPurchase: {
    type: 'propertyPurchase',
    title: 'Buying a house',
    icon: '🏠',
  },
  carPurchase: {
    type: 'carPurchase',
    title: 'Buying a car',
    icon: '🚗',
  },
  parentsCare: {
    type: 'parentsCare',
    title: 'Taking care of parents',
    icon: '🍜',
  },
  healthcare: {
    type: 'healthcare',
    title: 'Healthcare',
    icon: '🍎',
  },
};

const products = {
  loan: {
    type: 'loan',
    title: 'Loan',
  },
  saving: {
    type: 'saving',
    title: 'Saving',
  },
  purchase: {
    type: 'purchase',
    title: 'Purchase',
  },
};

enum PaymentDirection {
  COST = 'COST',
  INCOME = 'INCOME',
}

const getCostsForEvent = (type: string, startYear: number): any[] => {
  switch (type) {
    case events.carPurchase.type:
      return [
        {
          year: startYear,
          direction: PaymentDirection.COST,
          amount: 9000,
        },
      ];
    case events.propertyPurchase.type:
      return getCostsForProduct(products.loan.type, startYear, {
        deductible: 14000,
        installment: 350 * 12,
        length: 20,
      });
    case events.marriage.type:
      return [
        {
          year: startYear,
          direction: PaymentDirection.COST,
          amount: 5000,
        },
      ];
    case events.travel.type:
      return getCostsForProduct(products.purchase.type, startYear, {
        amount: 1500,
        length: 5,
      });
    case events.familyTrips.type:
      return getCostsForProduct(products.purchase.type, startYear, {
        amount: 2500,
        length: 5,
      });
    case events.children.type:
      return getCostsForProduct(products.purchase.type, startYear, {
        amount: 300 * 12,
        length: 21,
      });
    case events.parentsCare.type:
      return getCostsForProduct(products.purchase.type, startYear, {
        amount: 150 * 12,
        length: 20,
      });
    case events.healthcare.type:
      return getCostsForProduct(products.purchase.type, startYear, {
        amount: 700,
        length: 10,
      });
    case events.retirement.type:
      return getCostsForProduct(products.saving.type, startYear - 25, {
        length: 25,
        amount: 130,
      });
    case events.collegeFund.type:
      return getCostsForProduct(products.saving.type, startYear, {
        length: 16,
        amount: 1000,
      });

    default:
      return [];
  }
};

const getCostsForProduct = (type: string, startYear: number, parameters?: any): any[] => {
  switch (type) {
    case products.loan.type:
      return [
        {
          year: startYear,
          direction: PaymentDirection.COST,
          amount: parameters.deductible,
          type,
        },
        ...Array.from({ length: parameters.length }, (year, index) => ({
          year: startYear + 1 + index,
          direction: PaymentDirection.COST,
          amount: parameters.installment,
          type,
        })),
      ];
    case products.saving.type:
      return [
        ...Array.from({ length: parameters.length }, (year, index) => ({
          year: startYear + index,
          direction: PaymentDirection.COST,
          amount: parameters.amount,
          type,
        })),
      ];

    case products.purchase.type:
      return [
        ...Array.from({ length: parameters.length }, (year, index) => ({
          year: startYear + 1 + index,
          direction: PaymentDirection.COST,
          amount: parameters.amount,
          type,
        })),
      ];
    default:
      return [];
  }
};

const plan = {
  '25': [
    { id: uuid(), ...events.carPurchase },
    { id: uuid(), ...events.travel },
  ],
  '30': [
    { id: uuid(), ...events.marriage },
    { id: uuid(), ...events.propertyPurchase },
    { id: uuid(), ...events.children },
  ],
  '40': [
    { id: uuid(), ...events.familyTrips },
    { id: uuid(), ...events.parentsCare },
  ],
  '50': [{ id: uuid(), ...events.collegeFund }],
  '60': [
    { id: uuid(), ...events.retirement },
    { id: uuid(), ...events.healthcare },
  ],
  '70': [{ id: uuid(), ...events.travel }],
  '80': [],
  '90': [],
} as any;

const transactions = Object.keys(plan).map((year) => {
  const eventsInYear = plan[year];
  const yearAsNumber = parseInt(year, 10);

  return eventsInYear.map((event: any) => getCostsForEvent(event.type, yearAsNumber));
});

const baseMonthlySalary = 3500;
const salaryYearlyGrowth = 60;

const getSalary = (startYear: number, endYear = 65) => {
  return Array.from({ length: endYear - startYear }, (year, index) => ({
    year: startYear + index,
    direction: PaymentDirection.INCOME,
    amount: (baseMonthlySalary + index * salaryYearlyGrowth) * 12,
    type: 'Salary',
  }));
};

const ownSalary = getSalary(25, 65);
const spouseSalary = getSalary(35, 65); // TODO: got married at 35 +- random!!!!

const allTransactions = [..._.flattenDeep(transactions), ...ownSalary, ...spouseSalary];

// TODO: monthly cost before + after marriage
const transactionsGroupedByYear = _.groupBy(allTransactions, (item: any) => item.year);
const incomeAndCostGroupedByYear = Object.keys(transactionsGroupedByYear).reduce(
  (all: any, current: string) => {
    const transactionsInYear = transactionsGroupedByYear[current];

    const [income, cost] = _.partition(
      transactionsInYear,
      (transaction: any) => transaction.direction === PaymentDirection.INCOME,
    );

    return {
      ...all,
      [current]: {
        [PaymentDirection.INCOME]: _.sumBy(income, (transaction: any) => transaction.amount),
        [PaymentDirection.COST]: _.sumBy(cost, (transaction: any) => transaction.amount),
      },
    };
  },
  {},
);


console.log('incomeAndCostGroupedByYear', incomeAndCostGroupedByYear)
