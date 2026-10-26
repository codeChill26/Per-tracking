import { getAllLogs, getMilestones, updateMilestone, getPhotosVault } from './db'
import { playChime, triggerHaptic } from './notifications'
import confetti from 'canvas-confetti'

export function isDayActive(log) {
  if (!log) return false
  const workoutDone = log.workout && (log.workout.completed || log.workout.isRestDay)
  const mealsDoneCount = (log.meals || []).filter(m => m.completed).length
  // A disciplined day is either having workout/rest logged OR at least 2 meals tracked
  return workoutDone || mealsDoneCount >= 2
}

export function calculateStreakStats(logs) {
  if (!logs || logs.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDaysTotal: 0, completedToday: false }
  }

  // Sort logs ascending by date
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date))
  const logMap = new Map()
  sorted.forEach(l => {
    if (isDayActive(l)) {
      logMap.set(l.date, l)
    }
  })

  const todayStr = new Date().toISOString().split('T')[0]
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let currentStreak = 0
  let checkDate = new Date()
  const todayActive = logMap.has(todayStr)
  const yesterdayActive = logMap.has(yesterdayStr)

  // If today isn't done yet, streak can continue from yesterday
  if (!todayActive && !yesterdayActive) {
    currentStreak = 0
  } else {
    // Start counting back from today or yesterday
    let curr = todayActive ? new Date() : yesterday
    while (true) {
      const dStr = curr.toISOString().split('T')[0]
      if (logMap.has(dStr)) {
        currentStreak++
        curr.setDate(curr.getDate() - 1)
      } else {
        break
      }
    }
  }

  // Longest streak calculation
  let longest = 0
  let temp = 0
  const dates = Array.from(logMap.keys()).sort()
  for (let i = 0; i < dates.length; i++) {
    if (i === 0) {
      temp = 1
    } else {
      const prev = new Date(dates[i - 1])
      const curr = new Date(dates[i])
      const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        temp++
      } else {
        temp = 1
      }
    }
    if (temp > longest) longest = temp
  }

  return {
    currentStreak: Math.max(currentStreak, 0),
    longestStreak: Math.max(longest, currentStreak),
    activeDaysTotal: logMap.size,
    completedToday: todayActive
  }
}

// Trigger celebratory confetti effect
export function fireMilestoneConfetti() {
  playChime('milestone')
  triggerHaptic([50, 100, 50, 150])

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f97316', '#e11d48', '#10b981', '#3b82f6', '#facc15']
  })
}

// Check and trigger new milestones
export async function evaluateMilestones() {
  const [logs, milestones, photos] = await Promise.all([
    getAllLogs(),
    getMilestones(),
    getPhotosVault()
  ])

  const stats = calculateStreakStats(logs)
  const workoutCount = logs.filter(l => l.workout && l.workout.completed).length
  const photoCount = photos.length
  const cleanDietDays = logs.filter(l => (l.meals || []).filter(m => m.completed).length >= 3).length

  const newlyUnlocked = []

  for (const m of milestones) {
    if (m.unlocked) continue

    let shouldUnlock = false
    if (m.category === 'streak' && stats.currentStreak >= m.requirement) {
      shouldUnlock = true
    } else if (m.category === 'workout' && workoutCount >= m.requirement) {
      shouldUnlock = true
    } else if (m.category === 'photo' && photoCount >= m.requirement) {
      shouldUnlock = true
    } else if (m.category === 'diet' && cleanDietDays >= m.requirement) {
      shouldUnlock = true
    }

    if (shouldUnlock) {
      m.unlocked = true
      m.unlockedAt = new Date().toISOString()
      await updateMilestone(m)
      newlyUnlocked.push(m)
    }
  }

  if (newlyUnlocked.length > 0) {
    fireMilestoneConfetti()
  }

  return { newlyUnlocked, stats }
}
