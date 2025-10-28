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

export function AddPage() {
  const [formData, setFormData] = useState({
    type: "bot" as ProjectType,
    name: "",
    link: "",
    category: "",
    shortDescription: "",
    fullDescription: "",
    tags: "",
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Размер файла не должен превышать 2 МБ");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        image: imagePreview || "", // Base64 или путь к изображению
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
              <RadioGroupItem value="bot" id="bot" className="peer sr-only" />
              <Label
                htmlFor="bot"
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
              >
                <Bot className="w-6 h-6" />
                <span>Бот</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="channel" id="channel" className="peer sr-only" />
              <Label
                htmlFor="channel"
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
              >
                <Radio className="w-6 h-6" />
                <span>Канал</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="group" id="group" className="peer sr-only" />
              <Label
                htmlFor="group"
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
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

        {/* Image Upload */}
        <div>
          <Label htmlFor="image">Изображение (JPG/PNG, до 2 МБ)</Label>
          <div className="mt-2">
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:bg-accent transition-colors"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Нажмите для загрузки изображения
                  </p>
                </div>
              )}
              <input
                id="image"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
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
