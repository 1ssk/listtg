import { Application, ProjectStatus } from "../types";

const API_BASE_URL = "http://localhost:8080/api/v1";

// Типы для API запросов
export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}

export interface UpdateStatusRequest {
  id: string;
  status: ProjectStatus;
}

export interface DeleteRequest {
  id: string;
}

// Публичные endpoints
export const publicAPI = {
  // GET /api/v1/bot - Получить все одобренные проекты
  getApprovedProjects: async (): Promise<Application[]> => {
    const resp = await fetch("http://localhost:8080/api/v1/bot/", { credentials: "include" });
    if (!resp.ok) throw new Error("Failed to fetch projects");
    const ct = resp.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return [];
    const data = await resp.json();
    // API может возвращать либо массив, либо объект { applications: [...] }
    return Array.isArray(data) ? data : Array.isArray(data?.applications) ? data.applications : [];
  },

  // POST /api/v1/bot/addApplication - Добавить новую заявку
  addApplication: async (data: Omit<Application, "id" | "status" | "createdAt" | "updatedAt">): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bot/addApplication`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add application");
      }
    } catch (error) {
      console.error("Error adding application:", error);
      throw error;
    }
  },
};

// Аутентификация endpoints
export const authAPI = {
  // POST /api/v1/auth/login - Авторизация
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Для cookies
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  // GET /api/v1/auth/validate - Проверка токена
  validateToken: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        credentials: "include", // Для cookies
      });

      return response.ok;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  },

  // POST /api/v1/auth/logout - Выход из системы
  logout: async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Для cookies
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },
};

// Административные endpoints
export const adminAPI = {
  // GET /api/v1/admin/ - Получить все заявки
  getAllApplications: async (): Promise<Application[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/`, {
        credentials: "include", // Для cookies с токеном
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  },

  // DELETE /api/v1/admin/delete - Удалить заявку
  deleteApplication: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Для cookies с токеном
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      throw error;
    }
  },

  // POST /api/v1/admin/update - Обновить статус заявки
  updateApplicationStatus: async (id: string, status: ProjectStatus): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Для cookies с токеном
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      throw error;
    }
  },
};

export async function updateApplicationStatus(id: string, status: string) {
  const resp = await fetch("http://localhost:8080/api/v1/admin/update", {
    method: "PUT",
    credentials: "include", // если используете cookie/session
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  if (!resp.ok) throw new Error("Failed to update application status");
  return resp.json();
}
