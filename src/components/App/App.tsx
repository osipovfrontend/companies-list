import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import CompanyTable from '../CompanyTable/CompanyTable';

import cls from './App.module.scss'

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className={cls.app}>
        <h1>Список компаний</h1>
        <CompanyTable />
      </div>
    </Provider>
  );
};

export default App;
