// src/lib/api.ts
import axios from 'axios';
import { Expense } from './types';

export const fetchExpenses = () => {
  return axios.get<Expense[]>('http://localhost:8080/api/transactions');
};