export type ProjectType = "bot" | "channel" | "group";
export type ProjectStatus = "pending" | "approved" | "rejected";

export interface Application {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  link: string;
  image?: string;
  tags: string[];
  date: string;
  status: ProjectStatus;
  type: ProjectType;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIES = [
  "Музыка",
  "Образование",
  "Развлечения",
  "Новости",
  "Инструменты",
  "Бизнес",
  "Технологии",
  "Игры",
  "Спорт",
  "Другое",
];
