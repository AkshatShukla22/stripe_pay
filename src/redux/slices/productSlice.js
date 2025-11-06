import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../utils/api';

export const getProducts = createAsyncThunk('products/getProducts', async () => {
  const response = await fetchProducts();
  return response.data;
});

export const addProduct = createAsyncThunk('products/addProduct', async (productData) => {
  const response = await createProduct(productData);
  return response.data;
});

export const editProduct = createAsyncThunk('products/editProduct', async ({ id, data }) => {
  const response = await updateProduct(id, data);
  return response.data;
});

export const removeProduct = createAsyncThunk('products/removeProduct', async (id) => {
  await deleteProduct(id);
  return id;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export default productSlice.reducer;