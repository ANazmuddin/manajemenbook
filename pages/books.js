import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/globals.css';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('available');
  const [search, setSearch] = useState('');
  const [editingBookId, setEditingBookId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data } = await supabase.from('books').select('*');
    setBooks(data);
  };

  const addBook = async () => {
    if (title && author) {
      await supabase.from('books').insert([{ title, author, status }]);
      resetForm();
      fetchBooks();
    }
  };

  const updateBook = async () => {
    if (editingBookId && title && author) {
      await supabase
        .from('books')
        .update({ title, author, status })
        .eq('id', editingBookId);
      resetForm();
      fetchBooks();
    }
  };

  const deleteBook = async (id) => {
    await supabase.from('books').delete().eq('id', id);
    fetchBooks();
  };

  const resetForm = () => {
    setEditingBookId(null);
    setTitle('');
    setAuthor('');
    setStatus('available');
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
          📚 Manajemen Buku Hidayat Nur Wahid 📚
        </h1>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Cari buku..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>

        {/* Form tambah/edit buku */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Judul Buku"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Penulis"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
            </select>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={editingBookId ? updateBook : addBook}
              className={`px-5 py-2 rounded-lg text-white font-medium shadow-sm ${
                editingBookId ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
              } transition duration-300`}
            >
              {editingBookId ? 'Simpan Perubahan' : 'Tambah Buku'}
            </button>
            {editingBookId && (
              <button
                onClick={resetForm}
                className="ml-4 px-5 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-300"
              >
                Batalkan
              </button>
            )}
          </div>
        </div>

        {/* List of Books */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{book.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{book.author}</p>
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg ${
                  book.status === 'available'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {book.status}
              </span>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => {
                    setEditingBookId(book.id);
                    setTitle(book.title);
                    setAuthor(book.author);
                    setStatus(book.status);
                  }}
                  className="px-4 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBook(book.id)}
                  className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Books Illustration */}
        {filteredBooks.length === 0 && (
          <div className="text-center mt-10">
            <img
              src="/img/bg.png"
              alt="No Books Illustration"
              className="mx-auto mb-4"
            />
            <p className="text-gray-600">Belum ada buku yang tersedia. Tambahkan buku sekarang!</p>
          </div>
        )}
      </div>
    </div>
  );
}
