import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Save, X, Search, ArrowLeft } from 'lucide-react';
import { useSnackbar } from 'notistack';
import menuService from '../services/menuService';

const Inventory = ({ onBack }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    itemID: 0,
    name: '',
    category: '',
    price: '',
    quantity: '',
    imagePath: '',
    isAvailable: true
  });

  // Fetch all menu items from backend
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await menuService.getAllMenuItems();
      setItems(data);
    } catch (err) {
      enqueueSnackbar('âŒ Failed to fetch menu items', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setFormData({
      itemID: 0,
      name: '',
      category: '',
      price: '',
      quantity: '',
      imagePath: '',
      isAvailable: true
    });
  };

  // Add new item
  const handleAdd = async () => {
    if (!formData.name || !formData.category || !formData.price || !formData.quantity) {
      enqueueSnackbar('âš ï¸ Please fill all required fields', { variant: 'warning' });
      return;
    }

    try {
      const newItem = await menuService.addMenuItem({
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        imagePath: formData.imagePath || '/placeholder.png',
        isAvailable: formData.isAvailable
      });

      setItems((prevItems) => [newItem, ...prevItems]);
      enqueueSnackbar(`âœ… ${formData.name} added successfully!`, { variant: 'success' });
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      enqueueSnackbar('âŒ Failed to add item', { variant: 'error' });
    }
  };

  // Update existing item
  const handleUpdate = async () => {
    if (!formData.name || !formData.category || !formData.price || !formData.quantity) {
      enqueueSnackbar('âš ï¸ Please fill all required fields', { variant: 'warning' });
      return;
    }

    const updatedData = {
      itemID: formData.itemID,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      imagePath: formData.imagePath || '/placeholder.png',
      isAvailable: formData.isAvailable
    };

    // Optimistically update UI first
    setItems(items.map(item => 
      item.itemID === updatedData.itemID ? updatedData : item
    ));
    setEditingItem(null);
    resetForm();
    enqueueSnackbar(`âœ… ${updatedData.name} updated successfully!`, { variant: 'success' });

    try {
      await menuService.updateMenuItem(updatedData);
    } catch (err) {
      // Revert on error
      fetchItems();
      enqueueSnackbar('âŒ Failed to update item', { variant: 'error' });
    }
  };

  // Delete item with confirmation
  const handleDelete = async (item) => {
    // Create custom confirmation using notistack
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?`);
    if (!confirmDelete) return;

    // Optimistically update UI first
    setItems(items.filter(i => i.itemID !== item.itemID));
    enqueueSnackbar(`🗑 ${item.name} deleted successfully!`, { variant: 'info' });

    try {
      await menuService.deleteMenuItem(item.itemID);
    } catch (err) {
      // Revert on error
      fetchItems();
      enqueueSnackbar('âŒ Failed to delete item', { variant: 'error' });
    }
  };

  // Update stock
  const handleStockUpdate = async (id, newQty, itemName) => {
    // Optimistically update UI first
    setItems(items.map(item => 
      item.itemID === id ? { ...item, quantity: newQty } : item
    ));
    enqueueSnackbar(`ðŸ“¦ ${itemName} stock updated to ${newQty}`, { variant: 'info' });

    try {
      await menuService.updateStock(id, newQty);
    } catch (err) {
      // Revert on error
      fetchItems();
      enqueueSnackbar('âŒ Failed to update stock', { variant: 'error' });
    }
  };

  const startEdit = (item) => {
    setEditingItem(item.itemID);
    setFormData({
      itemID: item.itemID,
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      imagePath: item.imagePath || '',
      isAvailable: item.isAvailable
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    resetForm();
    enqueueSnackbar('âœï¸ Edit cancelled', { variant: 'info' });
  };

  const filteredItems = items.filter(item =>
    (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.category?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-amber-800 font-semibold text-xl">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Back Button Bar */}
      <div className="bg-white shadow-sm border-b border-amber-100 px-4 sm:px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-900 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-amber-800">Inventory Management</h1>
              <p className="text-gray-600 text-sm mt-1">Manage your menu items and stock levels</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 font-semibold text-sm"
            >
              Clear
            </button>
          )}
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">Image</th>
                  <th className="px-4 py-4 text-left font-semibold">Name</th>
                  <th className="px-4 py-4 text-left font-semibold">Category</th>
                  <th className="px-4 py-4 text-left font-semibold">Price (Rs)</th>
                  <th className="px-4 py-4 text-left font-semibold">Stock</th>
                  <th className="px-4 py-4 text-left font-semibold">Status</th>
                  <th className="px-4 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg">No items found</p>
                      <p className="text-sm mt-2">Try adjusting your search or add new items</p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.itemID} className="border-b border-amber-50 hover:bg-amber-50/50 transition-colors">
                      {editingItem === item.itemID ? (
                        <>
                          <td className="px-4 py-3">
                            <img 
                              src={formData.imagePath || '/placeholder.png'} 
                              alt={formData.name} 
                              className="w-20 h-20 object-cover rounded-lg border-2 border-amber-200" 
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              value={formData.name} 
                              onChange={e => setFormData({...formData, name: e.target.value})} 
                              className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              value={formData.category} 
                              onChange={e => setFormData({...formData, category: e.target.value})} 
                              className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number" 
                              step="0.01"
                              value={formData.price} 
                              onChange={e => setFormData({...formData, price: e.target.value})} 
                              className="w-24 px-3 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number" 
                              value={formData.quantity} 
                              onChange={e => setFormData({...formData, quantity: e.target.value})} 
                              className="w-24 px-3 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                            />
                          </td>
                          <td className="px-4 py-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={formData.isAvailable} 
                                onChange={e => setFormData({...formData, isAvailable: e.target.checked})}
                                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500" 
                              />
                              <span className="text-sm font-medium">Available</span>
                            </label>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={handleUpdate} 
                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={cancelEdit} 
                                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3">
                            <img 
                              src={item.imagePath || '/placeholder.png'} 
                              alt={item.name} 
                              className="w-20 h-20 object-cover rounded-lg border-2 border-amber-100 shadow-sm" 
                            />
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{item.name}</td>
                          <td className="px-4 py-3 text-gray-600">{item.category}</td>
                          <td className="px-4 py-3 font-bold text-amber-700">Rs {item.price}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleStockUpdate(item.itemID, Math.max(0, item.quantity - 1), item.name)} 
                                className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-semibold"
                              >
                                -
                              </button>
                              <span className={`px-4 py-1 font-bold rounded-lg ${item.quantity < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => handleStockUpdate(item.itemID, item.quantity + 1, item.name)} 
                                className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-semibold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {item.isAvailable ? '✔ Available' : '❌— Unavailable'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => startEdit(item)} 
                                className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(item)} 
                                className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 border-2 border-amber-100 shadow-md">
            <p className="text-gray-600 text-sm font-medium">Total Items</p>
            <p className="text-2xl font-bold text-amber-700">{items.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-green-100 shadow-md">
            <p className="text-gray-600 text-sm font-medium">Available Items</p>
            <p className="text-2xl font-bold text-green-700">{items.filter(i => i.isAvailable).length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-red-100 shadow-md">
            <p className="text-gray-600 text-sm font-medium">Low Stock (10)</p>
            <p className="text-2xl font-bold text-red-700">{items.filter(i => i.quantity < 10).length}</p>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-amber-800">Add New Item</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Item Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" 
                  placeholder="e.g., Chicken Shawarma"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Category *</label>
                <input 
                  type="text" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" 
                  placeholder="e.g., Shawarma, Burger, Drink" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Price (Rs) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" 
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Quantity *</label>
                  <input 
                    type="number" 
                    value={formData.quantity} 
                    onChange={e => setFormData({...formData, quantity: e.target.value})} 
                    className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" 
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Image URL</label>
                <input 
                  type="text" 
                  value={formData.imagePath} 
                  onChange={e => setFormData({...formData, imagePath: e.target.value})} 
                  className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" 
                  placeholder="/placeholder.png" 
                />
              </div>
              <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <input 
                  type="checkbox" 
                  checked={formData.isAvailable} 
                  onChange={e => setFormData({...formData, isAvailable: e.target.checked})} 
                  id="available"
                  className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500" 
                />
                <label htmlFor="available" className="text-sm font-semibold text-gray-700 cursor-pointer">Available for ordering</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleAdd} 
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Add Item
                </button>
                <button 
                  onClick={() => { setShowAddModal(false); resetForm(); }} 
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;