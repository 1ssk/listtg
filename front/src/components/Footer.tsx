import { Send, Github, Mail } from "lucide-react";
import { Link } from "../lib/router";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="mb-4">О проекте</h3>
            <p className="text-muted-foreground">
              LISTTG.RU - каталог лучших Telegram-ботов, каналов и групп. Упрощаем поиск полезных проектов.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/add" className="text-muted-foreground hover:text-primary transition-colors">
                  Добавить проект
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  О проекте
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4">Связаться</h3>
            <div className="space-y-3">
              <a
                href="https://t.me/listtg_official"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Send className="w-5 h-5" />
                Telegram канал
              </a>
              <a
                href="mailto:contact@listtg.ru"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                contact@listtg.ru
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; 2025 LISTTG.RU. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
