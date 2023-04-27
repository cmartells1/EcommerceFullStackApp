import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ProductForm({ _id, title: exisitngTitle, description: exisitingDescription, price: existingPrice }) {
  const [title, setTitle] = useState(exisitngTitle || '');
  const [description, setDescription] = useState(exisitingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [goToProducts, setGoToProducts] = useState(false);

  const router = useRouter();
  console.log({ router });

  const saveProduct = async (ev) => {
    ev.preventDefault();
    const data = { title, description, price };
    if (_id) {
      await axios.put('/api/products', { ...data, _id });
    } else {
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);

  };

  if (goToProducts) {
    router.push('/products');
  }
  return (

    <form onSubmit={saveProduct}>
      <label> Product Name</label>
      <input type='text'
        placeholder='product name'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Description</label>
      <textarea
        placeholder='description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type='number'
        placeholder='price'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className='btn-primary'>Save</button>
    </form>

  );
}