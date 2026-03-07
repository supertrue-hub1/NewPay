import HeaderNew from '@/components/HeaderNew'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Тестовый Header - CashPeek',
  description: 'Тестовая страница с новым дизайном Header',
}

export default function TestHeaderPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      <HeaderNew />
      
      <main style={{ padding: '64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{
            fontSize: 40,
            fontWeight: 700,
            color: '#2C3E50',
            marginBottom: 24,
            fontFamily: 'Roboto, sans-serif',
          }}>
            Новый Header - Дизайн
          </h1>
          
          <p style={{
            fontSize: 18,
            color: '#2C3E50',
            opacity: 0.8,
            marginBottom: 48,
            fontFamily: 'Roboto, sans-serif',
          }}>
            Тестовая страница с новым дизайном Header в стиле "Доверие и безопасность"
          </p>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{
              flex: '1 1 300px',
              padding: 24,
              background: '#fff',
              borderRadius: 12,
              borderLeft: '4px solid #FF8C42',
            }}>
              <h3 style={{
                fontSize: 20,
                fontWeight: 600,
                color: '#2C3E50',
                marginBottom: 12,
                fontFamily: 'Roboto, sans-serif',
              }}>
                Визуальные гарантии
              </h3>
              <p style={{
                fontSize: 14,
                color: '#2C3E50',
                opacity: 0.7,
                fontFamily: 'Roboto, sans-serif',
              }}>
                Значки безопасности на видном месте
              </p>
            </div>

            <div style={{
              flex: '1 1 300px',
              padding: 24,
              background: '#fff',
              borderRadius: 12,
              borderLeft: '4px solid #FF8C42',
            }}>
              <h3 style={{
                fontSize: 20,
                fontWeight: 600,
                color: '#2C3E50',
                marginBottom: 12,
                fontFamily: 'Roboto, sans-serif',
              }}>
                Прозрачность условий
              </h3>
              <p style={{
                fontSize: 14,
                color: '#2C3E50',
                opacity: 0.7,
                fontFamily: 'Roboto, sans-serif',
              }}>
                Все данные о займе доступны сразу
              </p>
            </div>

            <div style={{
              flex: '1 1 300px',
              padding: 24,
              background: '#fff',
              borderRadius: 12,
              borderLeft: '4px solid #FF8C42',
            }}>
              <h3 style={{
                fontSize: 20,
                fontWeight: 600,
                color: '#2C3E50',
                marginBottom: 12,
                fontFamily: 'Roboto, sans-serif',
              }}>
                Защита данных
              </h3>
              <p style={{
                fontSize: 14,
                color: '#2C3E50',
                opacity: 0.7,
                fontFamily: 'Roboto, sans-serif',
              }}>
                SSL-шифрование и безопасность
              </p>
            </div>
          </div>

          <div style={{
            marginTop: 48,
            padding: 32,
            background: '#fff',
            borderRadius: 12,
          }}>
            <h2 style={{
              fontSize: 24,
              fontWeight: 600,
              color: '#2C3E50',
              marginBottom: 16,
              fontFamily: 'Roboto, sans-serif',
            }}>
              Особенности нового Header:
            </h2>
            <ul style={{
              fontSize: 16,
              color: '#2C3E50',
              opacity: 0.8,
              fontFamily: 'Roboto, sans-serif',
              paddingLeft: 20,
              lineHeight: 2,
            }}>
              <li>Тёмный фон (#2C3E50) - создаёт ощущение надёжности</li>
              <li>Оранжевые акценты (#FF8C42) - привлекают внимание к важным элементам</li>
              <li>Бейджи SSL и ЦБ РФ в верхней части</li>
              <li>Иконка щита в логотипе</li>
              <li>Кнопка "Безопасный подбор" - призыв к действию</li>
              <li>Компактная навигация</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
