import Card from '../ui/Card'
import Badge from '../ui/Badge'

function HabitTracker({ habits }) {
  return (
    <Card title="Habit Tracker">
      <div className="space-y-2">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-2">
            <div>
              <p className="text-sm font-medium text-slate-700">{habit.name}</p>
              <p className="text-xs text-slate-500">Streak: {habit.streak} days</p>
            </div>
            <Badge tone={habit.completed ? 'success' : 'warning'}>
              {habit.completed ? 'Done' : 'Pending'}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default HabitTracker
