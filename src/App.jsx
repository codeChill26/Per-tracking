import React, { useState, useEffect, useRef } from 'react'
import { 
  Home,
  CheckSquare, 
  Camera, 
  Trophy, 
  Bell, 
  Flame,
  Smartphone
} from 'lucide-react'
import { 
  getDailyLog, 
  saveDailyLog, 
  getSettings, 
  saveSettings, 
  getAllLogs, 
  resetAllData
} from './services/db'
import { 
  calculateStreakStats, 
  evaluateMilestones 
} from './services/streakEngine'
import { showSystemNotification } from './services/notifications'
import { usePWAInstall } from './services/usePWAInstall'

import Header from './components/Header'
import HomeTab from './components/HomeTab'
import TodayTab from './components/TodayTab'
import JourneyTab from './components/JourneyTab'
import MilestonesTab from './components/MilestonesTab'
import RemindersTab from './components/RemindersTab'
import CelebrationModal from './components/CelebrationModal'
import WelcomeModal from './components/WelcomeModal'

export default function App() {
  const [activeTab, setActiveTab] = useState('home') // 5 tabs: 'home' | 'today' | 'journey' | 'milestones' | 'reminders'
  const [currentDate, setCurrentDate] = useState(() => new Date().toISOString().split('T')[0])
  const [dailyLog, setDailyLog] = useState(null)
  const [settings, setSettings] = useState(null)
  const [streakStats, setStreakStats] = useState({ currentStreak: 0, longestStreak: 0, activeDaysTotal: 0 })
  const [unlockedMilestone, setUnlockedMilestone] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)

  const { isInstallable, isInstalled, triggerInstall, showIOSModal, setShowIOSModal } = usePWAInstall()
  const lastNotifiedMinuteRef = useRef('')

  // 1. Initial Load
  const reloadData = async () => {
    const [loadedSettings, initialLog, allLogs] = await Promise.all([
      getSettings(),
      getDailyLog(currentDate),
      getAllLogs()
    ])

    setSettings(loadedSettings)
    setDailyLog(initialLog)
    const stats = calculateStreakStats(allLogs)
    setStreakStats(stats)
    setLoading(false)

    // Check if welcome popup should be shown
    const welcomed = localStorage.getItem('pertrack_welcome_seen')
    if (!welcomed) {
      setShowWelcome(true)
    }
  }

  useEffect(() => {
    reloadData()
  }, [])

  // 2. Date changed -> load log for that date
  useEffect(() => {
    if (!loading) {
      getDailyLog(currentDate).then(setDailyLog)
    }
  }, [currentDate])

  // 3. Automated Reminder Engine (Checks every 30s)
  useEffect(() => {
    if (!settings?.reminders) return

    const interval = setInterval(() => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const timeStr = `${hours}:${minutes}`

      if (lastNotifiedMinuteRef.current === timeStr) return

      const matched = settings.reminders.find(r => r.enabled && r.time === timeStr)
      if (matched) {
        lastNotifiedMinuteRef.current = timeStr
        let reminderBody = 'Đã đến giờ theo kế hoạch kỷ luật của bạn!'
        if (matched.type === 'workout') {
          reminderBody = 'Chuẩn bị quần áo & bình nước để đi tập nào! Kỷ luật làm nên vóc dáng!'
        } else if (matched.type === 'breakfast' || matched.type === 'lunch' || matched.type === 'dinner') {
          reminderBody = `Đến giờ nạp năng lượng sạch (${matched.label}) rồi nhé!`
        } else if (matched.type === 'checkin') {
          reminderBody = 'Hãy mở Per-Track chụp ảnh vóc dáng và tổng kết ngày hôm nay!'
        }

        showSystemNotification(`Per-Track: ${matched.label}`, {
          body: reminderBody
        })
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [settings])

  // Update Daily Log handler
  const handleUpdateLog = async (updated) => {
    setDailyLog(updated)
    await saveDailyLog(updated)

    // Recalculate streak & evaluate milestones
    const allLogs = await getAllLogs()
    const stats = calculateStreakStats(allLogs)
    setStreakStats(stats)

    const evalRes = await evaluateMilestones()
    if (evalRes.newlyUnlocked?.length > 0) {
      setUnlockedMilestone(evalRes.newlyUnlocked[0])
    }
  }

  // Update Settings handler
  const handleUpdateSettings = async (updatedSettings) => {
    setSettings(updatedSettings)
    await saveSettings(updatedSettings)
  }

  // Full reset handler
  const handleResetAllData = async () => {
    await resetAllData()
    await reloadData()
  }

  if (loading || !dailyLog || !settings) {
    return (
      <div className="mobile-app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <Flame size={32} color="#ea580c" className="pulse" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Đang mở Per-Track...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-app-shell">
      {/* Header */}
      <Header
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        streakStats={streakStats}
        activeTab={activeTab}
        onInstall={triggerInstall}
        isInstalled={isInstalled}
      />

      {/* Main Content Body */}
      <main className="main-scroll-content">
        {activeTab === 'home' && (
          <HomeTab
            streakStats={streakStats}
            onGoToToday={() => setActiveTab('today')}
            onInstallPWA={triggerInstall}
            isInstalled={isInstalled}
          />
        )}

        {activeTab === 'today' && (
          <TodayTab
            dailyLog={dailyLog}
            settings={settings}
            streakStats={streakStats}
            onUpdateLog={handleUpdateLog}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {activeTab === 'journey' && (
          <JourneyTab
            settings={settings}
            onNewMilestoneUnlocked={setUnlockedMilestone}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestonesTab
            streakStats={streakStats}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersTab
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onInstallPWA={triggerInstall}
            isInstalled={isInstalled}
            onResetAllData={handleResetAllData}
          />
        )}
      </main>

      {/* Bottom Mobile Navigation (5 Items) */}
      <nav className="bottom-nav">
        <button
          className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={19} />
          <span className="nav-label">Trang chủ</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          <CheckSquare size={19} />
          <span className="nav-label">Hôm nay</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'journey' ? 'active' : ''}`}
          onClick={() => setActiveTab('journey')}
        >
          <Camera size={19} />
          <span className="nav-label">Hành trình</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'milestones' ? 'active' : ''}`}
          onClick={() => setActiveTab('milestones')}
        >
          <Trophy size={19} />
          <span className="nav-label">Thưởng</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'reminders' ? 'active' : ''}`}
          onClick={() => setActiveTab('reminders')}
        >
          <Bell size={19} />
          <span className="nav-label">Nhắc nhở</span>
        </button>
      </nav>

      {/* Welcome Popup upon opening */}
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        onInstall={triggerInstall}
        isInstalled={isInstalled}
      />

      {/* iOS Safari Install Guide Modal */}
      {showIOSModal && (
        <div className="modal-overlay" onClick={() => setShowIOSModal(false)} style={{ zIndex: 130 }}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="sheet-handle" />
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Smartphone size={32} color="var(--workout-primary)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Cài Đặt Lên Màn Hình Chính</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                Trình duyệt của bạn có thể thêm Per-Track thành ứng dụng độc lập chỉ với 2 bước:
              </p>
            </div>

            <ol style={{ paddingLeft: 20, fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: 20 }}>
              <li>Bấm biểu tượng <strong>Chia sẻ (Share / ⎋)</strong> ở thanh công cụ trình duyệt (hoặc menu 3 chấm).</li>
              <li>Cuộn xuống và chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.</li>
            </ol>

            <button onClick={() => setShowIOSModal(false)} className="btn-primary">
              Tôi Đã Hiểu
            </button>
          </div>
        </div>
      )}

      {/* Celebration Modal when milestone unlocked */}
      {unlockedMilestone && (
        <CelebrationModal
          milestone={unlockedMilestone}
          onClose={() => setUnlockedMilestone(null)}
        />
      )}
    </div>
  )
}
