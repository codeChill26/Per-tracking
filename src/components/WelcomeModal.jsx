import React, { useState } from 'react'
import { Flame, Download, CheckCircle2, X, Sparkles, Smartphone, ShieldCheck, ChevronRight } from 'lucide-react'

export default function WelcomeModal({ isOpen, onClose, onInstall, isInstalled }) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('pertrack_welcome_seen', 'true')
    }
    onClose()
  }

  const handleInstallClick = () => {
    if (dontShowAgain) {
      localStorage.setItem('pertrack_welcome_seen', 'true')
    }
    onInstall()
  }

  return (
    <div className="modal-overlay" onClick={handleClose} style={{ zIndex: 120 }}>
      <div 
        className="modal-sheet" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 440, padding: '24px 22px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--flame-primary)',
              backgroundColor: 'var(--flame-bg)',
              border: '1px solid var(--flame-border)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)'
            }}>
              <Sparkles size={12} /> CHÀO MỪNG BẠN
            </span>
          </div>
          <button className="sheet-close-btn" onClick={handleClose}><X size={20} /></button>
        </div>

        {/* Brand visual header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 64,
            height: 64,
            margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.15)'
          }}>
            <Flame size={34} color="#f97316" fill="currentColor" />
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Chào mừng đến với Per-Track
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Không gian kỷ luật cá nhân theo dõi vận động, ăn uống, chuỗi ngày streak và cột mốc chuyển hóa cơ thể.
          </p>
        </div>

        {/* Key Features List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <Flame size={18} color="var(--flame-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
              <strong>Chuỗi ngày Streak 🔥:</strong> Duy trì đều đặn tập luyện & dinh dưỡng, hỗ trợ cả ngày Rest Day.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <Smartphone size={18} color="var(--workout-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
              <strong>Chụp ảnh & Milestone:</strong> Bằng chứng hình ảnh trực quan, so sánh Before & After rõ ràng.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <ShieldCheck size={18} color="var(--success-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
              <strong>100% Offline-First:</strong> Dữ liệu lưu an toàn trên máy bạn, hoạt động trơn tru không cần mạng.
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                padding: '13px',
                fontSize: '0.94rem'
              }}
            >
              <Download size={18} /> Cài Đặt App Về Điện Thoại (PWA)
            </button>
          )}

          <button
            onClick={handleClose}
            className={isInstalled ? "btn-primary" : "btn-secondary"}
            style={{ padding: '12px', fontSize: '0.9rem', fontWeight: 700 }}
          >
            Bắt Đầu Ngay Hôm Nay <ChevronRight size={16} style={{ display: 'inline', verticalAlign: '-3px' }} />
          </button>
        </div>

        {/* Don't show again toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
          <input
            type="checkbox"
            id="dont-show-welcome"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--text-primary)', cursor: 'pointer' }}
          />
          <label htmlFor="dont-show-welcome" style={{ fontSize: '0.76rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
            Không tự động bật popup này ở lần truy cập tới
          </label>
        </div>
      </div>
    </div>
  )
}
