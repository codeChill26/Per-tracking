import React, { useState } from 'react'
import { 
  Check, 
  Utensils, 
  Dumbbell, 
  Droplet, 
  Scale, 
  Camera, 
  ChevronRight, 
  Plus, 
  HeartHandshake,
  Sparkles
} from 'lucide-react'
import { playChime, triggerHaptic } from '../services/notifications'
import { WeightModal, MealModal, WorkoutModal } from './Modals'

export default function TodayTab({
  dailyLog,
  settings,
  streakStats,
  onUpdateLog,
  onUpdateSettings
}) {
  const [activeModal, setActiveModal] = useState(null) // 'weight' | 'workout' | { mealIndex: number }

  // Calculate day completion
  const mealsDone = (dailyLog.meals || []).filter(m => m.completed).length
  const workoutDone = dailyLog.workout && (dailyLog.workout.completed || dailyLog.workout.isRestDay)
  const totalTasks = (dailyLog.meals?.length || 4) + 1 // meals + workout
  const completedTasks = mealsDone + (workoutDone ? 1 : 0)
  const completionPct = Math.round((completedTasks / totalTasks) * 100)

  // Toggle meal completion with audio and haptic
  const handleToggleMeal = (idx, e) => {
    e.stopPropagation()
    const newMeals = [...dailyLog.meals]
    const nextVal = !newMeals[idx].completed
    newMeals[idx] = { ...newMeals[idx], completed: nextVal }

    if (nextVal) {
      playChime('success')
      triggerHaptic([30])
    }

    onUpdateLog({ ...dailyLog, meals: newMeals })
  }

  // Quick Water +250ml
  const handleAddWater = (delta) => {
    const nextWater = Math.max(0, parseFloat(((dailyLog.waterLiters || 0) + delta).toFixed(2)))
    playChime('success')
    triggerHaptic([20])
    onUpdateLog({ ...dailyLog, waterLiters: nextWater })
  }

  // Save Weight
  const handleSaveWeight = (newWeight) => {
    onUpdateLog({ ...dailyLog, weight: newWeight })
    onUpdateSettings({ ...settings, currentWeight: newWeight })
    setActiveModal(null)
  }

  // Save Meal from modal
  const handleSaveMeal = (updatedMeal) => {
    const newMeals = [...dailyLog.meals]
    const idx = newMeals.findIndex(m => m.id === updatedMeal.id)
    if (idx !== -1) {
      newMeals[idx] = updatedMeal
      onUpdateLog({ ...dailyLog, meals: newMeals })
    }
    setActiveModal(null)
  }

  // Save Workout from modal
  const handleSaveWorkout = (updatedWorkout) => {
    onUpdateLog({ ...dailyLog, workout: updatedWorkout })
    setActiveModal(null)
  }

  // Total Calories today
  const totalCalories = (dailyLog.meals || []).reduce((sum, m) => sum + (m.calories || 0), 0)

  return (
    <div>
      {/* 1. Discipline KPI & Progress Card */}
      <div className="discipline-overview-card">
        <div className="overview-top-row">
          <div className="progress-headline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color="var(--success-primary)" />
            <span>Tiến độ kỷ luật hôm nay</span>
          </div>
          <div className="progress-pct-badge">{completionPct}%</div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${completionPct}%` }} />
        </div>

        <div className="kpi-grid">
          {/* Cân nặng */}
          <div className="kpi-item" onClick={() => setActiveModal('weight')} style={{ cursor: 'pointer' }}>
            <div className="kpi-label">Cân nặng</div>
            <div className="kpi-value">
              {dailyLog.weight ? dailyLog.weight : '--'}
              <span className="kpi-sub">kg</span>
            </div>
          </div>

          {/* Calorie nạp */}
          <div className="kpi-item">
            <div className="kpi-label">Calorie ăn</div>
            <div className="kpi-value">
              {totalCalories > 0 ? totalCalories : '--'}
              <span className="kpi-sub">kcal</span>
            </div>
          </div>

          {/* Nước uống */}
          <div className="kpi-item">
            <div className="kpi-label">Nước uống</div>
            <div className="kpi-value">
              {dailyLog.waterLiters || 0}
              <span className="kpi-sub">L</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Water Quick Tracker */}
      <div className="water-widget">
        <div className="water-left">
          <Droplet size={22} color="var(--water-primary)" fill="currentColor" />
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Nước uống (Mục tiêu 2.5L)</div>
            <div className="water-amount">{dailyLog.waterLiters || 0} Lít</div>
          </div>
        </div>
        <div className="water-btns">
          <button className="water-btn" onClick={() => handleAddWater(0.25)}>+250 ml</button>
          <button className="water-btn" onClick={() => handleAddWater(0.5)}>+500 ml</button>
        </div>
      </div>

      {/* 3. Daily Meals Section */}
      <div className="section-header">
        <div className="section-title">
          <Utensils size={18} color="var(--diet-primary)" />
          <span>Bữa ăn & Thực đơn ({mealsDone}/4)</span>
        </div>
      </div>

      {(dailyLog.meals || []).map((meal, idx) => (
        <div 
          key={meal.id} 
          className={`habit-card ${meal.completed ? 'completed' : ''}`}
          onClick={() => setActiveModal({ mealIndex: idx })}
          style={{ cursor: 'pointer' }}
        >
          <div className="habit-card-header">
            <div 
              className={`check-trigger ${meal.completed ? 'checked' : ''}`}
              onClick={(e) => handleToggleMeal(idx, e)}
              title="Đánh dấu hoàn thành"
            >
              {meal.completed && <Check size={16} strokeWidth={3} />}
            </div>

            <div className="habit-info">
              <div className="habit-title-row">
                <span className="habit-title">{meal.label}</span>
                {meal.calories > 0 && (
                  <span className="habit-time-badge">{meal.calories} kcal</span>
                )}
              </div>
              <div className="habit-description">
                {meal.title || 'Chưa ghi món — Nhấn để thêm thực đơn & ảnh'}
              </div>

              {meal.photoUrl && (
                <img 
                  src={meal.photoUrl} 
                  alt={meal.label} 
                  className="meal-photo-preview"
                />
              )}
            </div>

            <ChevronRight size={18} color="var(--text-muted)" style={{ marginTop: 4 }} />
          </div>
        </div>
      ))}

      {/* 4. Workout & Rest Section */}
      <div className="section-header">
        <div className="section-title">
          <Dumbbell size={18} color="var(--workout-primary)" />
          <span>Vận động & Phục hồi</span>
        </div>
      </div>

      <div 
        className={`habit-card ${workoutDone ? 'completed' : ''}`}
        onClick={() => setActiveModal('workout')}
        style={{ cursor: 'pointer' }}
      >
        <div className="habit-card-header">
          <div 
            className={`check-trigger ${workoutDone ? 'checked' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              const nextVal = !dailyLog.workout?.completed
              if (nextVal) { playChime('success'); triggerHaptic([35]); }
              onUpdateLog({
                ...dailyLog,
                workout: {
                  ...dailyLog.workout,
                  completed: nextVal,
                  isRestDay: false
                }
              })
            }}
          >
            {workoutDone && <Check size={16} strokeWidth={3} />}
          </div>

          <div className="habit-info">
            <div className="habit-title-row">
              <span className="habit-title">
                {dailyLog.workout?.isRestDay ? 'Nghỉ ngơi phục hồi cơ' : 'Lịch tập luyện'}
              </span>
              <span className={`workout-badge-type ${dailyLog.workout?.isRestDay ? 'rest' : ''}`}>
                {dailyLog.workout?.isRestDay ? '🧘 Rest Day' : `🏋️ ${dailyLog.workout?.type?.toUpperCase() || 'GYM'}`}
              </span>
            </div>

            <div className="habit-description">
              {dailyLog.workout?.isRestDay
                ? 'Giãn cơ & phục hồi thể lực chủ động'
                : dailyLog.workout?.notes || 'Nhấn để ghi thời gian, bài tập và chụp ảnh check-in'}
            </div>

            {dailyLog.workout?.durationMinutes > 0 && !dailyLog.workout.isRestDay && (
              <div className="habit-meta-row">
                <span>⏱️ {dailyLog.workout.durationMinutes} phút</span>
                <span>🔥 Cường độ: {dailyLog.workout.intensity}</span>
              </div>
            )}

            {dailyLog.workout?.photoUrl && (
              <img 
                src={dailyLog.workout.photoUrl} 
                alt="Workout check-in" 
                className="meal-photo-preview"
              />
            )}
          </div>

          <ChevronRight size={18} color="var(--text-muted)" style={{ marginTop: 4 }} />
        </div>
      </div>

      {/* Modals mount */}
      {activeModal === 'weight' && (
        <WeightModal
          initialWeight={dailyLog.weight || settings.currentWeight}
          onSave={handleSaveWeight}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal?.mealIndex !== undefined && (
        <MealModal
          meal={dailyLog.meals[activeModal.mealIndex]}
          onSave={handleSaveMeal}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'workout' && (
        <WorkoutModal
          workout={dailyLog.workout || {}}
          onSave={handleSaveWorkout}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  )
}
