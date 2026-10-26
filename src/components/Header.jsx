import React from 'react'
import { Flame, ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react'

export default function Header({ 
  currentDate, 
  onDateChange, 
  streakStats,
  activeTab,
  onInstall,
  isInstalled
}) {
  const isToday = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    return currentDate === todayStr
  }

  const handlePrevDay = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 1)
    onDateChange(d.toISOString().split('T')[0])
  }

  const handleNextDay = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 1)
    onDateChange(d.toISOString().split('T')[0])
  }

  const handleGoToday = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    onDateChange(todayStr)
  }

  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr)
    const options = { weekday: 'short', day: 'numeric', month: 'numeric' }
    return date.toLocaleDateString('vi-VN', options)
  }

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-badge">
          <img src="/pwa-192x192.svg" alt="Per-Track" className="brand-icon" />
          <div>
            <div className="brand-name">Per-Track</div>
            <div className="brand-sub">Daily Habit & Diet</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isInstalled && (
            <button
              onClick={onInstall}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #bfdbfe',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Cài đặt App Per-Track lên màn hình chính"
            >
              <Download size={13} /> Cài App
            </button>
          )}

          <div className={`streak-pill ${streakStats.currentStreak > 0 ? 'pulse' : ''}`}>
            <Flame size={15} fill="currentColor" />
            <span>{streakStats.currentStreak} NGÀY</span>
          </div>
        </div>
      </div>

      {activeTab === 'today' && (
        <div className="date-bar">
          <button className="date-arrow-btn" onClick={handlePrevDay} title="Ngày trước">
            <ChevronLeft size={18} />
          </button>

          <div className="date-current-title" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleGoToday}>
            <Calendar size={14} style={{ marginRight: 6, opacity: 0.7 }} />
            <span>{formatDisplayDate(currentDate)}</span>
            {isToday() ? (
              <span className="date-today-tag">Hôm nay</span>
            ) : (
              <button 
                onClick={(e) => { e.stopPropagation(); handleGoToday(); }} 
                style={{ marginLeft: 6, fontSize: '0.68rem', padding: '1px 6px', background: '#e2e8f0', border: 'none', borderRadius: 4, cursor: 'pointer' }}
              >
                Về hôm nay
              </button>
            )}
          </div>

          <button className="date-arrow-btn" onClick={handleNextDay} title="Ngày sau">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </header>
  )
}
