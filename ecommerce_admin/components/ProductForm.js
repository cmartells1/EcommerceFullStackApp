import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ProductForm({
  _id,
  title: exisitngTitle,
  description: exisitingDescription,
  price: existingPrice,
  images,
}) {
  const [title, setTitle] = useState(exisitngTitle || "");
  const [description, setDescription] = useState(exisitingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);

  const router = useRouter();

  const saveProduct = async (ev) => {
    ev.preventDefault();
    const data = { title, description, price };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  };

  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(e) {
    const files = e.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      //This will upload the photos so they can be seen but not saved to the products yet
      // const res = await axios.post("/api/upload", data, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      console.log(res);
    }
  }
  return (
    <form onSubmit={saveProduct}>
      <label> Product Name</label>
      <input
        type='text'
        placeholder='product name'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Photos</label>
      <div className='mb-2'>
        <label className='w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
            />
          </svg>
          <div>Upload</div>
          <input
            type='file'
            className='hidden'
            onChange={uploadImages}
          />
        </label>
        {!images?.length && <div>No Photos in This Product</div>}
      </div>
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
      <button
        type='submit'
        className='btn-primary'>
        Save
      </button>
    </form>
  );
}
