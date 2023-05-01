import Layout from '@/components/Layout';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Categories() {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveCategory(e) {
    e.preventDefault();
    await axios.post('/api/categories', { name });
    setName('');
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label> New category name</label>
      <form
        onSubmit={saveCategory}
        className='flex gap-1'>
        <input
          type='text'
          placeholder={'Category Name'}
          className='mb-0'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type='submit'
          className='btn-primary p-1'>
          Save
        </button>
      </form>
      <table className='basic mt-4'>
        <thead>
          <tr>
            <td>Category Name</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr>
                <td>{category.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
