import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [
    {
      id: 'cspm_executive_dashboard',
      name: 'CSPM Executive Dashboard',
      widgets: [],
    },
    {
      id: 'cwpp_dashboard',
      name: 'CWPP Dashboard',
      widgets: [],
    },
  ],
  searchTerm: '',
  sidebarOpen: false,
  selectedCategoryId: null,
  tempVisibility: {},
  isModalOpen: false,
  newWidgetName: '',
  newWidgetText: '',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    handleCategoryClick(state, action) {
      state.selectedCategoryId = action.payload;
    
      const selectedCategory = state.categories.find(category => category.id === action.payload);
      if (selectedCategory) {
        state.tempVisibility = selectedCategory.widgets.reduce((acc, widget) => {
          acc[widget.id] = state.tempVisibility[widget.id] !== undefined ? state.tempVisibility[widget.id] : true;
          return acc;
        }, {});
      }
    },
    toggleTempWidgetVisibility(state, action) {
      const { widgetId } = action.payload;
      if (state.tempVisibility[widgetId] !== undefined) {
        state.tempVisibility[widgetId] = !state.tempVisibility[widgetId];
      }
    },
    deleteWidget(state, action) {
      const { categoryId, widgetId } = action.payload;
      const category = state.categories.find(category => category.id === categoryId);
      if (category) {
        category.widgets = category.widgets.filter(widget => widget.id !== widgetId);
      }
    },
    handleConfirm(state) {
      if (state.selectedCategoryId) {
        state.categories = state.categories.map(category => {
          if (category.id === state.selectedCategoryId) {
            return {
              ...category,
              widgets: category.widgets.filter(widget => state.tempVisibility[widget.id])
            };
          }
          return category;
        });
      }
      state.sidebarOpen = false;
      state.tempVisibility = {};
    },
    handleCancel(state) {
      state.sidebarOpen = false;
      state.tempVisibility = {};
    },
    openModal(state, action) {
      state.selectedCategoryId = action.payload;
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.newWidgetName = '';
      state.newWidgetText = '';
    },
    handleAddWidget(state) {
      const newWidget = {
        id: `widget_${Date.now()}`,
        name: state.newWidgetName,
        text: state.newWidgetText,
      };
      state.categories = state.categories.map((category) => {
        if (category.id === state.selectedCategoryId) {
          return {
            ...category,
            widgets: [...category.widgets, newWidget],
          };
        }
        return category;
      });
      state.tempVisibility[newWidget.id] = true;
      state.isModalOpen = false;
      state.newWidgetName = '';
      state.newWidgetText = '';
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setNewWidgetName(state, action) {
      state.newWidgetName = action.payload;
    },
    setNewWidgetText(state, action) {
      state.newWidgetText = action.payload;
    }
  },
});

export const {
  toggleSidebar,
  handleCategoryClick,
  toggleTempWidgetVisibility,
  deleteWidget,
  handleConfirm,
  handleCancel,
  openModal,
  closeModal,
  handleAddWidget,
  setSearchTerm,
  setNewWidgetName,
  setNewWidgetText,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
