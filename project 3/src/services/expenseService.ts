import axios from "axios";

const API_URL = "http://localhost:8080/api/expenses";

export const getExpenses = () => axios.get(API_URL);