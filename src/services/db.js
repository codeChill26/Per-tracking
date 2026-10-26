import { openDB } from 'idb'

const DB_NAME = 'pertrack_db'
const DB_VERSION = 1

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('daily_logs')) {
        db.createObjectStore('daily_logs', { keyPath: 'date' })
      }
      if (!db.objectStoreNames.contains('photos_vault')) {
        const photosStore = db.createObjectStore('photos_vault', { keyPath: 'id' })
        photosStore.createIndex('by_date', 'date')
        photosStore.createIndex('by_category', 'category')
      }
      if (!db.objectStoreNames.contains('milestones_rewards')) {
        db.createObjectStore('milestones_rewards', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('user_settings')) {
        db.createObjectStore('user_settings', { keyPath: 'id' })
      }
    }
  })
}

// Initial clean settings
export const DEFAULT_SETTINGS = {
  id: 'settings',
  userName: 'Chiến Binh Per-Track',
  startWeight: 70.0,
  targetWeight: 65.0,
  currentWeight: 70.0,
  calorieTarget: 2000,
  waterTargetLiters: 2.5,
  workoutDaysPerWeek: 5,
  reminders: [
    { id: 'rem-breakfast', type: 'breakfast', label: 'Bữa sáng lành mạnh', time: '07:30', enabled: true },
    { id: 'rem-lunch', type: 'lunch', label: 'Bữa trưa đầy đủ protein', time: '12:00', enabled: true },
    { id: 'rem-workout', type: 'workout', label: 'Đến giờ khởi động & đi tập rồi!', time: '17:30', enabled: true },
    { id: 'rem-dinner', type: 'dinner', label: 'Bữa tối nhẹ & phục hồi', time: '19:30', enabled: true },
    { id: 'rem-checkin', type: 'checkin', label: 'Tổng kết ngày & chụp ảnh kỷ luật', time: '21:30', enabled: true }
  ]
}

// Progressive milestone rewards (Fresh start: all locked)
export const INITIAL_MILESTONES = [
  {
    id: 'streak_1',
    category: 'streak',
    requirement: 1,
    title: 'Bước Chân Đầu Tiên',
    description: 'Bắt đầu hành trình và hoàn thành check-in ngày đầu tiên.',
    icon: 'Flag',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'streak_3',
    category: 'streak',
    requirement: 3,
    title: 'Tia Lửa Kỷ Luật',
    description: 'Duy trì chuỗi 3 ngày liên tục không ngắt quãng.',
    icon: 'Flame',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'streak_7',
    category: 'streak',
    requirement: 7,
    title: 'Ý Chí Thép (1 Tuần)',
    description: 'Vượt qua tuần lễ đầu tiên đầy thử thách.',
    icon: 'ShieldCheck',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'streak_14',
    category: 'streak',
    requirement: 14,
    title: 'Thói Quen Hình Thành (2 Tuần)',
    description: 'Cơ thể bắt đầu thích nghi và biến vận động thành bản năng.',
    icon: 'Award',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'streak_30',
    category: 'streak',
    requirement: 30,
    title: 'Chiến Binh Kỷ Luật (30 Ngày)',
    description: '1 tháng chuyển biến rõ rệt về vóc dáng và tâm thế!',
    icon: 'Crown',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'photo_first',
    category: 'photo',
    requirement: 1,
    title: 'Bằng Chứng Hành Trình',
    description: 'Chụp bức ảnh check-in đầu tiên để làm mốc so sánh.',
    icon: 'Camera',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'photo_5',
    category: 'photo',
    requirement: 5,
    title: 'Album Lột Xác',
    description: 'Lưu trữ 5 khoảnh khắc chứng minh nỗ lực không ngừng nghỉ.',
    icon: 'Images',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'diet_clean_5',
    category: 'diet',
    requirement: 5,
    title: 'Dinh Dưỡng Chuẩn',
    description: 'Hoàn thành đủ 3 bữa chính lành mạnh trong 5 ngày.',
    icon: 'Apple',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'workout_10',
    category: 'workout',
    requirement: 10,
    title: 'Cỗ Máy Vận Động',
    description: 'Tích lũy 10 buổi tập luyện hoặc buổi phục hồi chất lượng.',
    icon: 'Dumbbell',
    unlocked: false,
    unlockedAt: null
  }
]

export function createDefaultDayLog(dateStr) {
  return {
    date: dateStr,
    weight: null,
    waterLiters: 0,
    meals: [
      { id: `${dateStr}-breakfast`, type: 'breakfast', label: 'Bữa Sáng', title: '', calories: 0, completed: false, photoUrl: null },
      { id: `${dateStr}-lunch`, type: 'lunch', label: 'Bữa Trưa', title: '', calories: 0, completed: false, photoUrl: null },
      { id: `${dateStr}-dinner`, type: 'dinner', label: 'Bữa Tối', title: '', calories: 0, completed: false, photoUrl: null },
      { id: `${dateStr}-snack`, type: 'snack', label: 'Bữa Phụ / Pre-workout', title: '', calories: 0, completed: false, photoUrl: null }
    ],
    workout: {
      completed: false,
      isRestDay: false,
      type: 'gym',
      durationMinutes: 45,
      intensity: 'moderate',
      notes: '',
      photoUrl: null
    },
    notes: '',
    updatedAt: new Date().toISOString()
  }
}

export async function getSettings() {
  const db = await getDB()
  const settings = await db.get('user_settings', 'settings')
  if (!settings) {
    await db.put('user_settings', DEFAULT_SETTINGS)
    return DEFAULT_SETTINGS
  }
  return settings
}

export async function saveSettings(settings) {
  const db = await getDB()
  await db.put('user_settings', { ...settings, id: 'settings' })
  return settings
}

export async function getDailyLog(dateStr) {
  const db = await getDB()
  const log = await db.get('daily_logs', dateStr)
  if (!log) {
    return createDefaultDayLog(dateStr)
  }
  return log
}

export async function saveDailyLog(log) {
  const db = await getDB()
  log.updatedAt = new Date().toISOString()
  await db.put('daily_logs', log)
  return log
}

export async function getAllLogs() {
  const db = await getDB()
  return await db.getAll('daily_logs')
}

export async function getMilestones() {
  const db = await getDB()
  const list = await db.getAll('milestones_rewards')
  if (!list || list.length === 0) {
    const tx = db.transaction('milestones_rewards', 'readwrite')
    for (const m of INITIAL_MILESTONES) {
      await tx.store.put(m)
    }
    await tx.done
    return INITIAL_MILESTONES
  }
  return list
}

export async function updateMilestone(milestone) {
  const db = await getDB()
  await db.put('milestones_rewards', milestone)
}

export async function getPhotosVault() {
  const db = await getDB()
  const photos = await db.getAll('photos_vault')
  return photos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function addPhotoToVault(photo) {
  const db = await getDB()
  const item = {
    id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    ...photo
  }
  await db.put('photos_vault', item)
  return item
}

export async function deletePhotoFromVault(photoId) {
  const db = await getDB()
  await db.delete('photos_vault', photoId)
}

// Reset all user data completely to fresh start (Clean zero state)
export async function resetAllData() {
  const db = await getDB()
  await db.clear('daily_logs')
  await db.clear('photos_vault')
  await db.clear('milestones_rewards')
  
  // Re-seed empty initial milestones
  const tx = db.transaction('milestones_rewards', 'readwrite')
  for (const m of INITIAL_MILESTONES) {
    await tx.store.put({ ...m, unlocked: false, unlockedAt: null })
  }
  await tx.done

  await db.put('user_settings', DEFAULT_SETTINGS)
  return true
}
