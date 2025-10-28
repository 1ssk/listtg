import { useState, useEffect } from "react";
import { HeroSection } from "../components/HeroSection";
import { FilterBar } from "../components/FilterBar";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectModal } from "../components/ProjectModal";
import { Application } from "../types";
import { publicAPI } from "../lib/api";
import { toast } from "sonner@2.0.3";

export function HomePage() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка проектов при монтировании компонента
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await publicAPI.getApprovedProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
      toast.error("Не удалось загрузить проекты. Попробуйте обновить страницу.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filteredProjects = projects.filter((project) => {
    const typeMatch = selectedType === "all" || project.type === selectedType;
    const categoryMatch =
      selectedCategory === "all" || project.category === selectedCategory;
    return typeMatch && categoryMatch;
  });

  const handleProjectClick = (project: Application) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  return (
    <div>
      <HeroSection />

      <div id="catalog" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <FilterBar
          selectedType={selectedType}
          selectedCategory={selectedCategory}
          onTypeChange={setSelectedType}
          onCategoryChange={setSelectedCategory}
        />

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Найдено проектов: <span className="text-foreground">{filteredProjects.length}</span>
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Загрузка проектов...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          /* Projects Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="mb-2">Проекты не найдены</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить фильтры или выберите другую категорию
            </p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
