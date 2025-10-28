import { useState, useEffect } from 'react';
import {
  useQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';

import { fetchNotes } from '../../services/noteService';

import { useDebounce } from 'use-debounce';
import type { GetNoteResponse } from '../../services/noteService';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 🔹 Починаємо з 1, не з 0
  const perPage = 12;

  

  useEffect(() => {
    setCurrentPage(1); // 🔹 При новому пошуку повертаємося на 1 сторінку
  }, [debouncedQuery]);

  const { data, isLoading, error } = useQuery<GetNoteResponse>({
    queryKey: ['notes', debouncedQuery, currentPage],
    queryFn: () => fetchNotes(debouncedQuery, currentPage, perPage), // 🔹 Без +1
    placeholderData: keepPreviousData,
  });



  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage - 1} // 🔹 Якщо компонент Pagination 0-based
            onPageChange={({ selected }) => setCurrentPage(selected + 1)} // 🔹 Узгоджуємо
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {error && <ErrorMessage />}

      {data && <NoteList notes={data.notes} />}


      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => setCurrentPage(1)} // 🔹 Після створення повертаємо на 1 сторінку
          />
        </Modal>
      )}
    </div>
  );
}
