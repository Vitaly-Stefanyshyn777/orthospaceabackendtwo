import React, { useState, useEffect } from "react";

// API клієнт для роботи з контентом
const API_BASE_URL = "http://localhost:3002/api/v1";

class ContentApi {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Отримати всі блоки контенту
  async getContent() {
    const response = await fetch(`${this.baseUrl}/content`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch content");
    return response.json();
  }

  // Оновити блок контенту
  async updateContent(id, data) {
    const response = await fetch(`${this.baseUrl}/content/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update content");
    return response.json();
  }

  // Завантажити зображення
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.baseUrl}/upload/image`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload image");
    return response.json();
  }
}

const contentApi = new ContentApi();

// Компонент для редагування блоку контенту
const ContentBlockEditor = ({ block, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: block.name || "",
    text: block.text || "",
    imageUrl: block.imageUrl || "",
  });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contentApi.updateContent(block.id, formData);
      onUpdate();
      alert("Блок оновлено!");
    } catch (error) {
      alert("Помилка оновлення: " + error.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url, publicId } = await contentApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (error) {
      alert("Помилка завантаження: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-4">
        Блок {block.blockNumber}: {block.name}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Назва блоку
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Текст блоку
          </label>
          <textarea
            value={formData.text}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, text: e.target.value }))
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Зображення
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {uploading && (
            <p className="text-sm text-blue-600">Завантаження...</p>
          )}

          {formData.imageUrl && (
            <div className="mt-2">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Оновити блок
        </button>
      </form>
    </div>
  );
};

// Основний компонент адмінки контенту
const ContentAdmin = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await contentApi.getContent();
      setContent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Завантаження...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">Помилка: {error}</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Адмінка контенту</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {content.map((block) => (
          <ContentBlockEditor
            key={block.id}
            block={block}
            onUpdate={loadContent}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentAdmin;


