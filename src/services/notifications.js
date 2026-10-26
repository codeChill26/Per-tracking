// Web Audio chime generator (self-contained, no external mp3 files required)
export function playChime(type = 'success') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime
    if (type === 'milestone') {
      // Triumph chord (Arpeggio C - E - G - C5)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(523.25, now) // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1) // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2) // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3) // C6
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
      osc.start(now)
      osc.stop(now + 0.9)
    } else if (type === 'reminder') {
      // Gentle reminder ding-dong
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, now) // D5
      osc.frequency.setValueAtTime(880.00, now + 0.15) // A5
      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
      osc.start(now)
      osc.stop(now + 0.7)
    } else {
      // Soft checkmark tick
      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, now)
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
      osc.start(now)
      osc.stop(now + 0.2)
    }
  } catch {
    // Audio context may be restricted before first user interaction
  }
}

// Mobile haptic vibration helper
export function triggerHaptic(pattern = [25, 40, 25]) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch {
      // Ignored if not supported
    }
  }
}

// Web Notifications API helper
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return { supported: false, permission: 'denied' }
  }
  if (Notification.permission === 'granted') {
    return { supported: true, permission: 'granted' }
  }
  const result = await Notification.requestPermission()
  return { supported: true, permission: result }
}

export function showSystemNotification(title, options = {}) {
  playChime('reminder')
  triggerHaptic([40, 60, 40])

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/pwa-192x192.svg',
        badge: '/pwa-192x192.svg',
        vibrate: [200, 100, 200],
        ...options
      })
      return true
    } catch (e) {
      console.warn('System notification error:', e)
    }
  }
  return false
}
