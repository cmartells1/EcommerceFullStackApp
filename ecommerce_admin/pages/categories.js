import Layout from '@/components/Layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(e) {
    e.preventDefault();
    const data = { name, parentCategory };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, Delete!',
        confirmButtonColor: '#d55',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete('/api/categories?_id=' + category._id);
          fetchCategories();
        }
      })
      .catch((error) => {
        // when promise rejected...
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: '', values: '' }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : 'Create New Category'}
      </label>
      <form onSubmit={saveCategory}>
        <div className='flex gap-1'>
          <input
            type='text'
            placeholder={'Category Name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}>
            <option value=''>No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className='mb-2'>
          <label className='block'>Properties</label>
          <button
            type='button'
            className='btn-default text-sm mb-2'
            onClick={addProperty}>
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className='flex gap-1 mb-2'>
                <input
                  type='text'
                  placeholder='property name (example: color)'
                  value={property.name}
                  className='mb-0'
                  onChange={(e) =>
                    handlePropertyNameChange(index, property, e.target.value)
                  }
                />
                <input
                  type='text'
                  placeholder='values, comma seperated'
                  className='mb-0'
                  value={property.values}
                  onChange={(e) =>
                    handlePropertyValuesChange(index, property, e.target.value)
                  }
                />
                <button
                  className='btn-default'
                  type='button'
                  onClick={() => removeProperty(index)}>
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className='flex gap-1'>
          {editedCategory && (
            <button
              className='btn-default'
              type='button'
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
              }}>
              Cancel
            </button>
          )}
          <button
            type='submit'
            className='btn-primary p-1'>
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className='basic mt-4'>
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent Category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      className='btn-primary mr-1'
                      onClick={() => editCategory(category)}>
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className='btn-primary'>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
