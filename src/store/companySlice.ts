import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Интерфейс компании
interface Company {
  id: number;
  name: string;
  address: string;
  selected: boolean;
}

interface CompanyState {
  companies: Company[];
}

// Функция для загрузки данных из localStorage
const loadFromLocalStorage = (): Company[] => {
  try {
    const serializedData = localStorage.getItem('companies');
    if (serializedData === null) {
      return [];
    }
    return JSON.parse(serializedData);
  } catch (err) {
    console.error('Не удалось загрузить данные из localStorage:', err);
    return [];
  }
};

// Функция для сохранения данных в localStorage
const saveToLocalStorage = (companies: Company[]) => {
  try {
    const serializedData = JSON.stringify(companies);
    localStorage.setItem('companies', serializedData);
  } catch (err) {
    console.error('Не удалось сохранить данные в localStorage:', err);
  }
};

const initialState: CompanyState = {
    companies: loadFromLocalStorage().length > 0 ? loadFromLocalStorage() : [
      { id: 1, name: 'Company A', address: '1234 Elm Street', selected: false },
      { id: 2, name: 'Company B', address: '5678 Oak Avenue', selected: false },
      { id: 3, name: 'Company C', address: '91011 Maple Lane', selected: false },
    ],
  };  

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    toggleSelect: (state, action: PayloadAction<number>) => {
      const company = state.companies.find((c) => c.id === action.payload);
      if (company) {
        company.selected = !company.selected;
      }
      saveToLocalStorage(state.companies); // Сохраняем после изменения
    },
    selectAll: (state, action: PayloadAction<boolean>) => {
      state.companies.forEach((c) => (c.selected = action.payload));
      saveToLocalStorage(state.companies); // Сохраняем после изменения
    },
    editCompany: (state, action: PayloadAction<{ id: number; name: string; address: string }>) => {
      const company = state.companies.find((c) => c.id === action.payload.id);
      if (company) {
        company.name = action.payload.name;
        company.address = action.payload.address;
      }
      saveToLocalStorage(state.companies); // Сохраняем после изменения
    },
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.push(action.payload);
      saveToLocalStorage(state.companies); // Сохраняем после добавления
    },
    removeSelected: (state) => {
      state.companies = state.companies.filter((c) => !c.selected);
      saveToLocalStorage(state.companies); // Сохраняем после удаления
    },
  },
});

export const { toggleSelect, selectAll, editCompany, addCompany, removeSelected } = companySlice.actions;
export default companySlice.reducer;
