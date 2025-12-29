import React, { useState, useEffect } from "react";

// API клієнт для роботи з колекціями
const API_BASE_URL = "http://localhost:3002/api/v1";

class CollectionsApi {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Отримати альбом з колекціями
  async getAlbumWithCollections(albumSlug = "before-after") {
    const response = await fetch(
      `${this.baseUrl}/public/gallery/albums/${albumSlug}`
    );
    if (!response.ok) throw new Error("Failed to fetch collections");
    return response.json();
  }
}

const collectionsApi = new CollectionsApi();

// Компонент для відображення однієї пари
const PairCard = ({ pair }) => {
  return (
    <div className="pair-card bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <img
            src={pair.beforePhoto.url}
            alt="До"
            className="w-full h-24 object-cover rounded"
            onError={(e) => {
              console.log("Before photo failed to load:", pair.beforePhoto.url);
              e.currentTarget.style.display = "none";
            }}
          />
          <p className="text-center text-xs text-blue-600 mt-1">До</p>
        </div>
        <div className="text-lg">→</div>
        <div className="flex-1">
          <img
            src={pair.afterPhoto.url}
            alt="Після"
            className="w-full h-24 object-cover rounded"
            onError={(e) => {
              console.log("After photo failed to load:", pair.afterPhoto.url);
              e.currentTarget.style.display = "none";
            }}
          />
          <p className="text-center text-xs text-green-600 mt-1">Після</p>
        </div>
      </div>
      {pair.label && (
        <p className="text-center text-gray-600 text-sm mt-2">{pair.label}</p>
      )}
    </div>
  );
};

// Компонент для відображення колекції
const CollectionCard = ({ collection }) => {
  return (
    <div className="collection-card bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Колекція {collection.id}
        </h3>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {collection.count} пар
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collection.pairs.map((pair, index) => (
          <PairCard key={pair.id || index} pair={pair} />
        ))}
      </div>
    </div>
  );
};

// Основний компонент для колекцій
const CollectionsGallery = () => {
  const [collections, setCollections] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await collectionsApi.getAlbumWithCollections("before-after");
      setCollections(data.collections || []);
      setPhotos(data.photos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-8">Завантаження колекцій...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">Помилка: {error}</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Колекції "До/Після"
      </h1>

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            📸 Колекції ще не створені
          </div>
          <p className="text-gray-600">
            Завантажте 3+3 фото з мітками "До" та "Після" для автоматичного
            створення колекцій
          </p>
        </div>
      ) : (
        <div>
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Знайдено {collections.length} колекцій з{" "}
              {collections.reduce((sum, c) => sum + c.count, 0)} парами
            </p>
          </div>

          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}

      {/* Додаткова інформація про фото */}
      {photos.length > 0 && (
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Всі фото в альбомі</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="text-center">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-20 object-cover rounded mb-2"
                />
                <div className="text-xs">
                  <div
                    className={`inline-block px-2 py-1 rounded ${
                      photo.tag === "before"
                        ? "bg-blue-100 text-blue-800"
                        : photo.tag === "after"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {photo.tag === "before"
                      ? "До"
                      : photo.tag === "after"
                      ? "Після"
                      : "Загальне"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsGallery;


