import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleSelect, selectAll, editCompany, removeSelected, addCompany } from '../../store/companySlice';

import cls from './CompanyTable.module.scss'

const CompanyTable: React.FC = () => {
  const companies = useSelector((state: RootState) => state.company.companies);
  const dispatch = useDispatch();

  // Состояние для чекбокса "Выбрать все"
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyAddress, setNewCompanyAddress] = useState('');
  const [error, setError] = useState(''); // Для отображения ошибки

  // Сброс чекбокса "Выбрать все" при удалении всех компаний
  useEffect(() => {
    if (companies.length === 0) {
      setIsAllSelected(false);
    }
  }, [companies]);

  const handleToggleSelect = (id: number) => {
    dispatch(toggleSelect(id));
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAllSelected(event.target.checked);
    dispatch(selectAll(event.target.checked));
  };

  const handleEdit = (id: number, name: string, address: string) => {
    dispatch(editCompany({ id, name, address }));
  };

  const handleRemoveSelected = () => {
    dispatch(removeSelected());
    // Сбрасываем чекбокс "Выбрать все" после удаления
    setIsAllSelected(false);
  };

  const handleAddCompany = () => {
    // Проверка на пустые поля
    if (!newCompanyName.trim() || !newCompanyAddress.trim()) {
      setError('Название и адрес компании не могут быть пустыми!'); // Устанавливаем сообщение об ошибке
      return;
    }

    const id = companies.length + 1;
    dispatch(addCompany({ id, name: newCompanyName, address: newCompanyAddress, selected: false }));
    setNewCompanyName('');
    setNewCompanyAddress('');
    setError('');
  };

  return (
    <div>
      <div className={cls.controls}>
        <div className={cls['controls__inputs']}>
          <input
            type="text"
            placeholder="Название компании"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Адрес компании"
            value={newCompanyAddress}
            onChange={(e) => setNewCompanyAddress(e.target.value)}
          />
        </div>
        {error && <p className={cls.error}>{error}</p>}
        <div className={cls.actions}>
          <button onClick={handleAddCompany}>Добавить компанию</button>
          <button onClick={handleRemoveSelected}>Удалить выделенные</button>
        </div>
      </div>

      {companies.length > 0 ? (
        <table className={cls.table}>
          <thead>
            <tr style={{ borderBottom: companies.length > 0 ? '1px solid #e5e5e5' : '' }}>
              <th>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Название компании</th>
              <th>Адрес компании</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className={company.selected ? cls.selected : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={company.selected}
                    onChange={() => handleToggleSelect(company.id)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => handleEdit(company.id, e.target.value, company.address)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={company.address}
                    onChange={(e) => handleEdit(company.id, company.name, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h2>Не создано ни одной компании</h2>
      )}
    </div>
  );
};

export default CompanyTable;
