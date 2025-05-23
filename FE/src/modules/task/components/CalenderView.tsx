// @ts-nocheck
import { useState } from "react";
import Calendar from "react-calendar";
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
  startOfDay,
} from "date-fns";
import type { CalendarViewProps } from "../types/Task.interface";
import "react-calendar/dist/Calendar.css"; // Default react-calendar styles

// Splits a task into weekly chunks for tasks spanning multiple days
const splitTaskByWeek = (taskStart: Date, taskEnd: Date) => {
  const segments = [];

  let currentStart = startOfWeek(taskStart, { weekStartsOn: 0 });
  const lastDay = endOfWeek(taskEnd, { weekStartsOn: 0 });

  while (currentStart <= lastDay) {
    const currentEnd = endOfWeek(currentStart, { weekStartsOn: 1 });
    const segmentStart = max([taskStart, currentStart]);
    const segmentEnd = min([taskEnd, currentEnd]);
    const cleanStart = startOfDay(segmentStart); // actual value of the date
    const cleanEnd = startOfDay(segmentEnd); // actual value of the date
    const duration = differenceInDays(cleanEnd, cleanStart) + 1;

    segments.push({
      segmentStart,
      duration,
      isFirst: segmentStart.getTime() === taskStart.getTime(),
    });

    currentStart = addDays(currentEnd, 1);
  }

  return segments;
};

const CustomCalendarView = ({
  tasks,
  loading,
  error,
  handleOpenModal,
  handleEditTask,
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter tasks with valid start_date, excluding "no-date" and tasks with no start/end dates
  const flattenedTasks = !Array.isArray(tasks)
    ? Object.keys(tasks)
        .filter((key: string) => key !== "no-date")
        .flatMap((key: string) => tasks[key])
    : Array.isArray(tasks)
    ? tasks
    : [];

  const validTasks = flattenedTasks.filter((task: any) => {
    const hasStartDate =
      task.start_date &&
      task.start_date !== "no-date" &&
      isValid(parseISO(task.start_date));
    const hasEndDate = task.end_date && isValid(parseISO(task.end_date));
    // Discard tasks with no start and end date
    if (!hasStartDate && !hasEndDate) return false;
    return true;
  });

  const handleDateChange = (value: Date) => {
    setCurrentDate(value);
  };

  const getTaskSegmentsForDay = (day: Date) => {
    const segmentsForDay = [];

    validTasks.forEach((task: any) => {
      const start = parseISO(task.start_date);
      const hasValidEndDate = task.end_date && isValid(parseISO(task.end_date));
      const end = hasValidEndDate ? parseISO(task.end_date) : start;

      // console.log("start and end : -->",start, end)

      // Case 1: Task has only start date (no end date)
      if (!hasValidEndDate) {
        if (isSameDay(start, day)) {
          segmentsForDay.push({
            task,
            index: 0,
            length: 1, // Single day task
            isFirst: true,
            isStartOfSegment: true,
          });
        }
        return;
      }

      // Case 2: Task has both start and end date
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
        <div className="bg-[#FFFFFF] rounded-lg p-4 border border-[#E0E0E0] w-full">
          <style>
            {`
              .react-calendar {
                width: 100% !important;
                border: none !important;
                font-family: Arial, sans-serif;
              }
              .react-calendar__month-view__days {
                display: grid !important;
                grid-template-columns: repeat(7, minmax(0, 1fr));
                gap: 1px;
              }
              .react-calendar__tile {
                height: 100px !important;
                position: relative;
                background: #FFFFFF;
                border: 1px solid #E0E0E0 !important;
                padding: 4px;
                transition: background 0.2s;
              }
              .react-calendar__tile:hover {
                background: #F5F5F5 !important;
              }
              .react-calendar__month-view__weekdays__weekday {
                text-align: center;
                font-size: 12px;
                font-weight: 500;
                color: #757575;
                padding: 8px 0;
                text-transform: uppercase;
              }
              .react-calendar__tile--now {
                background: #FFFFFF !important; /* No highlight for current day */
              }
              .react-calendar__tile--active {
                background: #FFFFFF !important;
                color: #202124 !important;
              }
              .react-calendar__navigation {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 8px;
                gap: 16px;
              }
              .react-calendar__navigation__label {
                font-size: 14px;
                font-weight: 500;
                color: #202124;
                text-transform: uppercase;
                background: none;
                border: none;
                cursor: default;
              }
              .react-calendar__navigation__arrow {
                font-size: 14px;
                color: #757575;
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px 8px;
              }
              .react-calendar__navigation__arrow:hover {
                color: #202124;
              }
              .react-calendar__month-view__days__day--neighboringMonth {
                color: #B0B0B0;
              }
              .react-calendar__tile abbr {
                position: absolute;
                top: 4px;
                left: 4px;
                font-size: 12px;
                color: #757575;
                text-decoration: none;
              }
            `}
          </style>
          <Calendar
            value={currentDate}
            onChange={handleDateChange}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const taskSegments = getTaskSegmentsForDay(date);
                return (
                  <div className="absolute top-5 left-1 right-1 space-y-0.5">
                    {taskSegments.map((segment, idx) => (
                      <div
                        key={`${segment.task.id}-${idx}`}
                        className="bg-[#E8ECEF] text-[#202124] text-xs font-normal h-4 leading-4 px-1 rounded-sm cursor-pointer hover:bg-[#DDE2E5] transition-colors truncate"
                        style={{
                          zIndex: idx + 1,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal("view", segment.task);
                        }}
                      >
                        {segment.task.task_name}
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
            tileClassName="relative"
            navigationLabel={({ date }) => (
              <span className="text-[#202124] text-sm font-medium">
                {format(date, "MMM yyyy").toUpperCase()}
              </span>
            )}
            prevLabel={
              <span className="text-[#757575] hover:text-[#202124] text-sm font-medium transition-colors">
                &lt;
              </span>
            }
            nextLabel={
              <span className="text-[#757575] hover:text-[#202124] text-sm font-medium transition-colors">
                &gt;
              </span>
            }
            onClickDay={(date) =>
              handleOpenModal("add", {
                start_date: format(date, "yyyy-MM-dd"),
              })
            }
          />
        </div>
      )}
    </>
  );
};

export default CustomCalendarView;
