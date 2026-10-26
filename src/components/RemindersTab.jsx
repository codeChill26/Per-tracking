import React, { useState } from 'react'
import { 
  Bell, 
  Clock, 
  Volume2, 
  Smartphone, 
  Check, 
  AlertCircle, 
  Send, 
  Target, 
  Shield,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { 
  requestNotificationPermission, 
  showSystemNotification, 
  playChime, 
  triggerHaptic 
} from '../services/notifications'

export default function RemindersTab({ 
  settings, 
  onUpdateSettings,
  onInstallPWA,
  isInstalled,
  onResetAllData
}) {
  const [notificationState, setNotificationState] = useState(
    typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'unsupported'
  )
  const [testSent, setTestSent] = useState(false)
  const [startWeight, setStartWeight] = useState(settings.startWeight || 70.0)
  const [targetWeight, setTargetWeight] = useState(settings.targetWeight || 65.0)
  const [savedGoals, setSavedGoals] = useState(false)
  const [resetting, setResetting] = useState(false)

  // Request notification permission
  const handleEnableNotifications = async () => {
    const res = await requestNotificationPermission()
    setNotificationState(res.permission)
    if (res.permission === 'granted') {
      showSystemNotification('Per-Track Đã Bật Thông Báo!', {
        body: 'Bạn sẽ nhận được lời nhắc đúng giờ ăn và giờ đi tập mỗi ngày.'
      })
    }
  }

  // Trigger test notification
  const handleTestNotification = () => {
    showSystemNotification('Đến giờ đi tập rồi! 🏋️‍♂️', {
      body: 'Chuẩn bị quần áo, bình nước và khởi động ngay nhé. Kỷ luật tạo nên sự khác biệt!'
    })
    setTestSent(true)
    setTimeout(() => setTestSent(false), 3000)
  }

  // Toggle specific reminder item
  const handleToggleReminder = (id) => {
    const updated = settings.reminders.map(r => {
      if (r.id === id) {
        return { ...r, enabled: !r.enabled }
      }
      return r
    })
    playChime('success')
    onUpdateSettings({ ...settings, reminders: updated })
  }

  // Change reminder time
  const handleChangeTime = (id, newTime) => {
    const updated = settings.reminders.map(r => {
      if (r.id === id) {
        return { ...r, time: newTime }
      }
      return r
    })
    onUpdateSettings({ ...settings, reminders: updated })
  }

  // Save weight goals
  const handleSaveGoals = (e) => {
    e.preventDefault()
    onUpdateSettings({
      ...settings,
      startWeight: parseFloat(startWeight),
      targetWeight: parseFloat(targetWeight)
    })
    playChime('success')
    triggerHaptic([30])
    setSavedGoals(true)
    setTimeout(() => setSavedGoals(false), 2500)
  }

  const handleResetClick = async () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu mẫu và lịch sử cũ để bắt đầu từ con số 0 từ hôm nay không?')) {
      setResetting(true)
      await onResetAllData()
      setResetting(false)
      alert('Đã xóa sạch dữ liệu! Chúc bạn có một khởi đầu kỷ luật mới đầy năng lượng cùng Per-Track!')
    }
  }

  return (
    <div>
      {/* 1. Notification Permission Box */}
      <div className="discipline-overview-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Bell size={18} color="var(--flame-primary)" />
              <span style={{ fontWeight: 800, fontSize: '0.96rem' }}>Thông Báo Đẩy Điện Thoại</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {notificationState === 'granted'
                ? 'Đã bật! Ứng dụng sẽ gửi thông báo nhắc bạn đúng giờ ăn và giờ vận động.'
                : 'Cấp quyền để nhận thông báo thúc đẩy giờ ăn, giờ tập và chúc mừng cột mốc.'}
            </p>
          </div>

          {notificationState !== 'granted' ? (
            <button
              onClick={handleEnableNotifications}
              className="btn-primary"
              style={{ width: 'auto', padding: '8px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              Bật ngay
            </button>
          ) : (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--success-primary)',
              backgroundColor: '#ecfdf5',
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)'
            }}>
              <Check size={14} /> Hoạt động
            </span>
          )}
        </div>

        {/* Test Button */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kiểm tra âm thanh & thông báo:</span>
          <button
            onClick={handleTestNotification}
            className="section-action-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Send size={14} />
            <span>{testSent ? 'Đã phát tín hiệu!' : 'Gửi thử thông báo'}</span>
          </button>
        </div>
      </div>

      {/* 2. Reminders Schedule Manager */}
      <div className="section-header">
        <div className="section-title">
          <Clock size={18} color="var(--text-primary)" />
          <span>Lịch Nhắc Giờ Ăn & Giờ Tập</span>
        </div>
      </div>

      {(settings.reminders || []).map(r => (
        <div key={r.id} className="habit-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px' }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{r.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {r.enabled ? 'Đang kích hoạt nhắc nhở hàng ngày' : 'Đã tạm tắt'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="time"
              value={r.time}
              onChange={(e) => handleChangeTime(r.id, e.target.value)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: '1px solid var(--border-main)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 8px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)'
              }}
            />
            <input
              type="checkbox"
              checked={r.enabled}
              onChange={() => handleToggleReminder(r.id)}
              style={{ width: 20, height: 20, accentColor: 'var(--success-primary)', cursor: 'pointer' }}
            />
          </div>
        </div>
      ))}

      {/* 3. PWA Installation Box */}
      <div className="section-header" style={{ marginTop: 22 }}>
        <div className="section-title">
          <Smartphone size={18} color="var(--workout-primary)" />
          <span>Cài Đặt Ứng Dụng (PWA)</span>
        </div>
      </div>

      <div className="discipline-overview-card" style={{ backgroundColor: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {isInstalled ? '✓ Đã cài đặt làm App trên điện thoại' : 'Cài đặt Per-Track như App Mobile'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Chạy toàn màn hình (Standalone), nhanh hơn và hỗ trợ offline
            </div>
          </div>

          {!isInstalled && (
            <button
              onClick={onInstallPWA}
              className="btn-primary"
              style={{ width: 'auto', padding: '8px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              <Download size={14} /> Cài Đặt
            </button>
          )}
        </div>

        <ul style={{ paddingLeft: 18, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <li><strong>Trên iPhone (Safari):</strong> Bấm nút <em>Chia sẻ</em> ➔ chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.</li>
          <li><strong>Trên Android (Chrome):</strong> Bấm menu <em>3 chấm</em> ➔ chọn <strong>"Cài đặt ứng dụng"</strong>.</li>
        </ul>
      </div>

      {/* 4. Weight Goal Settings */}
      <div className="section-header" style={{ marginTop: 22 }}>
        <div className="section-title">
          <Target size={18} color="var(--workout-primary)" />
          <span>Mục Tiêu Thể Trọng</span>
        </div>
      </div>

      <div className="discipline-overview-card">
        <form onSubmit={handleSaveGoals}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Cân nặng bắt đầu (kg)</label>
              <input
                type="number"
                step="0.1"
                value={startWeight}
                onChange={(e) => setStartWeight(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mục tiêu (kg)</label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="btn-secondary" style={{ width: '100%', fontWeight: 700 }}>
            {savedGoals ? '✓ Đã cập nhật mục tiêu!' : 'Lưu Thay Đổi'}
          </button>
        </form>
      </div>

      {/* 5. Clean Fresh Start Data Reset */}
      <div className="section-header" style={{ marginTop: 22 }}>
        <div className="section-title" style={{ color: '#dc2626' }}>
          <Trash2 size={18} />
          <span>Dữ Liệu & Khởi Đầu Mới</span>
        </div>
      </div>

      <div className="discipline-overview-card" style={{ borderColor: '#fecaca', backgroundColor: '#fff5f5' }}>
        <div style={{ fontSize: '0.82rem', color: '#991b1b', lineHeight: 1.5, marginBottom: 12 }}>
          <strong>Khởi đầu sạch từ hôm nay:</strong> Xóa sạch toàn bộ dữ liệu mẫu ban đầu, đưa chuỗi ngày về 0 và bắt đầu hành trình của riêng bạn.
        </div>

        <button
          type="button"
          onClick={handleResetClick}
          disabled={resetting}
          style={{
            width: '100%',
            padding: '10px 14px',
            backgroundColor: '#ffffff',
            border: '1px solid #f87171',
            borderRadius: 'var(--radius-sm)',
            color: '#dc2626',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          <RefreshCw size={16} className={resetting ? 'pulse' : ''} />
          <span>{resetting ? 'Đang làm sạch...' : 'Xóa Dữ Liệu Mẫu & Bắt Đầu Lại Từ Đầu'}</span>
        </button>
      </div>
    </div>
  )
}
