import React from 'react';
import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Пошук нотаток..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}