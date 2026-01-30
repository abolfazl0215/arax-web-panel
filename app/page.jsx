"use client";
import { useEffect, useState } from "react";
import { create } from "zustand";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Image as ImageIcon,
  Menu,
} from "lucide-react";
import axios from "axios";

// Zustand Store
const useStore = create((set) => ({
  tours: [],
  stays: [],
  transfers: [],

  // --------------- Tours ----------------
  addTour: async (tour) => {
    try {
      const response = await axios.post(`${API_URL}/tours`, tour);
      set((state) => ({
        tours: [...state.tours, response.data],
      }));
      return response.data;
    } catch (error) {
      console.error("Error adding tour:", error);
      throw error;
    }
  },

  updateTour: async (id, tour) => {
    try {
      const response = await axios.put(
        `${API_URL}/tours/${id}`,
        tour,
      );
      set((state) => ({
        tours: state.tours.map((t) =>
          t._id === id ? response.data : t,
        ),
      }));
      return response.data;
    } catch (error) {
      console.error("Error updating tour:", error);
      throw error;
    }
  },

  deleteTour: async (id) => {
    try {
      await axios.delete(`${API_URL}/tours/${id}`);
      set((state) => ({
        tours: state.tours.filter((t) => t._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting tour:", error);
      throw error;
    }
  },

  // --------------- Stays ----------------
  addStay: async (stay) => {
    try {
      const response = await axios.post(`${API_URL}/stays`, stay);
      set((state) => ({
        stays: [...state.stays, response.data],
      }));
      return response.data;
    } catch (error) {
      console.error("Error adding stay:", error);
      throw error;
    }
  },

  updateStay: async (id, stay) => {
    try {
      const response = await axios.put(
        `${API_URL}/stays/${id}`,
        stay,
      );
      set((state) => ({
        stays: state.stays.map((s) =>
          s._id === id ? response.data : s,
        ),
      }));
      return response.data;
    } catch (error) {
      console.error("Error updating stay:", error);
      throw error;
    }
  },

  deleteStay: async (id) => {
    try {
      await axios.delete(`${API_URL}/stays/${id}`);
      set((state) => ({
        stays: state.stays.filter((s) => s._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting stay:", error);
      throw error;
    }
  },

  // --------------- Transfers ----------------
  addTransfer: async (transfer) => {
    try {
      const response = await axios.post(
        `${API_URL}/transfers`,
        transfer,
      );
      set((state) => ({
        transfers: [...state.transfers, response.data],
      }));
      return response.data;
    } catch (error) {
      console.error("Error adding transfer:", error);
      throw error;
    }
  },

  updateTransfer: async (id, transfer) => {
    try {
      const response = await axios.put(
        `${API_URL}/transfers/${id}`,
        transfer,
      );
      set((state) => ({
        transfers: state.transfers.map((t) =>
          t._id === id ? response.data : t,
        ),
      }));
      return response.data;
    } catch (error) {
      console.error("Error updating transfer:", error);
      throw error;
    }
  },

  deleteTransfer: async (id) => {
    try {
      await axios.delete(`${API_URL}/transfers/${id}`);
      set((state) => ({
        transfers: state.transfers.filter((t) => t._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting transfer:", error);
      throw error;
    }
  },

  // --------------- Load from server ----------------
  loadData: async () => {
    try {
      const [toursRes, staysRes, transfersRes] = await Promise.all([
        axios.get(`${API_URL}/tours`),
        axios.get(`${API_URL}/stays`),
        axios.get(`${API_URL}/transfers`),
      ]);

      set({
        tours: toursRes.data || [],
        stays: staysRes.data || [],
        transfers: transfersRes.data || [],
      });
    } catch (error) {
      console.error("Error loading data from server:", error);
    }
  },
}));

const API_URL = "https://araks-web-panel-back.onrender.com/api";

// Tour Form Component
const TourForm = ({ tour, onSave, onCancel }) => {
  const updateTour = useStore((state) => state.updateTour);
  const addTour = useStore((state) => state.addTour);

  const [formData, setFormData] = useState(
    tour || {
      name: "",
      images: [],
      description: "",
      startTime: "",
      endTime: "",
      duration: "",
      price: [
        { currency: "AMD", price: "" },
        { currency: "$", price: "" },
      ],
      priceIncluded: [],
      category: "",
      location: "",
      groupSize: "",
    },
  );

  const [imageInput, setImageInput] = useState("");
  const [priceIncludedInput, setPriceIncludedInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tour && tour._id) {
        // Update existing tour
        const response = await axios.put(
          `${API_URL}/tours/${tour._id}`,
          formData,
        );
        updateTour(tour._id, response.data);
      } else {
        // Create new tour
        const response = await axios.post(
          `${API_URL}/tours`,
          formData,
        );
        addTour(response.data);
      }

      onSave(formData);
    } catch (error) {
      console.error("Error saving tour:", error);
      alert("Failed to save tour. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addPriceIncluded = () => {
    if (!priceIncludedInput.trim()) return;

    setFormData({
      ...formData,
      priceIncluded: [
        ...(formData.priceIncluded || []),
        priceIncludedInput.trim(),
      ],
    });

    setPriceIncludedInput("");
  };

  const removePriceIncluded = (index) => {
    setFormData({
      ...formData,
      priceIncluded: formData.priceIncluded.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const handlePriceChange = (index, field, value) => {
    const newPrice = [...formData.price];
    newPrice[index][field] = value;
    setFormData({ ...formData, price: newPrice });
  };

  const addPrice = () => {
    setFormData({
      ...formData,
      price: [...formData.price, { currency: "", price: "" }],
    });
  };

  const removePrice = (index) => {
    if (formData.price.length > 1) {
      setFormData({
        ...formData,
        price: formData.price.filter((_, i) => i !== index),
      });
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()],
      });
      setImageInput("");
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <form dir="ltr" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tour Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Images (URL)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addImage())
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="Enter image URL"
          />
          <button
            type="button"
            onClick={addImage}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            Add
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          rows="3"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="e.g. 8 hours"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Size
          </label>
          <input
            type="text"
            value={formData.groupSize}
            onChange={(e) =>
              setFormData({ ...formData, groupSize: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="e.g. 2-6"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pricing
        </label>

        <div className="space-y-2">
          {formData.price.map((p, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                type="text"
                value={p.currency}
                onChange={(e) =>
                  handlePriceChange(index, "currency", e.target.value)
                }
                className="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Currency"
              />

              <input
                type="text"
                value={p.price}
                onChange={(e) =>
                  handlePriceChange(index, "price", e.target.value)
                }
                className="w-full flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Amount"
              />

              {formData.price.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePrice(index)}
                  className="w-full sm:w-auto px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addPrice}
            className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add Currency
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Includes
        </label>

        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <input
            type="text"
            value={priceIncludedInput}
            onChange={(e) => setPriceIncludedInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              (e.preventDefault(), addPriceIncluded())
            }
            className="w-full flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="e.g. Transportation, Lunch, Guide"
          />

          <button
            type="button"
            onClick={addPriceIncluded}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            Add
          </button>
        </div>

        {formData.priceIncluded?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.priceIncluded.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {item}
                <button
                  type="button"
                  onClick={() => removePriceIncluded(index)}
                  className="hover:text-blue-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Cancel
        </button>
      </div>
    </form>
  );
};

// Stay Form Component
const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg " +
  "text-gray-900 placeholder-gray-400 " +
  "focus:ring-2 focus:ring-blue-500 focus:border-transparent";

const StayForm = ({ stay, onSave, onCancel }) => {
  const updateStay = useStore((state) => state.updateStay);
  const addStay = useStore((state) => state.addStay);

  const [formData, setFormData] = useState(
    stay || {
      name: "",
      type: "hotel",
      images: [],
      description: "",
      starsCount: 0,
      address: "",
      distanceToCenter: 0,
      square: 0,
      included: [],
      notes: [],
      price: [],
    }
  );

  const [imageInput, setImageInput] = useState("");
  const [includedInput, setIncludedInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (stay?._id) {
        const res = await axios.put(
          `${API_URL}/stays/${stay._id}`,
          formData
        );
        updateStay(stay._id, res.data);
      } else {
        const res = await axios.post(`${API_URL}/stays`, formData);
        addStay(res.data);
      }
      onSave(formData);
    } catch (err) {
      console.error(err);
      alert("Failed to save stay");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- helpers ---------- */
  const addPrice = () => {
    if (!priceFrom || !priceTo || !priceCurrency) return;
    setFormData({
      ...formData,
      price: [
        ...formData.price,
        {
          from: Number(priceFrom),
          to: Number(priceTo),
          currency: priceCurrency.trim(),
        },
      ],
    });
    setPriceFrom("");
    setPriceTo("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="ltr">
      {/* Name */}
      <input
        className={inputClass}
        placeholder="Stay name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        required
      />

      {/* Type */}
      <select
        className={inputClass}
        value={formData.type}
        onChange={(e) =>
          setFormData({ ...formData, type: e.target.value })
        }>
        <option value="hotel">Hotel</option>
        <option value="guesthouse">Guesthouse</option>
        <option value="apartment">Apartment</option>
        <option value="villa">Villa</option>
      </select>

      {/* Description */}
      <textarea
        rows={3}
        className={inputClass}
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      {/* Price */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-900">
          Price
        </label>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="From"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
          <input
            type="number"
            placeholder="To"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
          <input
            type="text"
            placeholder="Currency"
            value={priceCurrency}
            onChange={(e) =>
              setPriceCurrency(e.target.value.toUpperCase())
            }
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
          <button
            type="button"
            onClick={addPrice}
            className="px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg whitespace-nowrap hover:bg-gray-300">
            Add
          </button>
        </div>

        {/* Price list */}
        <ul className="mt-2 space-y-1">
          {formData.price.map((p, i) => (
            <li
              key={i}
              className="flex justify-between items-center text-gray-900 font-medium">
              <span>
                {p.from} – {p.to} {p.currency}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    price: formData.price.filter((_, x) => x !== i),
                  })
                }
                className="text-red-600 font-semibold">
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700">
          <Save className="inline w-4 h-4 mr-1" />
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </form>
  );
};


// Transfer Form Component
// Transfer Form Component
const TransferForm = ({ transfer, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    transfer || {
      name: "",
      image: "",
      passengers: 4,
      releaseYear: new Date().getFullYear(),
      insurance: true,
      features: [],
      pricePerKm: [],
    },
  );

  const [featureInput, setFeatureInput] = useState("");
  const [priceInput, setPriceInput] = useState({
    currency: "",
    price: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const addPrice = () => {
    if (priceInput.currency.trim() && priceInput.price) {
      setFormData({
        ...formData,
        pricePerKm: [...formData.pricePerKm, { ...priceInput }],
      });
      setPriceInput({ currency: "", price: "" });
    }
  };

  const removePrice = (index) => {
    setFormData({
      ...formData,
      pricePerKm: formData.pricePerKm.filter((_, i) => i !== index),
    });
  };

  return (
    <form dir="ltr" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vehicle Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image (URL)
        </label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          placeholder="Enter image URL"
        />
        {formData.image && (
          <div className="mt-2">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passenger Capacity
          </label>
          <input
            type="number"
            value={formData.passengers}
            onChange={(e) =>
              setFormData({
                ...formData,
                passengers: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Release Year
          </label>
          <input
            type="number"
            value={formData.releaseYear}
            onChange={(e) =>
              setFormData({
                ...formData,
                releaseYear: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price per Kilometer
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={priceInput.currency}
            onChange={(e) =>
              setPriceInput({
                ...priceInput,
                currency: e.target.value,
              })
            }
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="USD"
          />
          <input
            type="number"
            step="0.01"
            value={priceInput.price}
            onChange={(e) =>
              setPriceInput({ ...priceInput, price: e.target.value })
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="Enter price"
          />
          <button
            type="button"
            onClick={addPrice}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.pricePerKm.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-900">
                {item.currency}: {item.price}
              </span>
              <button
                type="button"
                onClick={() => removePrice(index)}
                className="text-red-600 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.insurance}
            onChange={(e) =>
              setFormData({
                ...formData,
                insurance: e.target.checked,
              })
            }
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Insurance Included
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Features
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addFeature())
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="Enter a feature"
          />
          <button
            type="button"
            onClick={addFeature}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="hover:text-blue-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
};

// Main Admin Panel
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("tours");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadData = useStore((state) => state.loadData);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const {
    tours,
    stays,
    transfers,
    addTour,
    updateTour,
    deleteTour,
    addStay,
    updateStay,
    deleteStay,
    addTransfer,
    updateTransfer,
    deleteTransfer,
  } = useStore();

  const handleSave = (data) => {
    if (activeTab === "tours") {
      editingItem ? updateTour(editingItem._id, data) : addTour(data);
    } else if (activeTab === "stays") {
      editingItem ? updateStay(editingItem._id, data) : addStay(data);
    } else if (activeTab === "transfers") {
      editingItem
        ? updateTransfer(editingItem._id, data)
        : addTransfer(data);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this item?")
    ) {
      if (activeTab === "tours") deleteTour(id);
      else if (activeTab === "stays") deleteStay(id);
      else if (activeTab === "transfers") deleteTransfer(id);
    }
  };

  const getCurrentData = () => {
    if (activeTab === "tours") return tours;
    if (activeTab === "stays") return stays;
    if (activeTab === "transfers") return transfers;
    return [];
  };

  const getFormComponent = () => {
    if (activeTab === "tours") {
      return (
        <TourForm
          tour={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      );
    } else if (activeTab === "stays") {
      return (
        <StayForm
          stay={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      );
    } else if (activeTab === "transfers") {
      return (
        <TransferForm
          transfer={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col lg:flex-row"
      dir="ltr">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 lg:transition-none`}>
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between lg:block mb-6 lg:mb-8">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { key: "tours", label: "Tours" },
              { key: "stays", label: "Stays" },
              { key: "transfers", label: "Transfers" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setShowForm(false);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm lg:text-base ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-lg z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="bg-white shadow-sm p-3 lg:p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
            </button>

            <h2 className="text-base lg:text-xl font-semibold text-gray-800 truncate">
              {activeTab === "tours"
                ? "Manage Tours"
                : activeTab === "stays"
                  ? "Manage Stays"
                  : "Manage Transfers"}
            </h2>
          </div>

          <button
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
            }}
            className="bg-blue-600 text-white px-3 py-2 lg:px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm lg:text-base">
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            Add New
          </button>
        </div>

        {/* Content */}
        <div className="p-3 lg:p-6">
          {showForm ? (
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 max-w-2xl mx-auto">
              <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h3>
              {getFormComponent()}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {getCurrentData().map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {item.images?.[0] || item.image ? (
                    <img
                      src={item.images?.[0] || item.image}
                      alt={item.name}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {item.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* TOURS */}
                    {activeTab === "tours" && (
                      <div className="text-sm text-gray-600 mb-4 space-y-1">
                        <p>📍 {item.location}</p>
                        <p>⏱️ {item.duration}</p>
                        <p>
                          💰 {item.price?.[1]?.price}{" "}
                          {item.price?.[1]?.currency}
                        </p>

                        {/* ✅ Price Included */}
                        {item.priceIncluded?.length > 0 && (
                          <div className="pt-2">
                            <p className="font-medium text-gray-700 mb-1">
                              Includes:
                            </p>
                            <ul className="list-disc list-inside text-xs space-y-0.5">
                              {item.priceIncluded.map((inc, i) => (
                                <li key={i}>{inc}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* STAYS */}
                    {/* STAYS */}
                    {activeTab === "stays" && (
                      <div className="space-y-2 text-sm text-gray-700">
                        {/* Type */}
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs mb-1">
                          {item.type}
                        </span>

                        {/* Stars */}
                        {item.starsCount > 0 && (
                          <p>⭐ Stars: {item.starsCount}</p>
                        )}

                        {/* Address */}
                        {item.address && (
                          <p>📍 Address: {item.address}</p>
                        )}

                        {/* Distance to Center */}
                        {item.distanceToCenter !== undefined && (
                          <p>
                            🚶 Distance to Center:{" "}
                            {item.distanceToCenter} km
                          </p>
                        )}

                        {/* Square */}
                        {item.square !== undefined && (
                          <p>📐 Square: {item.square} m²</p>
                        )}

                        {/* Included */}
                        {item.included?.length > 0 && (
                          <div>
                            <p className="font-medium">Includes:</p>
                            <ul className="list-disc list-inside text-xs text-gray-600">
                              {item.included.map((inc, i) => (
                                <li key={i}>{inc}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Notes */}
                        {item.notes?.length > 0 && (
                          <div>
                            <p className="font-medium">Notes:</p>
                            <ul className="list-disc list-inside text-xs text-gray-600">
                              {item.notes.map((note, i) => (
                                <li key={i}>{note}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Price */}
                        {item.price?.length > 0 && (
                          <div className="mb-4">
                            <p className="font-medium">Price:</p>
                            <ul className="list-disc list-inside text-xs text-gray-600">
                              {item.price.map((p, i) => (
                                <li key={i}>
                                  {p.from} - {p.to} {p.currency}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TRANSFERS */}
                    {activeTab === "transfers" && (
                      <div className="text-sm text-gray-600 mb-4 space-y-1">
                        <p>👥 {item.passengers} passengers</p>
                        <p>📅 {item.releaseYear}</p>
                        <div>
                          <p className="font-medium mb-1">
                            💲 Price per km:
                          </p>
                          <div className="space-y-1 pl-4">
                            {item.pricePerKm &&
                            item.pricePerKm.length > 0 ? (
                              item.pricePerKm.map(
                                (priceItem, index) => (
                                  <p key={index}>
                                    {priceItem.currency}:{" "}
                                    {priceItem.price}
                                  </p>
                                ),
                              )
                            ) : (
                              <p className="text-gray-400">
                                No prices set
                              </p>
                            )}
                          </div>
                        </div>
                        {item.insurance && (
                          <p>✅ Insurance included</p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2 text-sm">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2 text-sm">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
