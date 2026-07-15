import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UIState, FilterMode, SortMode} from '../types';

const initialState: UIState = {
  isModalVisible: false,
  modalType: null,
  searchQuery: '',
  filterMode: FilterMode.ALL,
  sortMode: SortMode.NEWEST,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setFilterMode(state, action: PayloadAction<FilterMode>) {
      state.filterMode = action.payload;
    },
    setSortMode(state, action: PayloadAction<SortMode>) {
      state.sortMode = action.payload;
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.filterMode = FilterMode.ALL;
      state.sortMode = SortMode.NEWEST;
    },
  },
});

export const {setSearchQuery, setFilterMode, setSortMode, resetFilters} =
  uiSlice.actions;
export default uiSlice.reducer;
