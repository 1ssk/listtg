import { useEffect, useState } from "react";
import { Eye, Check, X, Trash2, LogOut, LogIn } from "lucide-react";
import { Application } from "../types";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ProjectModal } from "../components/ProjectModal";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { authAPI, adminAPI } from "../lib/api";

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: "", password: "" });
  // Инициализируем как пустой массив — безопасно для .filter/.map
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    checkAuth();
  }, []);

  // Загрузка заявок при успешной аутентификации
  useEffect(() => {
    if (isAuthenticated) {
      loadApplications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch("http://localhost:8080/api/v1/admin/", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!resp.ok) {
          // обработка ошибки
          console.error("Failed to fetch applications", resp.status);
          return;
        }
        const contentType = resp.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await resp.json();
          const apps = Array.isArray(data) ? data : Array.isArray(data?.applications) ? data.applications : [];
          setApplications(apps);
        } else {
          // пришёл HTML (скорее всего фронтенд index.html) — логируем и не ломаем UI
          const text = await resp.text();
          console.warn("Expected JSON but got:", text.slice(0, 200));
          setApplications([]);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    fetchData();
  }, []);
  
  const checkAuth = async () => {
    const valid = await authAPI.validateToken();
    setIsAuthenticated(valid);
  };

  const loadApplications = async () => {
    try {
      setLoadingData(true);
      const data = await adminAPI.getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications:", error);
      toast.error("Не удалось загрузить заявки");
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.login || !loginForm.password) {
      toast.error("Введите логин и пароль");
      return;
    }

    try {
      setLoading(true);
      await authAPI.login(loginForm);
      setIsAuthenticated(true);
      toast.success("Вход выполнен успешно");
      setLoginForm({ login: "", password: "" });
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setIsAuthenticated(false);
      setApplications([]);
      toast.success("Выход выполнен");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Ошибка при выходе");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.updateApplicationStatus(id, "approved");
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "approved" as const } : app
        )
      );
      toast.success("Заявка одобрена");
    } catch (error) {
      console.error("Failed to approve:", error);
      toast.error("Не удалось одобрить заявку");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminAPI.updateApplicationStatus(id, "rejected");
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "rejected" as const } : app
        )
      );
      toast.success("Заявка отклонена");
    } catch (error) {
      console.error("Failed to reject:", error);
      toast.error("Не удалось отклонить заявку");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminAPI.deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      toast.success("Заявка удалена");
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Не удалось удалить заявку");
    }
  };

  const handleView = (project: Application) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Ожидает</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Одобрено</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Отклонено</Badge>;
    }
  };

  const getTypeLabel = (type: Application["type"]) => {
    switch (type) {
      case "bot":
        return "🤖 Бот";
      case "channel":
        return "📢 Канал";
      case "group":
        return "👥 Группа";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  // Форма входа
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#0088CC] to-[#009EFF] rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="mb-2">Вход в админ-панель</h1>
            <p className="text-muted-foreground">
              Введите логин и пароль для доступа
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="login">Логин</Label>
              <Input
                id="login"
                type="text"
                value={loginForm.login}
                onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })}
                placeholder="Введите логин"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Введите пароль"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Панель администратора
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2">Панель администратора</h1>
          <p className="text-muted-foreground">
            Управление заявками на добавление проектов
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Выйти
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <p className="text-muted-foreground mb-1">Всего заявок</p>
          <p className="text-foreground">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-6">
          <p className="text-yellow-700 mb-1">Ожидают</p>
          <p className="text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-6">
          <p className="text-green-700 mb-1">Одобрено</p>
          <p className="text-green-900">{stats.approved}</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6">
          <p className="text-red-700 mb-1">Отклонено</p>
          <p className="text-red-900">{stats.rejected}</p>
        </div>
      </div>

      {/* Loading */}
      {loadingData ? (
        <div className="bg-white rounded-2xl shadow-sm border border-border p-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Загрузка заявок...</p>
        </div>
      ) : (
        /* Table */
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[100px]">Превью</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Заявок пока нет
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        {app.image ? (
                          <ImageWithFallback
                            src={app.image}
                            alt={app.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-2xl">
                              {app.type === "bot" ? "🤖" : app.type === "channel" ? "📢" : "👥"}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="line-clamp-1">{app.name}</div>
                      </TableCell>
                      <TableCell>{getTypeLabel(app.type)}</TableCell>
                      <TableCell>{app.category}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>{formatDate(app.date)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(app)}
                            title="Просмотр"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {app.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleApprove(app.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                title="Одобрить"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleReject(app.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Отклонить"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(app.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

// сохранить совместимость с существующими импортами
export default AdminPage;
