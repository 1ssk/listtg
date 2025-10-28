import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { HelpCircle } from "lucide-react";

export function FAQPage() {
  const faqs = [
    {
      question: "Как добавить свой проект в каталог?",
      answer:
        "Перейдите на страницу 'Добавить проект', заполните форму с информацией о вашем боте, канале или группе, и отправьте заявку. После модерации (обычно 24-48 часов) ваш проект появится в каталоге.",
    },
    {
      question: "Платное ли размещение в каталоге?",
      answer:
        "Нет, размещение проектов в LISTTG.RU полностью бесплатное. Мы не берем плату за добавление или публикацию ботов, каналов и групп.",
    },
    {
      question: "Какие требования к проектам для публикации?",
      answer:
        "Проект должен быть активным, легальным и не нарушать правила Telegram. Мы не публикуем проекты, связанные с мошенничеством, спамом, распространением запрещенного контента или нарушением авторских прав.",
    },
    {
      question: "Сколько времени занимает модерация?",
      answer:
        "Обычно модерация занимает от 24 до 48 часов. Мы проверяем все заявки вручную, чтобы обеспечить высокое качество каталога.",
    },
    {
      question: "Почему моя заявка была отклонена?",
      answer:
        "Заявка может быть отклонена, если проект не соответствует нашим требованиям: неактивный бот/канал, недостаточно информации в описании, нарушение правил Telegram, дубликат существующего проекта или низкое качество контента.",
    },
    {
      question: "Могу ли я изменить информацию о проекте после публикации?",
      answer:
        "Да, свяжитесь с нами через форму обратной связи или Telegram-канал, указав ID вашего проекта и желаемые изменения. Мы обработаем ваш запрос в течение 24 часов.",
    },
    {
      question: "Как проекты ранжируются в каталоге?",
      answer:
        "По умолчанию проекты показываются от новых к старым. Мы также учитываем популярность и качество проекта. В будущем планируем добавить систему рейтингов и отзывов пользователей.",
    },
    {
      question: "Можно ли добавить несколько проектов?",
      answer:
        "Да, вы можете добавить неограниченное количество проектов. Каждый проект должен быть уникальным и соответствовать требованиям каталога.",
    },
    {
      question: "Как удалить мой проект из каталога?",
      answer:
        "Отправьте запрос на удаление через форму обратной связи, указав название и ссылку на ваш проект. Мы удалим его в течение 24 часов.",
    },
    {
      question: "Есть ли API для интеграции с каталогом?",
      answer:
        "Мы работаем над публичным API, который позволит разработчикам интегрировать наш каталог в свои приложения. Следите за обновлениями в нашем Telegram-канале.",
    },
    {
      question: "Как связаться с поддержкой?",
      answer:
        "Вы можете связаться с нами через форму на странице 'Контакты', написать в наш официальный Telegram-канал @listtg_official или отправить письмо на contact@listtg.ru.",
    },
    {
      question: "Какие категории проектов доступны?",
      answer:
        "В каталоге представлены следующие категории: Музыка, Образование, Развлечения, Новости, Инструменты, Бизнес, Технологии, Игры, Спорт и Другое. Если вы считаете, что нужна новая категория, свяжитесь с нами.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="mb-4">Часто задаваемые вопросы</h1>
        <p className="text-muted-foreground">
          Ответы на популярные вопросы о работе с LISTTG.RU
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Still have questions */}
      <div className="mt-12 text-center bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
        <h3 className="mb-3 text-white">Не нашли ответ на свой вопрос?</h3>
        <p className="mb-6 text-white/90">
          Свяжитесь с нами через форму обратной связи или наш Telegram-канал
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contacts"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-white text-primary hover:bg-white/90 transition-colors"
          >
            Форма обратной связи
          </a>
          <a
            href="https://t.me/listtg_official"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            Telegram-канал
          </a>
        </div>
      </div>
    </div>
  );
}
