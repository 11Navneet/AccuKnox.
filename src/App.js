import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
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
} from './dashboardSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const {
    categories,
    searchTerm,
    sidebarOpen,
    selectedCategoryId,
    tempVisibility,
    newWidgetName,
    newWidgetText,
    isModalOpen,
  } = useSelector((state) => state.dashboard);

  const filteredCategories = categories.map((category) => ({
    ...category,
    widgets: category.widgets.filter((widget) =>
      widget.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  const selectedCategory = filteredCategories.find((category) => category.id === selectedCategoryId);

  const getFirstWord = (name) => {
    return name.split(' ')[0];
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-left">
          <h1>CNAPP Dashboard</h1>
        </div>
        <div className="navbar-center">
          <input
            type="text"
            placeholder="Search Widgets..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
        </div>
        <div className="navbar-right">
          <button className="add-widget-button" onClick={() => dispatch(toggleSidebar())}>
            Add Widget +
          </button>
        </div>
      </nav>
      <div className="dashboard">
        {filteredCategories.map((category) => (
          <div key={category.id} className="category">
            <h2>{category.name}</h2>
            <div className='widget-list'>
              {category.widgets.map((widget) => (
                <div key={widget.id} className="widget">
                  <div className='widget-header'>
                    <h4>{widget.name}</h4>
                    <button
                      className="remove-widget-button"
                      onClick={() => dispatch(deleteWidget({ categoryId: category.id, widgetId: widget.id }))}
                    >
                      ✖
                    </button>
                  </div>
                  <div className='widget-content'>
                    <p>{widget.text}</p>
                  </div>
                </div>
              ))}
              <div className='add-widget-div'>
                <button className="open-modal-button" onClick={() => dispatch(openModal(category.id))}>
                  + Add Widget
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2>Add Widget</h2>
            <button className="close-button" onClick={() => dispatch(toggleSidebar())}>✖</button>
          </div>
          <div className="categories-list">
            <p>Personalize your dashboard by adding the following widget</p>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${selectedCategoryId === category.id ? 'selected' : ''}`}
                onClick={() => dispatch(handleCategoryClick(category.id))}
              >
                {getFirstWord(category.name)}
              </button>
            ))}
          </div>
          <div className="widgets-list">
            {selectedCategory && selectedCategory.widgets.map((widget) => (
              <div key={widget.id} className="widget-item">
                <input
                  type="checkbox"
                  checked={tempVisibility[widget.id] || false} 
                  onChange={() => dispatch(toggleTempWidgetVisibility({ widgetId: widget.id }))}
                />
                <label>{widget.name}</label>
              </div>
            ))}

          </div>
        </div>
        <div className="sidebar-buttons">
          <button className="cancel-button" onClick={() => dispatch(handleCancel())}>Cancel</button>
          <button className="confirm-button" onClick={() => dispatch(handleConfirm())}>Confirm</button>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Widget</h2>
            <input
              type="text"
              placeholder="Widget Name"
              value={newWidgetName}
              onChange={(e) => dispatch(setNewWidgetName(e.target.value))}
            />
            <input
              type="text"
              placeholder="Widget Text"
              value={newWidgetText}
              onChange={(e) => dispatch(setNewWidgetText(e.target.value))}
            />
            <button onClick={() => dispatch(handleAddWidget())}>Confirm</button>
            <button onClick={() => dispatch(closeModal())}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
