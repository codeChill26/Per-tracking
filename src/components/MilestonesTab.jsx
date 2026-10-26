import React, { useEffect, useState } from 'react'
import { 
  Trophy, 
  Flame, 
  ShieldCheck, 
  Award, 
  Crown, 
  Camera, 
  Images, 
  Apple, 
  Dumbbell, 
  Flag,
  Sparkles,
  PartyPopper
} from 'lucide-react'
import { getMilestones } from '../services/db'
import { fireMilestoneConfetti } from '../services/streakEngine'

const ICON_MAP = {
  Flag: Flag,
  Flame: Flame,
  ShieldCheck: ShieldCheck,
  Award: Award,
  Crown: Crown,
  Camera: Camera,
  Images: Images,
  Apple: Apple,
  Dumbbell: Dumbbell
}

export default function MilestonesTab({ streakStats }) {
  const [milestones, setMilestones] = useState([])

  useEffect(() => {
    getMilestones().then(setMilestones)
  }, [])

  const unlockedCount = milestones.filter(m => m.unlocked).length

  return (
    <div>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #ea580c, #f97316)',
        color: '#ffffff',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trophy size={22} color="#fef08a" />
            <span style={{ fontSize: '1rem', fontWeight: 800 }}>KHO PHẦN THƯỞNG & HUY HIỆU</span>
          </div>
          <button
            onClick={fireMilestoneConfetti}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              color: '#ffffff',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <PartyPopper size={14} /> Ăn mừng
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {unlockedCount} / {milestones.length}
          </span>
          <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Huy hiệu đã chinh phục</span>
        </div>

        <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>
          Mỗi mốc hoàn thành đều chứng nhận tính kỷ luật cao độ của bạn.
        </p>
      </div>

      {/* Streak summary */}
      <div className="discipline-overview-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div className="kpi-label">Chuỗi hiện tại</div>
            <div className="kpi-value" style={{ color: 'var(--flame-primary)' }}>
              <Flame size={20} fill="currentColor" />
              {streakStats.currentStreak} <span className="kpi-sub">ngày</span>
            </div>
          </div>
          <div>
            <div className="kpi-label">Kỷ lục dài nhất</div>
            <div className="kpi-value" style={{ color: 'var(--text-primary)' }}>
              <Trophy size={20} color="#eab308" />
              {streakStats.longestStreak} <span className="kpi-sub">ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="section-header">
        <div className="section-title">
          <Sparkles size={18} color="var(--flame-primary)" />
          <span>Danh sách Cột mốc</span>
        </div>
      </div>

      {milestones.map(m => {
        const IconComponent = ICON_MAP[m.icon] || Trophy
        return (
          <div key={m.id} className={`milestone-card ${m.unlocked ? 'unlocked' : ''}`}>
            <div className="milestone-badge-icon">
              <IconComponent size={24} />
            </div>

            <div style={{ flex: 1 }}>
              <div className="milestone-title">{m.title}</div>
              <div className="milestone-desc">{m.description}</div>
              {m.unlocked ? (
                <span className="milestone-status done">
                  ✓ Đã mở khóa {m.unlockedAt ? `(${new Date(m.unlockedAt).toLocaleDateString('vi-VN')})` : ''}
                </span>
              ) : (
                <span className="milestone-status locked">
                  🔒 Cần đạt mốc {m.requirement}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
