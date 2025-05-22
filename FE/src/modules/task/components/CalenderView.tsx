// @ts-nocheck
import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getMonth,
  getYear,
  parseISO,
  differenceInDays,
  isValid,
  isSameDay,
  startOfWeek,
  endOfWeek,
  max,
  min,
  addDays,
} from "date-fns";
import type { CalendarViewProps } from "../types/Task.interface";

// Splits a task into weekly chunks
const splitTaskByWeek = (taskStart: Date, taskEnd: Date) => {
  const segments = [];

  let currentStart = startOfWeek(taskStart, { weekStartsOn: 0 });
  const lastDay = endOfWeek(taskEnd, { weekStartsOn: 0 });

  while (currentStart <= lastDay) {
    const currentEnd = endOfWeek(currentStart, { weekStartsOn: 0 });

    const segmentStart = max([taskStart, currentStart]);
    const segmentEnd = min([taskEnd, currentEnd]);
    const duration = differenceInDays(segmentEnd, segmentStart) + 1;

    segments.push({
      segmentStart,
      duration,
      isFirst: segmentStart.getTime() === taskStart.getTime(),
    });

    currentStart = addDays(currentEnd, 1);
  }

  return segments;
};

const CalendarView = ({
  tasks,
  loading,
  error,
  handleOpenModal,
  handleEditTask,
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));

  // Filter tasks with valid start_date, excluding "no-date"
  const flattenedTasks = !Array.isArray(tasks)
    ? Object.keys(tasks)
        .filter((key: string) => key !== "no-date")
        .flatMap((key: string) => tasks[key])
    : Array.isArray(tasks)
    ? tasks
    : [];
  const validTasks = flattenedTasks.filter(
    (task: any) =>
      task.start_date &&
      task.start_date !== "no-date" &&
      isValid(parseISO(task.start_date))
  );

  // Generate days for the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfMonth = monthStart.getDay();
  const weeksInMonth = Math.ceil((daysInMonth.length + firstDayOfMonth) / 7);

  // Month navigation
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthChange = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    setCurrentDate(new Date(selectedYear, monthIndex, 1));
  };

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    setSelectedMonth(getMonth(newDate));
    setSelectedYear(getYear(newDate));
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    setSelectedMonth(getMonth(newDate));
    setSelectedYear(getYear(newDate));
  };

  const getTaskSegmentsForDay = (day: Date) => {
    const segmentsForDay = [];

    validTasks.forEach((task: any) => {
      const start = parseISO(task.start_date);
      const hasValidEndDate = task.end_date && isValid(parseISO(task.end_date));
      const end = hasValidEndDate ? parseISO(task.end_date) : start;

      const segments = splitTaskByWeek(start, end);

      segments.forEach((segment, i) => {
        const segDate = segment.segmentStart;
        for (let j = 0; j < segment.duration; j++) {
          const date = addDays(segDate, j);
          if (isSameDay(date, day)) {
            segmentsForDay.push({
              task,
              index: j,
              length: segment.duration,
              isFirst: segment.isFirst,
              isStartOfSegment: j === 0,
            });
          }
        }
      });
    });

    return segmentsForDay;
  };

  return (
    <>
      {loading && (
        <p className="text-[#202124] text-center text-sm">Loading tasks...</p>
      )}
      {error && <p className="text-[#D93025] text-center text-sm">{error}</p>}
      {!loading && !error && (
        <div className="bg-[#FFFFFF] rounded-lg p-4 shadow-sm border border-[#DADCE0]">
          <h2 className="text-[#202124] text-lg font-medium mb-3">
            Calendar View
          </h2>
          <div className="flex gap-4">
            {/* Month Navigation */}
            <div className="w-40">
              <div className="bg-[#F1F3F4] rounded-md p-2">
                <h3 className="text-[#202124] text-sm font-medium mb-2">
                  {selectedYear}
                </h3>
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthChange(index)}
                    className={`w-full text-left px-2 py-1 text-sm font-medium ${
                      selectedMonth === index
                        ? "bg-[#1A73E8] text-white rounded"
                        : "text-[#202124] hover:bg-[#E8EAED]"
                    } transition-colors`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
            {/* Calendar Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={handlePrevMonth}
                  className="text-[#1A73E8] hover:text-[#1557B0] text-sm font-medium transition-colors"
                >
                  ← Prev
                </button>
                <h3 className="text-[#202124] text-base font-medium">
                  {format(currentDate, "MMMM yyyy")}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="text-[#1A73E8] hover:text-[#1557B0] text-sm font-medium transition-colors"
                >
                  Next →
                </button>
              </div>
              <div
                className="grid grid-cols-7 gap-px bg-[#DADCE0]"
                style={{
                  gridTemplateRows: `repeat(${weeksInMonth}, minmax(120px, 1fr))`,
                }}
              >
                {/* Day Headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-[#5F6368] text-xs font-medium text-center py-2 bg-[#F8F9FA] border-b border-[#DADCE0]"
                    >
                      {day}
                    </div>
                  )
                )}
                {/* Empty cells before month start */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="bg-[#F8F9FA] border-r border-[#DADCE0]"
                  />
                ))}
                {/* Days of the month */}
                {daysInMonth.map((day: any) => {
                  const taskSegments = getTaskSegmentsForDay(day);

                  return (
                    <div
                      key={day.toISOString()}
                      className="bg-[#FFFFFF] border-r border-[#DADCE0] p-2 relative cursor-pointer hover:bg-[#F1F3F4] transition-colors"
                      onClick={() =>
                        handleOpenModal("add", {
                          start_date: format(day, "yyyy-MM-dd"),
                        })
                      }
                    >
                      <span className="text-[#5F6368] text-xs font-medium absolute top-2 left-2">
                        {format(day, "d")}
                      </span>
                      <div className="mt-6 space-y-1">
                        {taskSegments.map((segment, idx) => (
                          <div
                            key={`${segment.task.id}-${idx}`}
                            className="relative bg-[#E0E0E0] text-[#202124] text-xs font-medium py-1 px-2 rounded-md cursor-pointer hover:bg-[#D0D0D0] transition-colors truncate"
                            style={{
                              marginTop: `${idx * 18}px`,
                              width: `${(100 / 7) * segment.length}%`,
                              zIndex: idx + 1,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal("view", segment.task);
                            }}
                          >
                            {segment.index === 0
                              ? segment.task.task_name || "Unnamed Task"
                              : ""}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarView;
