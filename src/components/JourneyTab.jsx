import React, { useState, useEffect } from 'react'
import { Camera, Upload, Trash2, Calendar, Scale, Sparkles, SlidersHorizontal, Image as ImageIcon } from 'lucide-react'
import { getPhotosVault, addPhotoToVault, deletePhotoFromVault } from '../services/db'
import { playChime, triggerHaptic } from '../services/notifications'
import { evaluateMilestones } from '../services/streakEngine'

export default function JourneyTab({ settings, onNewMilestoneUnlocked }) {
  const [photos, setPhotos] = useState([])
  const [filter, setFilter] = useState('all') // 'all' | 'milestone' | 'meal' | 'workout'
  const [isCapturing, setIsCapturing] = useState(false)
  const [showCompare, setShowCompare] = useState(false)

  const loadPhotos = async () => {
    const list = await getPhotosVault()
    setPhotos(list)
  }

  useEffect(() => {
    loadPhotos()
  }, [])

  const handleUploadPhoto = async (e, category = 'milestone') => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsCapturing(true)

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const img = new Image()
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          const maxWidth = 1200
          let width = img.width
          let height = img.height

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          const base64 = canvas.toDataURL('image/jpeg', 0.8)

          await addPhotoToVault({
            date: new Date().toISOString().split('T')[0],
            category,
            title: category === 'milestone' ? 'Cột mốc vóc dáng' : 'Ảnh check-in kỷ luật',
            weight: settings.currentWeight || 70,
            blob: base64
          })

          playChime('success')
          triggerHaptic([40, 50])
          await loadPhotos()

          // Check if photo milestone unlocked
          const res = await evaluateMilestones()
          if (res.newlyUnlocked?.length > 0 && onNewMilestoneUnlocked) {
            onNewMilestoneUnlocked(res.newlyUnlocked[0])
          }
          setIsCapturing(false)
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Failed to capture milestone photo:', err)
      setIsCapturing(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bức ảnh này khỏi hành trình?')) {
      await deletePhotoFromVault(id)
      loadPhotos()
    }
  }

  const filteredPhotos = filter === 'all' 
    ? photos 
    : photos.filter(p => p.category === filter)

  // Compare earliest vs latest
  const sortedByDate = [...photos].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const earliestPhoto = sortedByDate[0]
  const latestPhoto = sortedByDate.length > 1 ? sortedByDate[sortedByDate.length - 1] : null

  return (
    <div>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff',
        borderRadius: 'var(--radius-md)',
        padding: '18px 20px',
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Sparkles size={18} color="#facc15" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Hành Trình Chuyển Hóa
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: 14 }}>
          Mắt thường không thấy được sự thay đổi mỗi ngày, nhưng ống kính camera thì có. Hãy chụp ảnh để chứng minh nỗ lực của bạn!
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <label style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: '#ffffff',
            color: '#0f172a',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}>
            <Camera size={16} />
            <span>{isCapturing ? 'Đang lưu...' : 'Chụp ảnh ngay'}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleUploadPhoto(e, 'milestone')}
              style={{ display: 'none' }}
            />
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#ffffff',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}>
            <Upload size={16} />
            <span>Tải lên</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUploadPhoto(e, 'milestone')}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Before / After Transformation Card */}
      {earliestPhoto && latestPhoto && (
        <div className="discipline-overview-card" style={{ marginBottom: 18 }}>
          <div className="overview-top-row">
            <div className="progress-headline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <SlidersHorizontal size={16} color="var(--workout-primary)" />
              <span>So Sánh Before & After</span>
            </div>
            <button 
              className="section-action-btn"
              onClick={() => setShowCompare(!showCompare)}
            >
              {showCompare ? 'Thu gọn' : 'Xem chi tiết'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                NGÀY ĐẦU ({earliestPhoto.date})
              </div>
              <img
                src={earliestPhoto.blob}
                alt="Before"
                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)' }}
              />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                {earliestPhoto.weight} kg
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--success-primary)', marginBottom: 4 }}>
                HIỆN TẠI ({latestPhoto.date})
              </div>
              <img
                src={latestPhoto.blob}
                alt="After"
                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '2px solid var(--success-primary)' }}
              />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                {latestPhoto.weight} kg
                <span style={{ fontSize: '0.72rem', color: 'var(--success-primary)', marginLeft: 6 }}>
                  ({(latestPhoto.weight - earliestPhoto.weight).toFixed(1)} kg)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'milestone', label: 'Vóc dáng' },
          { id: 'meal', label: 'Bữa ăn' },
          { id: 'workout', label: 'Tập luyện' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-main)',
              fontSize: '0.78rem',
              fontWeight: filter === t.id ? 700 : 500,
              backgroundColor: filter === t.id ? 'var(--text-primary)' : 'var(--bg-surface)',
              color: filter === t.id ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Photo Gallery Grid */}
      {filteredPhotos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          border: '1px dashed var(--border-main)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-muted)'
        }}>
          <ImageIcon size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
            Chưa có bức ảnh nào trong kho
          </div>
          <div style={{ fontSize: '0.8rem' }}>
            Bấm "Chụp ảnh ngay" phía trên để lưu dấu mốc đầu tiên nhé!
          </div>
        </div>
      ) : (
        <div className="photo-gallery-grid">
          {filteredPhotos.map(p => (
            <div key={p.id} className="photo-item-card">
              <img src={p.blob} alt={p.title} className="photo-item-img" />
              <button
                onClick={() => handleDelete(p.id)}
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: 4,
                  cursor: 'pointer'
                }}
                title="Xóa ảnh"
              >
                <Trash2 size={14} />
              </button>
              <div className="photo-item-body">
                <div className="photo-item-date">{p.date}</div>
                <div className="photo-item-weight">{p.weight} kg</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>{p.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
