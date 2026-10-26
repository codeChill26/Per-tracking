import React from 'react'
import { Trophy, Flame, ShieldCheck, Award, Crown, Camera, Images, Apple, Dumbbell, Sparkles } from 'lucide-react'

const ICON_MAP = {
  Flag: Sparkles,
  Flame: Flame,
  ShieldCheck: ShieldCheck,
  Award: Award,
  Crown: Crown,
  Camera: Camera,
  Images: Images,
  Apple: Apple,
  Dumbbell: Dumbbell
}

export default function CelebrationModal({ milestone, onClose }) {
  if (!milestone) return null

  const IconComp = ICON_MAP[milestone.icon] || Trophy

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100 }}>
      <div 
        className="modal-sheet celebration-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 400, textAlign: 'center' }}
      >
        <div className="celebration-icon-box">
          <IconComp size={42} />
        </div>

        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--flame-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          🎉 CHÚC MỪNG MỞ KHÓA THÀNH TÍCH MỚI!
        </div>

        <div className="celebration-title">{milestone.title}</div>
        <p className="celebration-desc">{milestone.description}</p>

        <button 
          onClick={onClose} 
          className="btn-primary" 
          style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)' }}
        >
          Tiếp Tục Kỷ Luật 🔥
        </button>
      </div>
    </div>
  )
}
