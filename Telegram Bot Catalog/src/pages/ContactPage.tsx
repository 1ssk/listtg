import { useState } from "react";
import { Send, Mail, MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner@2.0.3";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    // Mock submission
    console.log("Contact form submitted:", formData);
    toast.success("Сообщение успешно отправлено!");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="mb-4">Сообщение отправлено!</h2>
          <p className="text-muted-foreground mb-6">
            Спасибо за ваше сообщение. Мы постараемся ответить вам в течение 24 часов.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
              });
            }}
          >
            Отправить еще сообщение
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="mb-4">Свяжитесь с нами</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Есть вопросы или предложения? Мы всегда рады помочь и выслушать ваше мнение.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Telegram */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Send className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mb-2">Telegram</h3>
            <p className="text-muted-foreground mb-4">
              Присоединяйтесь к нашему официальному каналу
            </p>
            <a
              href="https://t.me/listtg_official"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary transition-colors"
            >
              @listtg_official
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mb-2">Email</h3>
            <p className="text-muted-foreground mb-4">
              Отправьте нам письмо
            </p>
            <a
              href="mailto:contact@listtg.ru"
              className="text-primary hover:text-secondary transition-colors"
            >
              contact@listtg.ru
            </a>
          </div>

          {/* Support */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mb-2">Поддержка</h3>
            <p className="text-muted-foreground">
              Обычно отвечаем в течение 24 часов
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-border p-8 space-y-6">
            <div>
              <h2 className="mb-2">Форма обратной связи</h2>
              <p className="text-muted-foreground">
                Заполните форму ниже, и мы свяжемся с вами в ближайшее время
              </p>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Ваше имя *</Label>
              <Input
                id="name"
                placeholder="Иван Иванов"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ivan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Subject */}
            <div>
              <Label htmlFor="subject">Тема *</Label>
              <Input
                id="subject"
                placeholder="Вопрос о модерации"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">Сообщение *</Label>
              <Textarea
                id="message"
                placeholder="Опишите ваш вопрос или предложение..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Отправить сообщение
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
