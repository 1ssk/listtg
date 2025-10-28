import { Bot, Radio, Users, ExternalLink, Calendar } from "lucide-react";
import { Application } from "../types";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";

interface ProjectCardProps {
  project: Application;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getTypeIcon = () => {
    switch (project.type) {
      case "bot":
        return <Bot className="w-4 h-4" />;
      case "channel":
        return <Radio className="w-4 h-4" />;
      case "group":
        return <Users className="w-4 h-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (project.type) {
      case "bot":
        return "Бот";
      case "channel":
        return "Канал";
      case "group":
        return "Группа";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {project.image ? (
          <ImageWithFallback
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
            {getTypeIcon()}
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-foreground backdrop-blur-sm flex items-center gap-1">
            {getTypeIcon()}
            {getTypeLabel()}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1">{project.name}</h3>
          <Badge variant="outline" className="shrink-0">
            {project.category}
          </Badge>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2">
          {project.shortDescription}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(project.date)}</span>
          </div>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-primary hover:text-secondary transition-colors"
          >
            <span className="text-sm">Открыть</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
