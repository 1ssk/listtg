import { Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0088CC] via-[#009EFF] to-[#A855F7] py-16 sm:py-24">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
          <span className="text-white/90 px-4 py-1 bg-white/20 rounded-full backdrop-blur-sm">
            Каталог Telegram проектов
          </span>
        </div>

        <h1 className="mb-6 text-white max-w-3xl mx-auto">
          Откройте для себя лучшие боты, каналы и группы Telegram
        </h1>

        <p className="mb-8 text-white/90 max-w-2xl mx-auto">
          Добро пожаловать в LISTTG.RU — ваш путеводитель по экосистеме Telegram. 
          Находите полезные инструменты, интересные каналы и активные сообщества в одном месте.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
            asChild
          >
            <a href="#catalog">
              Смотреть каталог
            </a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
            asChild
          >
            <a 
              href="https://t.me/listtg_official" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Наш канал в Telegram
            </a>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-white mb-2">500+</div>
            <p className="text-white/80">Проектов в каталоге</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-white mb-2">50K+</div>
            <p className="text-white/80">Довольных пользователей</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-white mb-2">24/7</div>
            <p className="text-white/80">Модерация заявок</p>
          </div>
        </div>
      </div>
    </div>
  );
}
