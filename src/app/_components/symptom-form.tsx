"use client";

import { CheckCircle2, Activity, UserCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type SymptomFormProps = {
  gender: "Male" | "Female";
  age: string;
  symptoms: string;
  loading: boolean;
  profileRestored: boolean;
  onGenderChange: (gender: "Male" | "Female") => void;
  onAgeChange: (age: string) => void;
  onSymptomsChange: (symptoms: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function SymptomForm({
  gender,
  age,
  symptoms,
  loading,
  profileRestored,
  onGenderChange,
  onAgeChange,
  onSymptomsChange,
  onSubmit,
}: SymptomFormProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <header className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
          {t.home.title} <span className="text-primary">{t.home.titleHighlight}</span> {t.home.titleEnd}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t.home.subtitle}
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        {profileRestored && (
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
            <CheckCircle2 className="w-4 h-4" />
            {t.home.profileRestored}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="gender"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
            >
              {t.home.gender}
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) =>
                onGenderChange(e.target.value as "Male" | "Female")
              }
              className="lavida-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
            >
              <option value="Male">{t.home.male}</option>
              <option value="Female">{t.home.female}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="age"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
            >
              {t.home.age}
            </label>
            <input
              id="age"
              type="number"
              min="1"
              max="99"
              placeholder={t.home.agePlaceholder}
              value={age}
              onChange={(e) => onAgeChange(e.target.value)}
              className="lavida-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="symptoms"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
          >
            {t.home.symptoms}
          </label>
          <textarea
            id="symptoms"
            rows={4}
            placeholder={t.home.symptomsPlaceholder}
            value={symptoms}
            onChange={(e) => onSymptomsChange(e.target.value)}
            className="lavida-input resize-none min-h-[120px]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="lavida-button text-lg py-4"
        >
          {t.home.analyze} <Activity className="w-5 h-5" />
        </button>
      </form>

      <div className="bg-secondary/50 p-4 rounded-2xl flex items-start gap-4">
        <div className="bg-background p-2 rounded-xl shadow-sm">
          <UserCircle className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm">{t.home.privacy}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t.home.privacyDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
