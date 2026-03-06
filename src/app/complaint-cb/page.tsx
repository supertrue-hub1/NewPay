import { Metadata } from 'next'
import { Container, Typography, Box, Paper, Grid } from '@mui/material'

export const metadata: Metadata = {
  title: 'Жалоба в ЦБ РФ | NewPay.ru',
  description: 'Как правильно подать жалобу в Центральный банк России на действия микрофинансовых организаций',
}

export default function ComplaintCBPage() {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Как подать жалобу в ЦБ РФ
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
          Если вы столкнулись с нарушением прав со стороны микрофинансовой организации (МФО), вы можете подать жалобу в Центральный банк России (ЦБ РФ). Ниже мы расскажем, как это сделать правильно.
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                Способы подачи жалобы
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>Онлайн на сайте ЦБ</strong> — через интернет-приёмную cbr.ru
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>По почте</strong> — 107016, г. Москва, ул. Неглинная, д. 12
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>По телефону</strong> — 8 (800) 300-30-00 (бесплатно по России)
                </Typography>
                <Typography component="li">
                  <strong>Лично</strong> — в любом территориальном учреждении ЦБ
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                Основные причины жалоб
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" sx={{ mb: 1 }}>
                  Нарушение условий договора займа
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Неправомерное начисление процентов и штрафов
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Отказ в выдаче займа без объяснения причин
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Проблемы с досрочным погашением
                </Typography>
                <Typography component="li">
                  Разглашение персональных данных
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                Как правильно составить жалобу
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                При подаче жалобы укажите следующую информацию:
              </Typography>
              
              <Box component="ol" sx={{ pl: 2, lineHeight: 1.8 }}>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>Ваши данные:</strong> ФИО, контактный телефон, email, адрес регистрации
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>Данные МФО:</strong> наименование организации, ИНН, ОГРН, адрес
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>Описание ситуации:</strong> подробно изложите суть проблемы с указанием дат
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>Ваши требования:</strong> чего вы хотите добиться (возврат средств, прекращение начислений и т.д.)
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>Приложения:</strong> копии договора займа, переписки с МФО, платёжных документов
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, bgcolor: 'warning.light' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Важные советы
              </Typography>
              
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                Перед подачей жалобы в ЦБ РФ рекомендуем сначала попробовать решить вопрос напрямую с МФО. 
                Направьте претензию в письменном виде (желательно с уведомлением о вручении) и дождитесь ответа. 
                Если МФО не отвечает или отказывает в удовлетворении требований, тогда обращайтесь в ЦБ.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
    </Container>
    </>
  )
}
