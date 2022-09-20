import { enumType } from 'nexus';

export const status = enumType({
  name: 'status',
  members: ['success', 'error'],
});

export * from './metacritic';
export * from './firebase';
