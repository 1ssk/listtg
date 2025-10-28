import { Bot, Radio, Users, ExternalLink, Calendar, Tag } from "lucide-react";
import { Application } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProjectModalProps {
  project: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  if (!project) return null;

  const getTypeIcon = () => {
    switch (project.type) {
      case "bot":
        return <Bot className="w-5 h-5" />;
      case "channel":
        return <Radio className="w-5 h-5" />;
      case "group":
        return <Users className="w-5 h-5" />;
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
      month: "long",
      year: "numeric"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getTypeIcon()}
            </div>
            {project.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {project.image && (
            <div className="relative h-64 rounded-xl overflow-hidden bg-muted">
              <ImageWithFallback
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1">
              {getTypeIcon()}
              {getTypeLabel()}
            </Badge>
            <Badge variant="outline">{project.category}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(project.date)}
            </Badge>
          </div>

          {/* Short Description */}
          <div>
            <h4 className="mb-2">Краткое описание</h4>
            <p className="text-muted-foreground">{project.shortDescription}</p>
          </div>

          {/* Full Description */}
          <div>
            <h4 className="mb-2">Полное описание</h4>
            <p className="text-muted-foreground whitespace-pre-line">
              {project.fullDescription}
            </p>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Теги
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full"
            asChild
          >
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Открыть в Telegram
              <ExternalLink className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
