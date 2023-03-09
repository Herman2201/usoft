import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const fetchAllCategory = createAsyncThunk(
  'categories/allCategories',
  async () => {
    const response = await axios.get(routes.allCategory());
    return response.data;
  }
);

const categoryAdapter = createEntityAdapter();

const initialState = categoryAdapter.getInitialState({
  error: null,
  loading: true,
});

const cotegoriesSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addCategory: categoryAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCategory.fulfilled, (state, { payload }) => {
      categoryAdapter.addMany(state, payload.categories);
    });
  },
});

export const { action } = cotegoriesSlice;

export const selectorsCategoty = categoryAdapter.getSelectors(
  (state) => state.categories
);
export const getFetchStatus = (state) => state.categories.loading;

export default cotegoriesSlice.reducer;
