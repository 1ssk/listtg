import { useState } from "react";
import { Bot, Radio, Users, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { CATEGORIES, ProjectType } from "../types";
import { toast } from "sonner@2.0.3";
import { publicAPI } from "../lib/api";
import { ImageWithFallback } from "../components/ImageWithFallback";

export function AddPage() {
  const [formData, setFormData] = useState({
    type: "bot" as ProjectType,
    name: "",
    link: "",
    category: "",
    shortDescription: "",
    fullDescription: "",
    tags: "",
    image: "",
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  });
  
  const [imagePreviewError, setImagePreviewError] = useState(false); // ДОБАВЛЕНО: Отслеживание ошибок загрузки превью
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);



  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreviewError(false); // Сбрасываем ошибку при изменении URL
    
    // Простая валидация URL
    if (url && !isValidImageUrl(url)) {
      toast.error("Пожалуйста, введите корректный URL изображения");
    }
  };

    const isValidImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(urlObj.pathname) || 
             urlObj.hostname.includes('unsplash.com') ||
             urlObj.hostname.includes('imgur.com') ||
             urlObj.hostname.includes('cloudinary.com');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.link || !formData.category || 
        !formData.shortDescription || !formData.fullDescription) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    if (formData.shortDescription.length > 100) {
      toast.error("Краткое описание не должно превышать 100 символов");
      return;
    }

    if (formData.fullDescription.length > 500) {
      toast.error("Полное описание не должно превышать 500 символов");
      return;
    }

    try {
      setLoading(true);

      // Подготовка данных для отправки
      const applicationData = {
        name: formData.name,
        category: formData.category,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        link: formData.link,
        image: formData.image || "", // Base64 или путь к изображению
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        date: formData.date,
        type: formData.type,
      };

      await publicAPI.addApplication(applicationData);
      
      toast.success("Заявка успешно отправлена на модерацию!");
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit application:", error);
      toast.error("Не удалось отправить заявку. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      type: "bot",
      name: "",
      link: "",
      category: "",
      shortDescription: "",
      fullDescription: "",
      tags: "",
      image: "",
      date: new Date().toISOString().split('T')[0],
    });
    setImageFile(null);
    setImagePreview(null);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="mb-4">Заявка отправлена!</h2>
          <p className="text-muted-foreground mb-6">
            Ваша заявка успешно отправлена на модерацию. Обычно проверка занимает от 24 до 48 часов.
            Мы уведомим вас о результатах через Telegram.
          </p>
          <Button onClick={resetForm}>
            Добавить еще проект
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="mb-2">Добавить проект</h1>
        <p className="text-muted-foreground">
          Заполните форму ниже, чтобы добавить свой бот, канал или группу в каталог
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-border p-8 space-y-6">
        {/* Project Type */}
        <div>
          <Label>Тип проекта *</Label>
          <RadioGroup
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as ProjectType })}
            className="grid grid-cols-3 gap-4 mt-2"
          >
            <div>
              <RadioGroupItem value="bot" id="bot" className="sr-only" />
              <Label
                htmlFor="bot"
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all
                  ${formData.type === "bot"
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-muted bg-popover hover:bg-accent hover:text-accent-foreground"}`}
              >
                <Bot className="w-6 h-6" />
                <span>Бот</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="channel" id="channel" className="sr-only" />
              <Label
                htmlFor="channel"
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all
                  ${formData.type === "channel"
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-muted bg-popover hover:bg-accent hover:text-accent-foreground"}`}
              >
                <Radio className="w-6 h-6" />
                <span>Канал</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="group" id="group" className="sr-only" />
              <Label
                htmlFor="group"
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all
                  ${formData.type === "group"
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-muted bg-popover hover:bg-accent hover:text-accent-foreground"}`}
              >
                <Users className="w-6 h-6" />
                <span>Группа</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name">Название проекта *</Label>
          <Input
            id="name"
            placeholder="Например: Music Finder Bot"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        {/* Link */}
        <div>
          <Label htmlFor="link">Ссылка на Telegram *</Label>
          <Input
            id="link"
            type="url"
            placeholder="https://t.me/your_project"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            required
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Категория *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Short Description */}
        <div>
          <Label htmlFor="shortDescription">
            Краткое описание * (до 100 символов)
          </Label>
          <Textarea
            id="shortDescription"
            placeholder="Краткое описание вашего проекта"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            maxLength={100}
            rows={2}
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            {formData.shortDescription.length}/100
          </p>
        </div>

        {/* Full Description */}
        <div>
          <Label htmlFor="fullDescription">
            Полное описание * (до 500 символов)
          </Label>
          <Textarea
            id="fullDescription"
            placeholder="Подробное описание возможностей и функций вашего проекта"
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            maxLength={500}
            rows={5}
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            {formData.fullDescription.length}/500
          </p>
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags">Теги (через запятую)</Label>
          <Input
            id="tags"
            placeholder="музыка, поиск, аудио"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>

        {/* URL изображения */}
        <div>
          <Label htmlFor="image" className="text-gray-900">
            🖼️ URL изображения (опционально)
          </Label>
          <Input
            id="image"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Если не указано, будет использовано изображение по умолчанию
          </p>
              
          {/* Предпросмотр изображения */}
          {formData.image && (
            <div className="mt-3">
              <p className="text-sm text-gray-700 mb-2">Предпросмотр:</p>
              <div className="w-full max-w-sm aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <ImageWithFallback
                  src={formData.image}
                  alt="Предпросмотр"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div> 


        {/* Submit Button */}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Отправка..." : "Отправить на модерацию"}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          После отправки заявка будет проверена модераторами в течение 24-48 часов
        </p>
      </form>
    </div>
  );
}
