import { Bot, Radio, Users } from "lucide-react";
import { CATEGORIES } from "../types";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FilterBarProps {
  selectedType: string;
  selectedCategory: string;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
}

export function FilterBar({
  selectedType,
  selectedCategory,
  onTypeChange,
  onCategoryChange,
}: FilterBarProps) {
  const types = [
    { value: "all", label: "Все", icon: null },
    { value: "bot", label: "Боты", icon: Bot },
    { value: "channel", label: "Каналы", icon: Radio },
    { value: "group", label: "Группы", icon: Users },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Type Filter */}
        <div className="w-full lg:w-auto">
          <label className="block mb-2 text-muted-foreground">Тип проекта</label>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  onClick={() => onTypeChange(type.value)}
                  className="flex items-center gap-2"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div className="w-full lg:w-64">
          <label className="block mb-2 text-muted-foreground">Категория</label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
