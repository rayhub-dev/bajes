"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionDateTimePickerProps {
  value: string; // ISO format: YYYY-MM-DDThh:mm
  onChange: (value: string) => void;
}

export function TransactionDateTimePicker({
  value,
  onChange,
}: TransactionDateTimePickerProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  // Parse the initial value safely
  const initialDate = new Date(value);
  const isValidDate = !isNaN(initialDate.getTime());

  // Default to today if invalid
  const baseDate = isValidDate ? initialDate : new Date();

  // Keep track of the currently viewed month
  const [viewDate, setViewDate] = useState(baseDate);

  // Separate date and time parts from the ISO string
  const datePart = isValidDate && value ? value.split("T")[0] : "";
  const timePart =
    isValidDate && value && value.includes("T") ? value.split("T")[1]?.substring(0, 5) || "" : "";

  // Helper to generate days for the calendar grid
  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const days = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());

  // Pad the start of the month with empty cells based on the day of the week
  const startDayOfWeek = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Ensure we have a valid time part to stitch it back together
    const safeTimePart = timePart || "12:00";
    onChange(`${year}-${month}-${day}T${safeTimePart}`);
    setIsOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    if (newTime) {
      // If a date is selected, combine them, otherwise use current date
      const safeDatePart = datePart || new Date().toISOString().split("T")[0];
      onChange(`${safeDatePart}T${newTime}`);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        {/* Date Display Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="input-brutal flex flex-1 items-center gap-2 px-3 py-2 text-left"
        >
          <CalendarIcon size={18} className="text-gray-500" />
          <span className="flex-1 font-bold">
            {isValidDate
              ? initialDate.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Pilih Tanggal"}
          </span>
        </button>

        {/* Time Input */}
        <div className="relative w-28">
          <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="time"
            value={timePart}
            onChange={handleTimeChange}
            className="input-brutal w-full py-2 pl-9 pr-2 text-center font-display font-bold"
            style={{ colorScheme: "light dark" }}
          />
        </div>
      </div>

      {/* Calendar Popup Panel */}
      {isOpen && (
        <div className="border-3 absolute left-0 top-full z-50 mt-2 w-[calc(100%-7rem)] rounded-xl border-bajes-black bg-white p-3 shadow-brutal-sm dark:border-white/20 dark:bg-bajes-surface-dark-2 dark:shadow-brutal-dark-sm">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-bold">
              {viewDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Days Header */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {paddingDays.map((i) => (
              <div key={`padding-${i}`} className="h-8" />
            ))}
            {days.map((day) => {
              const isSelected =
                isValidDate &&
                day.getDate() === initialDate.getDate() &&
                day.getMonth() === initialDate.getMonth() &&
                day.getFullYear() === initialDate.getFullYear();

              const isToday =
                day.getDate() === new Date().getDate() &&
                day.getMonth() === new Date().getMonth() &&
                day.getFullYear() === new Date().getFullYear();

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={cn(
                    "flex h-8 w-full items-center justify-center rounded-lg text-sm font-bold transition-colors",
                    isSelected
                      ? "border-2 border-bajes-black bg-bajes-yellow text-bajes-black"
                      : isToday
                        ? "border-2 border-dashed border-gray-300 bg-gray-100 text-bajes-black dark:border-white/30 dark:bg-white/10 dark:text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10",
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
