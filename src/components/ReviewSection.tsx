'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { Box, Typography, Avatar, Container } from '@mui/material'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import 'swiper/css'
import 'swiper/css/navigation'

interface Review {
  id: number
  userName: string
  userPhoto: string
  location: string
  rating: number
  reviewText: string
}

const reviews: Review[] = [
  {
    id: 1,
    userName: 'Александр Петров',
    userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    location: 'Москва, Россия',
    rating: 5,
    reviewText: 'Отличный сервис! Очень быстро одобрили займ, деньги пришли на карту через 5 минут. Спасибо!'
  },
  {
    id: 2,
    userName: 'Елена Смирнова',
    userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    location: 'Санкт-Петербург, Россия',
    rating: 5,
    reviewText: 'Пользуюсь уже третий раз, всегда всё отлично. Удобный калькулятор, понятные условия.'
  },
  {
    id: 3,
    userName: 'Михаил Иванов',
    userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    location: 'Екатеринбург, Россия',
    rating: 4.5,
    reviewText: 'Хороший сервис, быстрое оформление. Единственное - хотелось бы больше способов вывода.'
  },
  {
    id: 4,
    userName: 'Наталья Козлова',
    userPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    location: 'Новосибирск, Россия',
    rating: 5,
    reviewText: 'Самый лучший сервис микрозаймов! Всё прозрачно, никаких скрытых комиссий. Рекомендую!'
  },
  {
    id: 5,
    userName: 'Дмитрий Волков',
    userPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    location: 'Казань, Россия',
    rating: 4.5,
    reviewText: 'Всё понравилось. Оформил займ за 10 минут, деньги получил мгновенно. Спасибо!'
  },
  {
    id: 6,
    userName: 'Анна Морозова',
    userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    location: 'Нижний Новгород, Россия',
    rating: 5,
    reviewText: 'Очень довольна! В первый раз брала займ, всё прошло гладко. Деньги пришли быстро.'
  },
  {
    id: 7,
    userName: 'Сергей Кузнецов',
    userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop',
    location: 'Воронеж, Россия',
    rating: 4,
    reviewText: 'Нормальный сервис, пользуюсь периодически. Главное - честные условия.'
  },
  {
    id: 8,
    userName: 'Ольга Лебедева',
    userPhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    location: 'Краснодар, Россия',
    rating: 5,
    reviewText: 'Брала займ на покупку бытовой техники. Всё отлично, выплатила вовремя.'
  },
  {
    id: 9,
    userName: 'Иван Соколов',
    userPhoto: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    location: 'Самара, Россия',
    rating: 4.5,
    reviewText: 'Хороший сервис, помог в трудной ситуации. Единственное - хотелось бы больше сроков.'
  },
  {
    id: 10,
    userName: 'Мария Новикова',
    userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    location: 'Уфа, Россия',
    rating: 5,
    reviewText: 'Самый удобный сервис! Всё онлайн, без звонков и очередей. Рекомендую!'
  },
  {
    id: 11,
    userName: 'Андрей Козлов',
    userPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    location: 'Челябинск, Россия',
    rating: 4,
    reviewText: 'Всё понятно и прозрачно. Пользуюсь уже полгода, нареканий нет.'
  },
  {
    id: 12,
    userName: 'Екатерина Петрова',
    userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    location: 'Ростов-на-Дону, Россия',
    rating: 5,
    reviewText: 'Отличная поддержка! Отвечают быстро, помогли с оформлением. Спасибо!'
  },
  {
    id: 13,
    userName: 'Виктор Сидоров',
    userPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop',
    location: 'Омск, Россия',
    rating: 4.5,
    reviewText: 'Нормальный сервис, деньги приходят быстро. Выручает в сложных ситуациях.'
  },
  {
    id: 14,
    userName: 'Татьяна Михайлова',
    userPhoto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop',
    location: 'Красноярск, Россия',
    rating: 5,
    reviewText: 'Очень удобно! Всё можно сделать с телефона, не надо никуда ехать.'
  },
  {
    id: 15,
    userName: 'Павел Алексеев',
    userPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    location: 'Пермь, Россия',
    rating: 4,
    reviewText: 'Хороший сервис, быстрое оформление. Пользуюсь уже несколько раз.'
  },
  {
    id: 16,
    userName: 'Надежда Фёдорова',
    userPhoto: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop',
    location: 'Волгоград, Россия',
    rating: 5,
    reviewText: 'Спасибо за помощь! Взяла займ на лечение, всё прошло отлично.'
  },
  {
    id: 17,
    userName: 'Роман Макаров',
    userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop',
    location: 'Саратов, Россия',
    rating: 4.5,
    reviewText: 'Всё понравилось, быстро и удобно. Единственное - не хватает приложения.'
  },
  {
    id: 18,
    userName: 'Людмила Егорова',
    userPhoto: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=100&h=100&fit=crop',
    location: 'Тюмень, Россия',
    rating: 5,
    reviewText: 'Отличный сервис! Всё прозрачно, никаких подводных камней. Рекомендую!'
  },
  {
    id: 19,
    userName: 'Константин Захаров',
    userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    location: 'Тольятти, Россия',
    rating: 4,
    reviewText: 'Нормальный сервис, деньги приходят быстро. Выручает в трудный момент.'
  },
  {
    id: 20,
    userName: 'Светлана Комарова',
    userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop',
    location: 'Ижевск, Россия',
    rating: 5,
    reviewText: 'Пользуюсь постоянно! Очень удобно, особенно ночью можно оформить.'
  },
  {
    id: 21,
    userName: 'Денис Борисов',
    userPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop',
    location: 'Барнаул, Россия',
    rating: 4.5,
    reviewText: 'Хороший сервис, быстрое одобрение. Выручает, когда срочно нужны деньги.'
  },
  {
    id: 22,
    userName: 'Ирина Щербакова',
    userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    location: 'Архангельск, Россия',
    rating: 5,
    reviewText: 'Самый лучший сервис! Всё понятно, быстро, без лишних вопросов.'
  },
  {
    id: 23,
    userName: 'Максим Громов',
    userPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    location: 'Калининград, Россия',
    rating: 4,
    reviewText: 'Нормально, деньги приходят быстро. Пользуюсь периодически.'
  },
  {
    id: 24,
    userName: 'Алёна Попова',
    userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop',
    location: 'Ульяновск, Россия',
    rating: 5,
    reviewText: 'Всё отлично! Брала займ на свадьбу, всё прошло гладко. Спасибо!'
  },
  {
    id: 25,
    userName: 'Георгий Смирнов',
    userPhoto: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    location: 'Хабаровск, Россия',
    rating: 4.5,
    reviewText: 'Хороший сервис, выручает в сложных ситуациях. Рекомендую!'
  },
  {
    id: 26,
    userName: 'Валентина Кудрявцева',
    userPhoto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop',
    location: 'Иркутск, Россия',
    rating: 5,
    reviewText: 'Отличный сервис! Всё очень быстро, деньги пришли за 3 минуты.'
  },
  {
    id: 27,
    userName: 'Станислав Орлов',
    userPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    location: 'Кемерово, Россия',
    rating: 4,
    reviewText: 'Нормальный сервис, без особых нареканий. Пользуюсь уже полгода.'
  },
  {
    id: 28,
    userName: 'Галина Виноградова',
    userPhoto: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop',
    location: 'Махачкала, Россия',
    rating: 5,
    reviewText: 'Самый удобный сервис! Всё онлайн, без очередей и ожидания.'
  },
  {
    id: 29,
    userName: 'Борис Титов',
    userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop',
    location: 'Томск, Россия',
    rating: 4.5,
    reviewText: 'Хороший сервис, выручает в трудный момент. Деньги приходят быстро.'
  },
  {
    id: 30,
    userName: 'Зинаида Савельева',
    userPhoto: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=100&h=100&fit=crop',
    location: 'Набережные Челны, Россия',
    rating: 5,
    reviewText: 'Пользуюсь постоянно! Очень удобно, особенно когда банк отказывает.'
  },
  {
    id: 31,
    userName: 'Эдуард Киселёв',
    userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    location: 'Оренбург, Россия',
    rating: 4,
    reviewText: 'Нормально, свои функции выполняет. Деньги приходят быстро.'
  },
  {
    id: 32,
    userName: 'Вера Дмитриева',
    userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop',
    location: 'Пенза, Россия',
    rating: 5,
    reviewText: 'Отличный сервис! Всё прозрачно, никаких скрытых комиссий. Спасибо!'
  },
  {
    id: 33,
    userName: 'Фёдор Ефимов',
    userPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop',
    location: 'Курск, Россия',
    rating: 4.5,
    reviewText: 'Хороший сервис, помог в трудной ситуации. Рекомендую!'
  },
  {
    id: 34,
    userName: 'Лидия Кузьмина',
    userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    location: 'Липецк, Россия',
    rating: 5,
    reviewText: 'Всё отлично! Взяла займ на ремонт, выплатила без проблем.'
  },
  {
    id: 35,
    userName: 'Геннадий Поляков',
    userPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    location: 'Тула, Россия',
    rating: 4,
    reviewText: 'Нормальный сервис, свои функции выполняет. Пользуюсь периодически.'
  },
  {
    id: 36,
    userName: 'Нина Сорокина',
    userPhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    location: 'Калуга, Россия',
    rating: 5,
    reviewText: 'Самый лучший сервис! Всё быстро, удобно, без лишних вопросов.'
  },
  {
    id: 37,
    userName: 'Аркадий Белов',
    userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop',
    location: 'Смоленск, Россия',
    rating: 4.5,
    reviewText: 'Хороший сервис, выручает в сложных ситуациях. Деньги приходят быстро.'
  },
  {
    id: 38,
    userName: 'Раиса Максимова',
    userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    location: 'Брянск, Россия',
    rating: 5,
    reviewText: 'Отличный сервис! Всё онлайн, без очередей. Очень довольна!'
  },
  {
    id: 39,
    userName: 'Семён Филиппов',
    userPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    location: 'Курган, Россия',
    rating: 4,
    reviewText: 'Нормальный сервис, деньги приходят быстро. Выручает в трудный момент.'
  },
  {
    id: 40,
    userName: 'Полина Лазарева',
    userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    location: 'Тверь, Россия',
    rating: 5,
    reviewText: 'Пользуюсь постоянно! Очень удобно, особенно ночью. Спасибо!'
  },
  {
    id: 41,
    userName: 'Лев Колесников',
    userPhoto: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    location: 'Иваново, Россия',
    rating: 4.5,
    reviewText: 'Хороший сервис, быстрое оформление. Выручает, когда срочно нужны деньги.'
  },
  {
    id: 42,
    userName: 'Маргарита Гончарова',
    userPhoto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop',
    location: 'Чебоксары, Россия',
    rating: 5,
    reviewText: 'Всё отлично! Взяла займ на отпуск, всё прошло гладко. Рекомендую!'
  },
  {
    id: 43,
    userName: 'Олег Фомин',
    userPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    location: 'Ярославль, Россия',
    rating: 4,
    reviewText: 'Нормальный сервис, без особых нареканий. Пользуюсь уже несколько раз.'
  },
  {
    id: 44,
    userName: 'Клавдия Авдеева',
    userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop',
    location: 'Мурманск, Россия',
    rating: 5,
    reviewText: 'Самый удобный сервис! Всё можно сделать с телефона, не надо никуда ехать.'
  },
  {
    id: 45,
    userName: 'Захар Давыдов',
    userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    location: 'Орел, Россия',
    rating: 4.5,
    reviewText: 'Хороший сервис, помог в трудной ситуации. Выручает постоянно.'
  },
  {
    id: 46,
    userName: 'Эмма Герасимова',
    userPhoto: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=100&h=100&fit=crop',
    location: 'Грозный, Россия',
    rating: 5,
    reviewText: 'Отличный сервис! Всё прозрачно, никаких подводных камней. Спасибо!'
  },
  {
    id: 47,
    userName: 'Никита Савин',
    userPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop',
    location: 'Владимир, Россия',
    rating: 4,
    reviewText: 'Нормальный сервис, свои функции выполняет. Деньги приходят быстро.'
  },
  {
    id: 48,
    userName: 'Антонина Котова',
    userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop',
    location: 'Псков, Россия',
    rating: 5,
    reviewText: 'Всё отлично! Взяла займ на лечение, всё прошло гладко. Спасибо!'
  },
  {
    id: 49,
    userName: 'Прохор Шестаков',
    userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop',
    location: 'Саранск, Россия',
    rating: 4.5,
    reviewText: 'Хороший сервис, быстрое оформление. Выручает в сложных ситуациях.'
  },
  {
    id: 50,
    userName: 'Аграфена Некрасова',
    userPhoto: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop',
    location: 'Астрахань, Россия',
    rating: 5,
    reviewText: 'Самый лучший сервис! Всё очень быстро, деньги пришли за пару минут.'
  }
]

const renderStars = (rating: number) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`star-${i}`} style={{ color: '#fbbf24', fontSize: 16 }} />)
  }
  
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half-star" style={{ color: '#fbbf24', fontSize: 16 }} />)
  }

  const remainingStars = 5 - Math.ceil(rating)
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<FaRegStar key={`empty-star-${i}`} style={{ color: '#d1d5db', fontSize: 16 }} />)
  }

  return stars
}

export default function ReviewSection() {
  return (
    <Box sx={{ bgcolor: '#f9fafb', py: 8, px: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 800, color: '#111827', mb: 2 }}
          >
            Отзывы наших клиентов
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ color: '#6b7280', maxWidth: 600, mx: 'auto', fontSize: '1.1rem' }}
          >
            Узнайте, что говорят наши клиенты о работе сервиса. Тысячи довольных пользователей уже оформили займы через наш сайт.
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next'
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            style={{ paddingBottom: 48 }}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <Box 
                  sx={{ 
                    bgcolor: 'white', 
                    borderRadius: 2, 
                    p: 3, 
                    height: '100%',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Avatar
                      src={review.userPhoto}
                      alt={review.userName}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827' }}>
                            {review.userName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {review.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {renderStars(review.rating)}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ color: '#4b5563', fontStyle: 'italic', lineHeight: 1.7 }}
                    >
                      "{review.reviewText}"
                    </Typography>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>

          <button 
            className="swiper-button-prev"
            style={{
              position: 'absolute',
              top: '50%',
              left: -12,
              transform: 'translateY(-50%)',
              background: 'white',
              borderRadius: '50%',
              width: 44,
              height: 44,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IoIosArrowBack style={{ fontSize: 24, color: '#6b7280' }} />
          </button>
          <button 
            className="swiper-button-next"
            style={{
              position: 'absolute',
              top: '50%',
              right: -12,
              transform: 'translateY(-50%)',
              background: 'white',
              borderRadius: '50%',
              width: 44,
              height: 44,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IoIosArrowForward style={{ fontSize: 24, color: '#6b7280' }} />
          </button>
        </Box>
      </Container>
    </Box>
  )
}
