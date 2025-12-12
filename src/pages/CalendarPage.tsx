import { TaskCalendar } from '@/components/calendar/TaskCalendar'

export function CalendarPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
                <p className="text-muted-foreground">
                    Visualize and manage your tasks by due date. Drag tasks to reschedule them.
                </p>
            </div>

            {/* Full Calendar */}
            <TaskCalendar title="Task Calendar" />
        </div>
    )
}
