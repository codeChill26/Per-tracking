import React, { useState } from 'react'
import { 
  Sparkles, 
  Flame, 
  Download, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  X, 
  Heart, 
  Activity, 
  Apple, 
  Moon, 
  Target,
  ArrowRight
} from 'lucide-react'

export const HEALTH_ARTICLES = [
  {
    id: 'protein-science',
    category: 'diet',
    categoryLabel: 'Dinh Dưỡng',
    tagColor: 'var(--diet-primary)',
    title: 'Khoa học nạp 1.6g - 2.2g Protein / kg: Giữ cơ & đốt mỡ chuẩn y khoa',
    readTime: '4 phút đọc',
    summary: 'Protein không chỉ dành cho dân thể hình chuyên nghiệp. Nạp đủ đạm là chìa khóa chống mất cơ khi thâm hụt calo và tạo cảm giác no lâu suốt cả ngày.',
    publishedDate: 'Hôm nay',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    content: `
### 1. Nhu cầu Protein thực tế của cơ thể là bao nhiêu?
Nhiều nghiên cứu từ Hiệp hội Dinh dưỡng Thể thao Quốc tế (ISSN) chỉ ra rằng:
- **Người ít vận động:** Cần khoảng 0.8g - 1.0g protein / kg trọng lượng cơ thể.
- **Người tập gym / vận động giảm cân:** Cần tối thiểu **1.6g đến 2.2g protein / kg**.
- Ví dụ: Nếu bạn nặng 70kg, mục tiêu lý tưởng mỗi ngày là khoảng **112g - 140g protein**.

### 2. Lợi ích vượt trội của chế độ ăn giàu đạm:
- **Hiệu ứng nhiệt của thức ăn (TEF):** Cơ thể tiêu tốn tới 20-30% calo từ protein chỉ để tiêu hóa nó, cao hơn nhiều so với Carb (5-10%) và Fat (0-3%).
- **Kiểm soát cơn thèm ăn:** Đạm kích thích tiết hormone no (PYY, GLP-1) và giảm hormone đói Ghrelin.
- **Bảo toàn khối cơ (Lean Mass):** Khi bạn giảm cân, nếu thiếu đạm cơ thể sẽ tự phân giải mô cơ để lấy năng lượng, khiến chuyển hóa chậm lại (Skinny Fat).

### 💡 Lời khuyên hành động hôm nay:
1. Chia đều lượng protein cho 3-4 bữa trong ngày (khoảng 25-35g mỗi bữa).
2. Ưu tiên nguồn đạm hoàn chỉnh: Trứng gà, ức gà, cá biển, thịt bò nạc, đậu hũ, sữa chua Hy Lạp.
    `
  },
  {
    id: 'rest-day-science',
    category: 'training',
    categoryLabel: 'Tập Luyện & Phục Hồi',
    tagColor: 'var(--workout-primary)',
    title: 'Tại sao Rest Day (Ngày nghỉ) quan trọng ngang ngửa buổi tập?',
    readTime: '3 phút đọc',
    summary: 'Cơ bắp không to lên hay săn chắc hơn trong lúc nâng tạ. Buổi tập chỉ tạo ra các vi tổn thương; cơ bắp thực sự phát triển trong lúc bạn nghỉ ngơi và ngủ sâu.',
    publishedDate: 'Hôm qua',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    content: `
### 1. Cơ chế tăng trưởng cơ bắp (Hypertrophy)
Khi bạn tập luyện với tạ hoặc cardio cường độ cao, các sợi cơ bị căng xé vi mô (micro-tears). Để phục hồi và trở nên mạnh hơn:
- Cơ thể cần từ **24 đến 48 giờ** để tổng hợp protein sửa chữa sợi cơ.
- Nếu bạn tập liên tục không nghỉ (Overreaching), lượng hormone dị hóa **Cortisol** sẽ tăng vọt, gây mệt mỏi mạn tính, ức chế miễn dịch và suy giảm hiệu suất.

### 2. Thế nào là một Rest Day hiệu quả?
- **Nghỉ ngơi chủ động (Active Recovery):** Đi bộ nhẹ 5.000 - 8.000 bước, giãn cơ yoga nhẹ nhàng, ngâm mình thư giãn.
- **Dinh dưỡng ngày nghỉ:** Vẫn giữ nguyên lượng protein và uống đủ nước để cơ bắp có nguyên liệu sửa chữa.
- **Tâm lý kỷ luật:** Hãy tự hào khi chọn ngày Rest Day trên Per-Track! Nghỉ ngơi thông minh là một phần của kỷ luật đỉnh cao.
    `
  },
  {
    id: 'habit-streak-mindset',
    category: 'mindset',
    categoryLabel: 'Kỷ Luật Thói Quen',
    tagColor: 'var(--flame-primary)',
    title: 'Hiệu ứng Chuỗi Kỷ Luật: Quy tắc "Never Miss Twice" của James Clear',
    readTime: '5 phút đọc',
    summary: 'Một ngày lỡ bữa ăn hay bận việc không thể tập luyện không làm bạn thụt lùi. Thứ phá hủy kết quả là việc bạn buông xuôi 2 ngày liên tiếp.',
    publishedDate: 'Mới cập nhật',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    content: `
### 1. Sức mạnh tâm lý của Chuỗi Ngày (Streak)
Bộ não con người rất ghét mất mát (Loss Aversion). Khi bạn nhìn thấy con số Streak 🔥 trên Per-Track đạt 7, 14 hay 30 ngày:
- Bạn sẽ có một lực cản tâm lý rất lớn ngăn mình bỏ cuộc vào những ngày lười biếng.
- Kỷ luật không phải là cảm xúc nhất thời, mà là hệ thống hành vi lặp đi lặp lại.

### 2. Quy tắc vàng: "Không bao giờ bỏ lỡ 2 lần liên tiếp"
- Có những ngày công việc quá tải, cơ thể kiệt sức hoặc thời tiết xấu khiến bạn không thể tập nặng đủ 60 phút.
- **Giải pháp tối ưu:** Hãy chuyển sang tập 10 phút hít đất tại nhà, hoặc chọn chế độ **Rest Day** và tập trung ăn uống đủ 3 bữa sạch trong ngày.
- Bằng cách này, bạn vẫn giữ được danh tính của một người kỷ luật và chuỗi ngày không bao giờ bị đứt gãy!
    `
  },
  {
    id: 'water-metabolism',
    category: 'diet',
    categoryLabel: 'Dinh Dưỡng',
    tagColor: 'var(--water-primary)',
    title: 'Phân biệt "Đói Thật" vs "Khát Nước": Đòn bẩy trao đổi chất bí mật',
    readTime: '3 phút đọc',
    summary: 'Hơn 60% trường hợp thèm ăn vặt buổi chiều thực chất chỉ là cơ thể đang phát tín hiệu thiếu nước nhẹ. Uống đủ 2.5L nước giúp đốt thêm năng lượng nghỉ.',
    publishedDate: '3 ngày trước',
    image: 'https://images.unsplash.com/photo-1559839914-1b396e6dd860?auto=format&fit=crop&w=600&q=80',
    content: `
### 1. Tại sao não bộ nhầm lẫn giữa đói và khát?
Trung tâm điều khiển cơn đói và cơn khát đều nằm ở vùng dưới đồi (Hypothalamus) của não bộ:
- Khi cơ thể bắt đầu thiếu nước nhẹ (khoảng 1-2%), các tín hiệu nơ-ron truyền về rất giống cảm giác thèm ăn đường hoặc đồ ngọt.
- Nếu bạn uống ngay 1 ly nước ấm 300ml và chờ 15 phút, cơn thèm ăn thường sẽ tự động biến mất hoàn toàn.

### 2. Nước thúc đẩy đốt calo như thế nào?
- Uống 500ml nước lọc có thể làm tăng tốc độ trao đổi chất nghỉ (resting metabolic rate) từ 24-30% trong vòng 60 phút sau đó.
- Nước là môi trường bắt buộc cho quá trình phân giải mỡ (Lipolysis). Không uống đủ nước, tốc độ đốt mỡ của tế bào sẽ chậm đi đáng kể.
    `
  },
  {
    id: 'sleep-muscle-recovery',
    category: 'recovery',
    categoryLabel: 'Giấc Ngủ & Hormone',
    tagColor: '#6366f1',
    title: 'Ngủ 7-8 tiếng: Hormone tăng trưởng (HGH) và cơ chế đốt mỡ tự nhiên',
    readTime: '4 phút đọc',
    summary: 'Thiếu ngủ chỉ 1 tuần có thể làm giảm độ nhạy insulin xuống 30% và kích thích thèm đồ ngọt. Khám phá cách tối ưu giấc ngủ để hỗ trợ tập luyện.',
    publishedDate: 'Tuần này',
    image: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=600&q=80',
    content: `
### 1. Điều gì xảy ra khi bạn ngủ sâu?
- Tuyến yên tiết ra phần lớn lượng **Hormone Tăng Trưởng (HGH)** trong các chu kỳ ngủ sâu (Slow-wave sleep). HGH là chìa khóa vàng để phục hồi mô cơ, làm săn chắc da và oxy hóa mỡ thừa.
- Thiếu ngủ kéo dài làm tụt nồng độ Testosterone ở cả nam lẫn nữ, khiến buổi tập hôm sau nặng nhọc và dễ chấn thương hơn.

### 2. Quy tắc 3-2-1 để có giấc ngủ phục hồi tối đa:
- **3 tiếng trước khi ngủ:** Dừng ăn các bữa ăn nặng calo.
- **2 tiếng trước khi ngủ:** Giảm uống lượng nước lớn để tránh thức giấc đi tiểu đêm.
- **1 tiếng trước khi ngủ:** Tắt ánh sáng xanh từ điện thoại, chuyển sang chế độ đọc sách hoặc giãn cơ nhẹ.
    `
  }
]

export default function HomeTab({ 
  streakStats, 
  onGoToToday, 
  onInstallPWA, 
  isInstalled 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [readingArticle, setReadingArticle] = useState(null)

  const categories = [
    { id: 'all', label: 'Tất cả bài viết' },
    { id: 'diet', label: 'Dinh dưỡng & Diet' },
    { id: 'training', label: 'Tập luyện & Khoa học' },
    { id: 'recovery', label: 'Phục hồi & Giấc ngủ' },
    { id: 'mindset', label: 'Kỷ luật & Thói quen' }
  ]

  const filteredArticles = selectedCategory === 'all'
    ? HEALTH_ARTICLES
    : HEALTH_ARTICLES.filter(a => a.category === selectedCategory)

  return (
    <div>
      {/* 1. Hero Discipline Status & Daily Motivational Quote */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-md)',
        padding: '20px 18px',
        marginBottom: 16,
        position: 'relative',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color="#facc15" />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
              BẢN TIN SỨC KHỎE & KỶ LUẬT
            </span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            backgroundColor: 'rgba(234, 88, 12, 0.2)',
            border: '1px solid rgba(251, 146, 60, 0.3)',
            borderRadius: 'var(--radius-full)',
            color: '#fb923c',
            fontSize: '0.78rem',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)'
          }}>
            <Flame size={14} fill="currentColor" />
            <span>{streakStats.currentStreak} NGÀY</span>
          </div>
        </div>

        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.35, marginBottom: 8 }}>
          "Kỷ luật hôm nay, tự hào ngày mai."
        </h1>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: 16 }}>
          Mỗi bữa ăn đủ chất và mỗi buổi vận động đều là một lá phiếu bạn bầu cho phiên bản mạnh mẽ nhất của chính mình.
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onGoToToday}
            className="btn-primary"
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              color: '#0f172a',
              padding: '10px 14px',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            Vào Check-in Hôm Nay <ArrowRight size={16} />
          </button>

          {!isInstalled && (
            <button
              onClick={onInstallPWA}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Cài đặt PWA lên điện thoại"
            >
              <Download size={16} />
              <span>Cài App</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. PWA App-like Promo Bar if not installed */}
      {!isInstalled && (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10
        }}>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e40af' }}>
              📲 Cài Per-Track lên màn hình chính
            </div>
            <div style={{ fontSize: '0.74rem', color: '#3b82f6', marginTop: 2 }}>
              Nhận thông báo nhắc giờ ăn & giờ tập trực tiếp trên điện thoại
            </div>
          </div>
          <button
            onClick={onInstallPWA}
            style={{
              backgroundColor: '#1d4ed8',
              color: '#ffffff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Tải ngay
          </button>
        </div>
      )}

      {/* 3. Category Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-main)',
              fontSize: '0.78rem',
              fontWeight: selectedCategory === cat.id ? 700 : 500,
              backgroundColor: selectedCategory === cat.id ? 'var(--text-primary)' : 'var(--bg-surface)',
              color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4. Health Articles Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredArticles.map(article => (
          <article
            key={article.id}
            onClick={() => setReadingArticle(article)}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-main)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.15s ease'
            }}
          >
            <img
              src={article.image}
              alt={article.title}
              style={{
                width: '100%',
                height: 150,
                objectFit: 'cover',
                display: 'block'
              }}
            />

            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: article.tagColor,
                  letterSpacing: '0.03em'
                }}>
                  {article.categoryLabel}
                </span>

                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> {article.readTime}
                </span>
              </div>

              <h2 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 6 }}>
                {article.title}
              </h2>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                {article.summary}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{article.publishedDate}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Đọc tiếp <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 5. Article Detail Full Reader Modal */}
      {readingArticle && (
        <div className="modal-overlay" onClick={() => setReadingArticle(null)} style={{ zIndex: 110 }}>
          <div 
            className="modal-sheet" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '92vh', overflowY: 'auto', padding: '22px 20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: readingArticle.tagColor,
                backgroundColor: 'var(--bg-subtle)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)'
              }}>
                {readingArticle.categoryLabel}
              </span>
              <button className="sheet-close-btn" onClick={() => setReadingArticle(null)}>
                <X size={20} />
              </button>
            </div>

            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: 10 }}>
              {readingArticle.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              <span>{readingArticle.publishedDate}</span>
              <span>•</span>
              <span>⏱️ {readingArticle.readTime}</span>
            </div>

            <img
              src={readingArticle.image}
              alt={readingArticle.title}
              style={{
                width: '100%',
                height: 180,
                objectFit: 'cover',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 16
              }}
            />

            <div style={{
              fontSize: '0.88rem',
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              whiteSpace: 'pre-line'
            }}>
              {readingArticle.content}
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-main)' }}>
              <button
                onClick={() => {
                  setReadingArticle(null)
                  onGoToToday()
                }}
                className="btn-primary"
              >
                Áp Dụng Vào Thực Đơn Hôm Nay <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
