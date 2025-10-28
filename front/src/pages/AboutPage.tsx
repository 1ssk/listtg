import { Target, Users, Shield, Zap } from "lucide-react";

export function AboutPage() {
  const features = [
    {
      icon: Target,
      title: "Наша миссия",
      description:
        "Упростить поиск и открытие полезных Telegram-проектов для миллионов пользователей по всему миру",
    },
    {
      icon: Users,
      title: "Для всех",
      description:
        "Каталог создан как для обычных пользователей, так и для разработчиков ботов и владельцев каналов",
    },
    {
      icon: Shield,
      title: "Качество и безопасность",
      description:
        "Все проекты проходят тщательную модерацию перед публикацией в каталоге",
    },
    {
      icon: Zap,
      title: "Быстро и удобно",
      description:
        "Интуитивный интерфейс и умные фильтры помогают найти нужный проект за считанные секунды",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="mb-4">О проекте LISTTG.RU</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          LISTTG.RU - это современный каталог Telegram-ботов, каналов и групп, созданный для того,
          чтобы помочь вам находить полезные и интересные проекты в экосистеме Telegram.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-border p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Story Section */}
      <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 md:p-12 text-white mb-16">
        <h2 className="mb-4 text-white">Наша история</h2>
        <div className="space-y-4 text-white/90">
          <p>
            LISTTG.RU был создан в 2025 году командой энтузиастов, которые хотели упростить поиск
            качественных проектов в Telegram. Мы заметили, что многие полезные боты и каналы
            остаются незамеченными, а пользователи тратят много времени на их поиск.
          </p>
          <p>
            Наша платформа решает эту проблему, предоставляя единое место, где можно найти проверенные
            и качественные Telegram-проекты для любых нужд - от развлечений до бизнес-инструментов.
          </p>
          <p>
            Мы постоянно работаем над улучшением каталога, добавляем новые функции и расширяем базу
            проектов. Присоединяйтесь к нашему сообществу и открывайте новые возможности Telegram!
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="text-primary mb-2">500+</div>
          <p className="text-muted-foreground">Проектов в каталоге</p>
        </div>
        <div className="text-center">
          <div className="text-primary mb-2">50,000+</div>
          <p className="text-muted-foreground">Активных пользователей</p>
        </div>
        <div className="text-center">
          <div className="text-primary mb-2">10+</div>
          <p className="text-muted-foreground">Категорий проектов</p>
        </div>
      </div>

      {/* Team or CTA */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
        <h2 className="mb-4">Станьте частью каталога</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Если у вас есть интересный бот, канал или группа в Telegram, добавьте его в наш каталог.
          Это бесплатно и занимает всего несколько минут!
        </p>
        <a
          href="/add"
          className="inline-flex items-center justify-center rounded-lg px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Добавить проект
        </a>
      </div>
    </div>
  );
}
