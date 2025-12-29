// API клієнт для роботи з Hero
const API_BASE_URL = "http://localhost:3002/api/v1";

class HeroApi {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Отримати Hero (публічний ендпоїнт)
  async getHero() {
    const response = await fetch(`${this.baseUrl}/public/hero`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch hero");
    }
    return response.json();
  }

  // Отримати Hero (адмінський ендпоїнт)
  async getHeroAdmin() {
    const response = await fetch(`${this.baseUrl}/hero`, {
      credentials: "include",
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch hero");
    }
    return response.json();
  }

  // Створити/оновити Hero
  async createHero(heroData) {
    const response = await fetch(`${this.baseUrl}/hero`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(heroData),
    });

    if (!response.ok) {
      throw new Error("Failed to create hero");
    }
    return response.json();
  }

  // Оновити Hero
  async updateHero(heroData) {
    const response = await fetch(`${this.baseUrl}/hero`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(heroData),
    });

    if (!response.ok) {
      throw new Error("Failed to update hero");
    }
    return response.json();
  }

  // Видалити Hero
  async deleteHero() {
    const response = await fetch(`${this.baseUrl}/hero`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete hero");
    }
    return response.json();
  }
}

export const heroApi = new HeroApi();


