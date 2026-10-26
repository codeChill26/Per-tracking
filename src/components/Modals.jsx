import React, { useState } from 'react'
import { X, Camera, Upload, Scale, Dumbbell, Utensils, Check } from 'lucide-react'

// Helper to convert file to compressed base64
function fileToBase64(file, maxWidth = 1000) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
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
        // Compress as JPEG 0.78
        resolve(canvas.toDataURL('image/jpeg', 0.78))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 1. Weight Modal
export function WeightModal({ initialWeight, onSave, onClose }) {
  const [weight, setWeight] = useState(initialWeight || 70)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(parseFloat(weight))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div className="sheet-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Scale size={20} color="#0f172a" />
            <span>Ghi Nhận Cân Nặng</span>
          </div>
          <button className="sheet-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Cân nặng hôm nay (kg)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="number"
                step="0.1"
                min="30"
                max="250"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="form-input"
                style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
                autoFocus
                required
              />
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>kg</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[-0.5, -0.2, 0, +0.2, +0.5].map(delta => (
              <button
                type="button"
                key={delta}
                className="btn-secondary"
                style={{ padding: '6px 4px', fontSize: '0.78rem' }}
                onClick={() => setWeight((prev) => (parseFloat(prev || 70) + delta).toFixed(1))}
              >
                {delta > 0 ? `+${delta}` : delta === 0 ? 'Giữ' : delta}
              </button>
            ))}
          </div>

          <button type="submit" className="btn-primary">
            <Check size={18} /> Lưu Cân Nặng
          </button>
        </form>
      </div>
    </div>
  )
}

// 2. Meal Detail & Photo Modal
export function MealModal({ meal, onSave, onClose }) {
  const [title, setTitle] = useState(meal.title || '')
  const [calories, setCalories] = useState(meal.calories || '')
  const [completed, setCompleted] = useState(meal.completed)
  const [photoUrl, setPhotoUrl] = useState(meal.photoUrl || null)
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false)

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsProcessingPhoto(true)
    try {
      const base64 = await fileToBase64(file)
      setPhotoUrl(base64)
      setCompleted(true) // Auto-mark as completed if photo taken
    } catch (err) {
      console.error('Error processing photo:', err)
    } finally {
      setIsProcessingPhoto(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...meal,
      title: title.trim(),
      calories: calories ? parseInt(calories, 10) : 0,
      completed,
      photoUrl
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div className="sheet-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Utensils size={20} color="#d97706" />
            <span>{meal.label}</span>
          </div>
          <button className="sheet-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên món ăn / Khẩu phần</label>
            <input
              type="text"
              placeholder="VD: Ức gà nướng + salad quinoa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ước tính Calorie (kcal)</label>
            <input
              type="number"
              placeholder="VD: 550"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Photo capture input */}
          <div className="form-group">
            <label className="form-label">Chụp ảnh bữa ăn (Chứng minh kỷ luật)</label>
            {photoUrl ? (
              <div style={{ position: 'relative', marginTop: 6 }}>
                <img
                  src={photoUrl}
                  alt="Meal preview"
                  style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-main)' }}
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(null)}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.65)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    padding: 6,
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '14px',
                  border: '1px dashed var(--border-main)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-subtle)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}>
                  <Camera size={18} color="#0f172a" />
                  <span>{isProcessingPhoto ? 'Đang xử lý...' : 'Chụp từ Camera'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '14px',
                  border: '1px dashed var(--border-main)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-subtle)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}>
                  <Upload size={18} color="#0f172a" />
                  <span>Tải ảnh lên</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="meal-completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--success-primary)' }}
            />
            <label htmlFor="meal-completed" style={{ fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
              Đã hoàn thành bữa ăn này đúng giờ
            </label>
          </div>

          <button type="submit" className="btn-primary">
            <Check size={18} /> Lưu Bữa Ăn
          </button>
        </form>
      </div>
    </div>
  )
}

// 3. Workout & Rest Day Modal
export function WorkoutModal({ workout, onSave, onClose }) {
  const [completed, setCompleted] = useState(workout.completed)
  const [isRestDay, setIsRestDay] = useState(workout.isRestDay || false)
  const [type, setType] = useState(workout.type || 'gym')
  const [durationMinutes, setDurationMinutes] = useState(workout.durationMinutes || 45)
  const [intensity, setIntensity] = useState(workout.intensity || 'moderate')
  const [notes, setNotes] = useState(workout.notes || '')
  const [photoUrl, setPhotoUrl] = useState(workout.photoUrl || null)

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const base64 = await fileToBase64(file)
      setPhotoUrl(base64)
      setCompleted(true)
    } catch (err) {
      console.error('Error processing photo:', err)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...workout,
      completed,
      isRestDay,
      type,
      durationMinutes: isRestDay ? 0 : parseInt(durationMinutes, 10),
      intensity,
      notes: notes.trim(),
      photoUrl
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div className="sheet-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Dumbbell size={20} color="#7c3aed" />
            <span>Tập Luyện & Nghỉ Ngơi</span>
          </div>
          <button className="sheet-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Mode switch: Workout vs Rest Day */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            <button
              type="button"
              className={`btn-secondary ${!isRestDay ? 'active' : ''}`}
              style={{
                backgroundColor: !isRestDay ? 'var(--workout-primary)' : 'var(--bg-subtle)',
                color: !isRestDay ? '#ffffff' : 'var(--text-primary)',
                fontWeight: 700
              }}
              onClick={() => { setIsRestDay(false); setCompleted(true); }}
            >
              🏋️‍♂️ Có Tập Luyện
            </button>
            <button
              type="button"
              className={`btn-secondary ${isRestDay ? 'active' : ''}`}
              style={{
                backgroundColor: isRestDay ? '#0891b2' : 'var(--bg-subtle)',
                color: isRestDay ? '#ffffff' : 'var(--text-primary)',
                fontWeight: 700
              }}
              onClick={() => { setIsRestDay(true); setCompleted(true); }}
            >
              🧘 Phục Hồi (Rest Day)
            </button>
          </div>

          {!isRestDay ? (
            <>
              <div className="form-group">
                <label className="form-label">Loại hình vận động</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="form-select">
                  <option value="gym">Gym / Nâng Tạ (Weight Training)</option>
                  <option value="cardio">Cardio / Chạy bộ ngoài trời</option>
                  <option value="hiit">HIIT / Calisthenics</option>
                  <option value="yoga">Yoga / Giãn cơ Pilates</option>
                  <option value="cycling">Đạp xe (Cycling)</option>
                  <option value="swimming">Bơi lội (Swimming)</option>
                  <option value="sports">Bóng đá / Cầu lông / Thể thao</option>
                  <option value="other">Vận động khác</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Thời lượng (phút)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cường độ</label>
                  <select value={intensity} onChange={(e) => setIntensity(e.target.value)} className="form-select">
                    <option value="light">Nhẹ nhàng</option>
                    <option value="moderate">Vừa phải</option>
                    <option value="intense">Cường độ cao 🔥</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              padding: '12px 14px',
              backgroundColor: '#ecfeff',
              border: '1px solid #a5f3fc',
              borderRadius: 'var(--radius-sm)',
              color: '#0e7490',
              fontSize: '0.84rem',
              marginBottom: 16
            }}>
              💡 <strong>Lưu ý:</strong> Nghỉ ngơi hợp lý là một phần bắt buộc của kỷ luật. Rest day giúp sợi cơ tái tạo, chống quá tải và duy trì chuỗi streak của bạn bình thường!
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nhật ký tập / Cảm nhận cơ thể</label>
            <input
              type="text"
              placeholder="VD: Bench press lên tạ mới, cơ thể sung sức"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ảnh check-in phòng tập / mồ hôi</label>
            {photoUrl ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={photoUrl}
                  alt="Workout checkin"
                  style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(null)}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.65)', color: '#fff', border: 'none', borderRadius: '50%', padding: 6 }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px',
                border: '1px dashed var(--border-main)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}>
                <Camera size={18} color="#7c3aed" />
                <span>Chụp ảnh check-in buổi tập</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ backgroundColor: 'var(--workout-primary)' }}>
            <Check size={18} /> Lưu Trạng Thái Vận Động
          </button>
        </form>
      </div>
    </div>
  )
}
