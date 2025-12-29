import React, { useState, useEffect } from "react";

// API клієнт для отримання контенту
const API_BASE_URL = "http://localhost:3002/api/v1";

class PublicContentApi {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Отримати всі блоки контенту
  async getContent() {
    const response = await fetch(`${this.baseUrl}/public/content`);
    if (!response.ok) throw new Error("Failed to fetch content");
    return response.json();
  }
}

const publicContentApi = new PublicContentApi();

// Компонент для відображення блоку контенту
const ContentBlock = ({ block }) => {
  if (!block.text && !block.imageUrl) {
    return null; // Не показувати порожні блоки
  }

  return (
    <div className="content-block mb-8">
      {block.imageUrl && (
        <div className="mb-4">
          <img
            src={block.imageUrl}
            alt={block.name}
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              console.log("Image failed to load:", block.imageUrl);
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      {block.text && (
        <div className="text-content">
          <h2 className="text-2xl font-bold mb-4">{block.name}</h2>
          <p className="text-gray-700 leading-relaxed">{block.text}</p>
        </div>
      )}
    </div>
  );
};

// Основний компонент для відображення контенту
const ContentDisplay = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await publicContentApi.getContent();
      setContent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-8">Завантаження контенту...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">Помилка: {error}</div>
    );

  // Фільтрувати тільки блоки з контентом
  const contentBlocks = content.filter((block) => block.text || block.imageUrl);

  if (contentBlocks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-4">
          📝 Контент ще не додано
        </div>
        <p className="text-gray-600">
          Адміністратор ще не заповнив блоки контенту
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Наш контент</h1>

      <div className="space-y-8">
        {contentBlocks.map((block) => (
          <ContentBlock key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
};

export default ContentDisplay;


