'use client'

import { Box, Container, Typography, Grid, TextField, InputAdornment, Rating, Avatar, Chip, Pagination } from '@mui/material'
import { Search } from '@mui/icons-material'
import { useState } from 'react'
import ReviewSection from '@/components/ReviewSection'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

const REVIEWS_PER_PAGE = 20

// Данные отзывов (дублируются для отображения на странице)
interface Review {
  id: number
  userName: string
  userPhoto: string
  location: string
  rating: number
  reviewText: string
  date: string
}

const allReviews: Review[] = [
  { id: 1, userName: 'Александр Петров', userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', location: 'Москва, Россия', rating: 5, reviewText: 'Отличный сервис! Очень быстро одобрили займ, деньги пришли на карту через 5 минут. Спасибо!', date: '15.01.2025' },
  { id: 2, userName: 'Елена Смирнова', userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'Санкт-Петербург, Россия', rating: 5, reviewText: 'Пользуюсь уже третий раз, всегда всё отлично. Удобный калькулятор, понятные условия.', date: '14.01.2025' },
  { id: 3, userName: 'Михаил Иванов', userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', location: 'Екатеринбург, Россия', rating: 4.5, reviewText: 'Хороший сервис, быстрое оформление. Единственное - хотелось бы больше способов вывода.', date: '13.01.2025' },
  { id: 4, userName: 'Наталья Козлова', userPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', location: 'Новосибирск, Россия', rating: 5, reviewText: 'Самый лучший сервис микрозаймов! Всё прозрачно, никаких скрытых комиссий. Рекомендую!', date: '12.01.2025' },
  { id: 5, userName: 'Дмитрий Волков', userPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', location: 'Казань, Россия', rating: 4.5, reviewText: 'Всё понравилось. Оформил займ за 10 минут, деньги получил мгновенно. Спасибо!', date: '11.01.2025' },
  { id: 6, userName: 'Анна Морозова', userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', location: 'Нижний Новгород, Россия', rating: 5, reviewText: 'Очень довольна! В первый раз брала займ, всё прошло гладко. Деньги пришли быстро.', date: '10.01.2025' },
  { id: 7, userName: 'Сергей Кузнецов', userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop', location: 'Воронеж, Россия', rating: 4, reviewText: 'Нормальный сервис, пользуюсь периодически. Главное - честные условия.', date: '09.01.2025' },
  { id: 8, userName: 'Ольга Лебедева', userPhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop', location: 'Краснодар, Россия', rating: 5, reviewText: 'Брала займ на покупку бытовой техники. Всё отлично, выплатила вовремя.', date: '08.01.2025' },
  { id: 9, userName: 'Иван Соколов', userPhoto: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', location: 'Самара, Россия', rating: 4.5, reviewText: 'Хороший сервис, помог в трудной ситуации. Единственное - хотелось бы больше сроков.', date: '07.01.2025' },
  { id: 10, userName: 'Мария Новикова', userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', location: 'Уфа, Россия', rating: 5, reviewText: 'Самый удобный сервис! Всё онлайн, без звонков и очередей. Рекомендую!', date: '06.01.2025' },
  { id: 11, userName: 'Андрей Козлов', userPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', location: 'Челябинск, Россия', rating: 4, reviewText: 'Всё понятно и прозрачно. Пользуюсь уже полгода, нареканий нет.', date: '05.01.2025' },
  { id: 12, userName: 'Екатерина Петрова', userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', location: 'Ростов-на-Дону, Россия', rating: 5, reviewText: 'Отличная поддержка! Отвечают быстро, помогли с оформлением. Спасибо!', date: '04.01.2025' },
  { id: 13, userName: 'Виктор Сидоров', userPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop', location: 'Омск, Россия', rating: 4.5, reviewText: 'Нормальный сервис, деньги приходят быстро. Выручает в сложных ситуациях.', date: '03.01.2025' },
  { id: 14, userName: 'Татьяна Михайлова', userPhoto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop', location: 'Красноярск, Россия', rating: 5, reviewText: 'Очень удобно! Всё можно сделать с телефона, не надо никуда ехать.', date: '02.01.2025' },
  { id: 15, userName: 'Павел Алексеев', userPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', location: 'Пермь, Россия', rating: 4, reviewText: 'Хороший сервис, быстрое оформление. Пользуюсь уже несколько раз.', date: '01.01.2025' },
  { id: 16, userName: 'Надежда Фёдорова', userPhoto: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop', location: 'Волгоград, Россия', rating: 5, reviewText: 'Спасибо за помощь! Взяла займ на лечение, всё прошло отлично.', date: '31.12.2024' },
  { id: 17, userName: 'Роман Макаров', userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop', location: 'Саратов, Россия', rating: 4.5, reviewText: 'Всё понравилось, быстро и удобно. Единственное - не хватает приложения.', date: '30.12.2024' },
  { id: 18, userName: 'Людмила Егорова', userPhoto: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=100&h=100&fit=crop', location: 'Тюмень, Россия', rating: 5, reviewText: 'Отличный сервис! Всё прозрачно, никаких подводных камней. Рекомендую!', date: '29.12.2024' },
  { id: 19, userName: 'Константин Захаров', userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', location: 'Тольятти, Россия', rating: 4, reviewText: 'Нормальный сервис, деньги приходят быстро. Выручает в трудный момент.', date: '28.12.2024' },
  { id: 20, userName: 'Светлана Комарова', userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop', location: 'Ижевск, Россия', rating: 5, reviewText: 'Пользуюсь постоянно! Очень удобно, особенно ночью можно оформить.', date: '27.12.2024' },
  { id: 21, userName: 'Денис Борисов', userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', location: 'Барнаул, Россия', rating: 4.5, reviewText: 'Хороший сервис, быстрое одобрение. Выручает, когда срочно нужны деньги.', date: '26.12.2024' },
  { id: 22, userName: 'Ирина Щербакова', userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'Архангельск, Россия', rating: 5, reviewText: 'Самый лучший сервис! Всё понятно, быстро, без лишних вопросов.', date: '25.12.2024' },
  { id: 23, userName: 'Максим Громов', userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', location: 'Калининград, Россия', rating: 4, reviewText: 'Нормально, деньги приходят быстро. Пользуюсь периодически.', date: '24.12.2024' },
  { id: 24, userName: 'Алёна Попова', userPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', location: 'Ульяновск, Россия', rating: 5, reviewText: 'Всё отлично! Брала займ на свадьбу, всё прошло гладко. Спасибо!', date: '23.12.2024' },
  { id: 25, userName: 'Георгий Смирнов', userPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', location: 'Хабаровск, Россия', rating: 4.5, reviewText: 'Хороший сервис, выручает в сложных ситуациях. Рекомендую!', date: '22.12.2024' },
  { id: 26, userName: 'Валентина Кудрявцева', userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', location: 'Иркутск, Россия', rating: 5, reviewText: 'Отличный сервис! Всё очень быстро, деньги пришли за 3 минуты.', date: '21.12.2024' },
  { id: 27, userName: 'Станислав Орлов', userPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', location: 'Кемерово, Россия', rating: 4, reviewText: 'Нормальный сервис, без особых нареканий. Пользуюсь уже полгода.', date: '20.12.2024' },
  { id: 28, userName: 'Галина Виноградова', userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop', location: 'Махачкала, Россия', rating: 5, reviewText: 'Самый удобный сервис! Всё онлайн, без очередей и ожидания.', date: '19.12.2024' },
  { id: 29, userName: 'Борис Титов', userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop', location: 'Томск, Россия', rating: 4.5, reviewText: 'Хороший сервис, выручает в трудный момент. Деньги приходят быстро.', date: '18.12.2024' },
  { id: 30, userName: 'Зинаида Савельева', userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', location: 'Набережные Челны, Россия', rating: 5, reviewText: 'Пользуюсь постоянно! Очень удобно, особенно когда банк отказывает.', date: '17.12.2024' },
  { id: 31, userName: 'Эдуард Киселёв', userPhoto: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', location: 'Оренбург, Россия', rating: 4, reviewText: 'Нормально, свои функции выполняет. Деньги приходят быстро.', date: '16.12.2024' },
  { id: 32, userName: 'Вера Дмитриева', userPhoto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop', location: 'Пенза, Россия', rating: 5, reviewText: 'Отличный сервис! Всё прозрачно, никаких скрытых комиссий. Спасибо!', date: '15.12.2024' },
  { id: 33, userName: 'Фёдор Ефимов', userPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop', location: 'Курск, Россия', rating: 4.5, reviewText: 'Хороший сервис, помог в трудной ситуации. Рекомендую!', date: '14.12.2024' },
  { id: 34, userName: 'Лидия Кузьмина', userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', location: 'Липецк, Россия', rating: 5, reviewText: 'Всё отлично! Взяла займ на ремонт, выплатила без проблем.', date: '13.12.2024' },
  { id: 35, userName: 'Геннадий Поляков', userPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', location: 'Тула, Россия', rating: 4, reviewText: 'Нормальный сервис, свои функции выполняет. Пользуюсь периодически.', date: '12.12.2024' },
  { id: 36, userName: 'Нина Сорокина', userPhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop', location: 'Калуга, Россия', rating: 5, reviewText: 'Самый лучший сервис! Всё быстро, удобно, без лишних вопросов.', date: '11.12.2024' },
  { id: 37, userName: 'Аркадий Белов', userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', location: 'Смоленск, Россия', rating: 4.5, reviewText: 'Хороший сервис, выручает в сложных ситуациях. Деньги приходят быстро.', date: '10.12.2024' },
  { id: 38, userName: 'Раиса Максимова', userPhoto: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=100&h=100&fit=crop', location: 'Брянск, Россия', rating: 5, reviewText: 'Отличный сервис! Всё онлайн, без очередей. Очень довольна!', date: '09.12.2024' },
  { id: 39, userName: 'Семён Филиппов', userPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', location: 'Курган, Россия', rating: 4, reviewText: 'Нормальный сервис, деньги приходят быстро. Выручает в трудный момент.', date: '08.12.2024' },
  { id: 40, userName: 'Полина Лазарева', userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', location: 'Тверь, Россия', rating: 5, reviewText: 'Пользуюсь постоянно! Очень удобно, особенно ночью. Спасибо!', date: '07.12.2024' },
  { id: 41, userName: 'Лев Колесников', userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop', location: 'Иваново, Россия', rating: 4.5, reviewText: 'Хороший сервис, быстрое оформление. Выручает, когда срочно нужны деньги.', date: '06.12.2024' },
  { id: 42, userName: 'Маргарита Гончарова', userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', location: 'Чебоксары, Россия', rating: 5, reviewText: 'Всё отлично! Взяла займ на отпуск, всё прошло гладко. Рекомендую!', date: '05.12.2024' },
  { id: 43, userName: 'Олег Фомин', userPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', location: 'Ярославль, Россия', rating: 4, reviewText: 'Нормальный сервис, без особых нареканий. Пользуюсь уже несколько раз.', date: '04.12.2024' },
  { id: 44, userName: 'Клавдия Авдеева', userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop', location: 'Мурманск, Россия', rating: 5, reviewText: 'Самый удобный сервис! Всё можно сделать с телефона, не надо никуда ехать.', date: '03.12.2024' },
  { id: 45, userName: 'Захар Давыдов', userPhoto: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', location: 'Орел, Россия', rating: 4.5, reviewText: 'Хороший сервис, помог в трудной ситуации. Выручает постоянно.', date: '02.12.2024' },
  { id: 46, userName: 'Эмма Герасимова', userPhoto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop', location: 'Грозный, Россия', rating: 5, reviewText: 'Отличный сервис! Всё прозрачно, никаких подводных камней. Спасибо!', date: '01.12.2024' },
  { id: 47, userName: 'Никита Савин', userPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop', location: 'Владимир, Россия', rating: 4, reviewText: 'Нормальный сервис, свои функции выполняет. Деньги приходят быстро.', date: '30.11.2024' },
  { id: 48, userName: 'Антонина Котова', userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop', location: 'Псков, Россия', rating: 5, reviewText: 'Всё отлично! Взяла займ на лечение, всё прошло гладко. Спасибо!', date: '29.11.2024' },
  { id: 49, userName: 'Прохор Шестаков', userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', location: 'Саранск, Россия', rating: 4.5, reviewText: 'Хороший сервис, быстрое оформление. Выручает в сложных ситуациях.', date: '28.11.2024' },
  { id: 50, userName: 'Аграфена Некрасова', userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'Астрахань, Россия', rating: 5, reviewText: 'Самый лучший сервис! Всё очень быстро, деньги пришли за пару минут.', date: '27.11.2024' },
  { id: 51, userName: 'Ярослав Чернов', userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', location: 'Тамбов, Россия', rating: 4, reviewText: 'Нормальный сервис, выручает в трудный момент. Деньги приходят быстро.', date: '26.11.2024' },
  { id: 52, userName: 'Владислава Романова', userPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', location: 'Симферополь, Россия', rating: 5, reviewText: 'Отличный сервис! Пользуюсь постоянно, всё устраивает. Рекомендую!', date: '25.11.2024' },
  { id: 53, userName: 'Степан Морозов', userPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', location: 'Камышин, Россия', rating: 4.5, reviewText: 'Хороший сервис, быстрое оформление. Выручает, когда банки отказывают.', date: '24.11.2024' },
  { id: 54, userName: 'Евгения Жукова', userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', location: 'Энгельс, Россия', rating: 5, reviewText: 'Очень довольна сервисом! Всё быстро, удобно, без лишних вопросов.', date: '23.11.2024' },
  { id: 55, userName: 'Владимир Зайцев', userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop', location: 'Севастополь, Россия', rating: 4, reviewText: 'Нормальный сервис, свои функции выполняет. Пользуюсь периодически.', date: '22.11.2024' },
  { id: 56, userName: 'Анжелика Воронцова', userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', location: 'Старый Оскол, Россия', rating: 5, reviewText: 'Самый лучший сервис! Взяла займ на ремонт квартиры, всё отлично!', date: '21.11.2024' },
  { id: 57, userName: 'Григорий Попов', userPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', location: 'Элиста, Россия', rating: 4.5, reviewText: 'Хороший сервис, помог в трудной ситуации. Деньги пришли быстро.', date: '20.11.2024' },
  { id: 58, userName: 'Диана Осипова', userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop', location: 'Норильск, Россия', rating: 5, reviewText: 'Отличный сервис! Всё онлайн, без очередей. Очень удобно!', date: '19.11.2024' },
  { id: 59, userName: 'Анатолий Кудряшов', userPhoto: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', location: 'Ангарск, Россия', rating: 4, reviewText: 'Нормально, свои функции выполняет. Выручает в трудный момент.', date: '18.11.2024' },
  { id: 60, userName: 'София Титова', userPhoto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop', location: 'Артём, Россия', rating: 5, reviewText: 'Пользуюсь постоянно! Очень удобно, особенно когда нужны срочно деньги.', date: '17.11.2024' },
  { id: 61, userName: 'Руслан Бондарев', userPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop', location: 'Нижневартовск, Россия', rating: 4.5, reviewText: 'Хороший сервис, быстрое оформление. Рекомендую!', date: '16.11.2024' },
  { id: 62, userName: 'Ксения Громова', userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop', location: 'Стерлитамак, Россия', rating: 5, reviewText: 'Отличный сервис! Взяла займ на свадьбу дочери, всё прошло гладко.', date: '15.11.2024' },
  { id: 63, userName: 'Тимур Калашников', userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', location: 'Братск, Россия', rating: 4, reviewText: 'Нормальный сервис, деньги приходят быстро. Выручает постоянно.', date: '14.11.2024' },
  { id: 64, userName: 'Альбина Соколова', userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'Новокузнецк, Россия', rating: 5, reviewText: 'Самый удобный сервис! Всё онлайн, без звонков. Спасибо!', date: '13.11.2024' },
  { id: 65, userName: 'Даниил Веселов', userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', location: 'Дзержинск, Россия', rating: 4.5, reviewText: 'Хороший сервис, помог в трудной ситуации. Выручает!', date: '12.11.2024' },
  { id: 66, userName: 'Нелли Ковалёва', userPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', location: 'Королёв, Россия', rating: 5, reviewText: 'Отличный сервис! Всё прозрачно, никаких скрытых комиссий. Рекомендую!', date: '11.11.2024' },
  { id: 67, userName: 'Марсель Халилов', userPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', location: 'Подольск, Россия', rating: 4, reviewText: 'Нормальный сервис, свои функции выполняет. Пользуюсь периодически.', date: '10.11.2024' },
  { id: 68, userName: 'Элина Маслова', userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', location: 'Мытищи, Россия', rating: 5, reviewText: 'Очень довольна! Взяла займ на лечение зубов, всё прошло отлично.', date: '09.11.2024' },
  { id: 69, userName: 'Амир Галиев', userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop', location: 'Батайск, Россия', rating: 4.5, reviewText: 'Хороший сервис, быстрое оформление. Выручает, когда нужны деньги.', date: '08.11.2024' },
  { id: 70, userName: 'Лилия Панова', userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', location: 'Химки, Россия', rating: 5, reviewText: 'Самый лучший сервис! Всё очень быстро, деньги пришли за 3 минуты.', date: '07.11.2024' },
  { id: 71, userName: 'Камиль Фаррахов', userPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', location: 'Балашиха, Россия', rating: 4, reviewText: 'Нормально, свои функции выполняет. Выручает в трудный момент.', date: '06.11.2024' },
  { id: 72, userName: 'Яна Гордеева', userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop', location: 'Жуковский, Россия', rating: 5, reviewText: 'Отличный сервис! Всё онлайн, без очередей. Очень довольна!', date: '05.11.2024' },
  { id: 73, userName: 'Артур Ахметов', userPhoto: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', location: 'Коломна, Россия', rating: 4.5, reviewText: 'Хороший сервис, помог в трудной ситуации. Рекомендую!', date: '04.11.2024' },
  { id: 74, userName: 'Амелия Старкова', userPhoto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop', location: 'Одинцово, Россия', rating: 5, reviewText: 'Пользуюсь постоянно! Очень удобно, особенно ночью. Спасибо!', date: '03.11.2024' },
  { id: 75, userName: 'Джамиль Сафин', userPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop', location: 'Красногорск, Россия', rating: 4, reviewText: 'Нормальный сервис, деньги приходят быстро. Выручает!', date: '02.11.2024' },
  { id: 76, userName: 'Алия Галиуллина', userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop', location: 'Пушкино, Россия', rating: 5, reviewText: 'Отличный сервис! Всё прозрачно, никаких подводных камней. Спасибо!', date: '01.11.2024' },
  { id: 77, userName: 'Ильнур Галиев', userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', location: 'Реутов, Россия', rating: 4.5, reviewText: 'Хороший сервис, быстрое оформление. Выручает в сложных ситуациях.', date: '31.10.2024' },
  { id: 78, userName: 'Зарина Юсупова', userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'Видное, Россия', rating: 5, reviewText: 'Самый удобный сервис! Всё можно сделать с телефона. Рекомендую!', date: '30.10.2024' },
  { id: 79, userName: 'Рамиль Сабитов', userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', location: 'Домодедово, Россия', rating: 4, reviewText: 'Нормально, свои функции выполняет. Пользуюсь уже несколько раз.', date: '29.10.2024' },
  { id: 80, userName: 'Диляра Хайруллина', userPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', location: 'Люберцы, Россия', rating: 5, reviewText: 'Очень довольна! Взяла займ на покупку машины, всё прошло гладко.', date: '28.10.2024' },
  { id: 81, userName: 'Ильдар Гарипов', userPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', location: 'Щёлково, Россия', rating: 4.5, reviewText: 'Хороший сервис, выручает в трудный момент. Деньги приходят быстро.', date: '27.10.2024' },
  { id: 82, userName: 'Айгуль Фахрутдинова', userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', location: 'Ивантеевка, Россия', rating: 5, reviewText: 'Отличный сервис! Всё онлайн, без очередей. Очень удобно!', date: '26.10.2024' },
  { id: 83, userName: 'Азат Валеев', userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop', location: 'Электросталь, Россия', rating: 4, reviewText: 'Нормальный сервис, свои функции выполняет. Выручает постоянно.', date: '25.10.2024' },
  { id: 84, userName: 'Лейсан Загитова', userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', location: 'Железнодорожный, Россия', rating: 5, reviewText: 'Самый лучший сервис! Всё очень быстро, деньги пришли мгновенно.', date: '24.10.2024' },
  { id: 85, userName: 'Фанис Галиуллин', userPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', location: 'Климовск, Россия', rating: 4.5, reviewText: 'Хороший сервис, помог в трудной ситуации. Рекомендую!', date: '23.10.2024' },
  { id: 86, userName: 'Гузель Шакирова', userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop', location: 'Лобня, Россия', rating: 5, reviewText: 'Пользуюсь постоянно! Очень удобно, особенно когда банк отказывает.', date: '22.10.2024' },
  { id: 87, userName: 'Ирек Галимов', userPhoto: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', location: 'Долгопрудный, Россия', rating: 4, reviewText: 'Нормально, свои функции выполняет. Выручает в трудный момент.', date: '21.10.2024' },
  { id: 88, userName: 'Эльвира Гарифуллина', userPhoto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop', location: 'Сергиев Посад, Россия', rating: 5, reviewText: 'Отличный сервис! Всё прозрачно, никаких скрытых комиссий. Спасибо!', date: '20.10.2024' },
  { id: 89, userName: 'Рустам Сахапов', userPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop', location: 'Воскресенск, Россия', rating: 4.5, reviewText: 'Хороший сервис, быстрое оформление. Выручает!', date: '19.10.2024' },
  { id: 90, userName: 'Айгуль Ахметшина', userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop', location: 'Егорьевск, Россия', rating: 5, reviewText: 'Самый удобный сервис! Всё можно сделать с телефона. Рекомендую!', date: '18.10.2024' },
  { id: 91, userName: 'Тимур Сафиуллин', userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', location: 'Котельники, Россия', rating: 4, reviewText: 'Нормальный сервис, свои функции выполняет. Пользуюсь периодически.', date: '17.10.2024' },
  { id: 92, userName: 'Зульфия Галиева', userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'Реутов, Россия', rating: 5, reviewText: 'Очень довольна! Взяла займ на ремонт, всё прошло отлично. Спасибо!', date: '16.10.2024' },
  { id: 93, userName: 'Айрат Гайнуллин', userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', location: 'Кашира, Россия', rating: 4.5, reviewText: 'Хороший сервис, выручает в сложных ситуациях. Деньги приходят быстро.', date: '15.10.2024' },
  { id: 94, userName: 'Эльмира Галиуллина', userPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', location: 'Ступино, Россия', rating: 5, reviewText: 'Отличный сервис! Всё онлайн, без очередей. Очень удобно!', date: '14.10.2024' },
  { id: 95, userName: 'Ринат Галиев', userPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', location: 'Чехов, Россия', rating: 4, reviewText: 'Нормально, свои функции выполняет. Выручает в трудный момент.', date: '13.10.2024' },
  { id: 96, userName: 'Алсу Галиева', userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', location: 'Серпухов, Россия', rating: 5, reviewText: 'Самый лучший сервис! Всё очень быстро, деньги пришли за пару минут.', date: '12.10.2024' },
  { id: 97, userName: 'Ильнар Галиев', userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop', location: 'Дубна, Россия', rating: 4.5, reviewText: 'Хороший сервис, помог в трудной ситуации. Рекомендую!', date: '11.10.2024' },
  { id: 98, userName: 'Регина Галиуллина', userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', location: 'Троицк, Россия', rating: 5, reviewText: 'Пользуюсь постоянно! Очень удобно, особенно когда нужны срочно деньги.', date: '10.10.2024' },
  { id: 99, userName: 'Равиль Галиев', userPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', location: 'Подольск, Россия', rating: 4, reviewText: 'Нормальный сервис, свои функции выполняет. Выручает постоянно.', date: '09.10.2024' },
  { id: 100, userName: 'Резеда Галиева', userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop', location: 'Химки, Россия', rating: 5, reviewText: 'Отличный сервис! Всё прозрачно, никаких подводных камней. Спасибо!', date: '08.10.2024' },
  { id: 101, userName: 'Азат Галиев', userPhoto: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', location: 'Королёв, Россия', rating: 4.5, reviewText: 'Хороший сервис, быстрое оформление. Выручает в сложных ситуациях.', date: '07.10.2024' },
  { id: 102, userName: 'Гульназ Галиева', userPhoto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop', location: 'Мытищи, Россия', rating: 5, reviewText: 'Самый удобный сервис! Всё можно сделать с телефона, не надо никуда ехать.', date: '06.10.2024' },
  { id: 103, userName: 'Фарит Галиев', userPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop', location: 'Балашиха, Россия', rating: 4, reviewText: 'Нормально, свои функции выполняет. Пользуюсь уже несколько раз.', date: '05.10.2024' },
  { id: 104, userName: 'Лилия Галиева', userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop', location: 'Подольск, Россия', rating: 5, reviewText: 'Очень довольна! Взяла займ на лечение, всё прошло гладко. Спасибо!', date: '04.10.2024' },
  { id: 105, userName: 'Дамир Галиев', userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', location: 'Электросталь, Россия', rating: 4.5, reviewText: 'Хороший сервис, помог в трудной ситуации. Выручает!', date: '03.10.2024' },
  { id: 106, userName: 'Эльвира Галиева', userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', location: 'Железнодорожный, Россия', rating: 5, reviewText: 'Отличный сервис! Всё онлайн, без очередей. Очень удобно!', date: '02.10.2024' },
  { id: 107, userName: 'Анвар Галиев', userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', location: 'Реутов, Россия', rating: 4, reviewText: 'Нормальный сервис, свои функции выполняет. Выручает в трудный момент.', date: '01.10.2024' },
  { id: 108, userName: 'Фатима Галиева', userPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', location: 'Люберцы, Россия', rating: 5, reviewText: 'Самый лучший сервис! Всё очень быстро, деньги пришли мгновенно.', date: '30.09.2024' },
  { id: 109, userName: 'Ильдар Галиев', userPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', location: 'Коломна, Россия', rating: 4.5, reviewText: 'Хороший сервис, быстрое оформление. Рекомендую!', date: '29.09.2024' },
  { id: 110, userName: 'Айгуль Галиева', userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', location: 'Электросталь, Россия', rating: 5, reviewText: 'Пользуюсь постоянно! Очень удобно, особенно когда нужны срочно деньги.', date: '28.09.2024' },
  { id: 111, userName: 'Руслан Галиев', userPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop', location: 'Одинцово, Россия', rating: 4, reviewText: 'Нормально, свои функции выполняет. Выручает постоянно.', date: '27.09.2024' },
  { id: 112, userName: 'Лейла Галиева', userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', location: 'Сергиев Посад, Россия', rating: 5, reviewText: 'Отличный сервис! Всё прозрачно, никаких скрытых комиссий. Спасибо!', date: '26.09.2024' },
  { id: 113, userName: 'Рамиль Галиев', userPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', location: 'Красногорск, Россия', rating: 4.5, reviewText: 'Хороший сервис, помог в трудной ситуации. Выручает!', date: '25.09.2024' },
  { id: 114, userName: 'Гульнара Галиева', userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop', location: 'Пушкино, Россия', rating: 5, reviewText: 'Самый удобный сервис! Всё можно сделать с телефона. Рекомендую!', date: '24.09.2024' },
  { id: 115, userName: 'Айрат Галиев', userPhoto: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop', location: 'Видное, Россия', rating: 4, reviewText: 'Нормальный сервис, свои функции выполняет. Пользуюсь уже несколько раз.', date: '23.09.2024' },
]

const renderStars = (rating: number) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`star-${i}`} style={{ color: '#fbbf24', fontSize: 18 }} />)
  }
  
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half-star" style={{ color: '#fbbf24', fontSize: 18 }} />)
  }

  const remainingStars = 5 - Math.ceil(rating)
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<FaRegStar key={`empty-star-${i}`} style={{ color: '#d1d5db', fontSize: 18 }} />)
  }

  return stars
}

export default function ReviewsContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredReviews = allReviews.filter(review => {
    const matchesSearch = review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = selectedRating === null || review.rating >= selectedRating
    return matchesSearch && matchesRating
  })

  // Пагинация
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE)
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE
  const endIndex = startIndex + REVIEWS_PER_PAGE
  const currentReviews = filteredReviews.slice(startIndex, endIndex)

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  // Сброс страницы при изменении фильтров
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleRatingChange = (rating: number | null) => {
    setSelectedRating(rating)
    setCurrentPage(1)
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Hero секция */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', 
        py: 8, 
        mb: 4,
      }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>
            Отзывы клиентов
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center', opacity: 0.95, maxWidth: 600, mx: 'auto' }}>
            Узнайте, что говорят наши клиенты о работе сервиса. Мы ценим каждый отзыв и постоянно работаем над улучшением.
          </Typography>
          
          {/* Статистика */}
          <Grid container spacing={3} sx={{ mt: 4, justifyContent: 'center' }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>115+</Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>Отзывов</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>4.8</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Rating value={4.8} precision={0.1} readOnly sx={{ color: '#fff' }} />
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>98%</Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>Довольных клиентов</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>24/7</Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>Работаем круглосуточно</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Карусель отзывов */}
        <Box sx={{ mb: 8 }}>
          <ReviewSection />
        </Box>

        {/* Поиск и фильтры */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            Все отзывы
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Поиск по имени, отзыву или городу..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label="Все" 
                  onClick={() => handleRatingChange(null)}
                  color={selectedRating === null ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip 
                  label="5 ★" 
                  onClick={() => handleRatingChange(5)}
                  color={selectedRating === 5 ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip 
                  label="4+ ★" 
                  onClick={() => handleRatingChange(4)}
                  color={selectedRating === 4 ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Список отзывов */}
        <Grid container spacing={3}>
          {currentReviews.map((review) => (
            <Grid size={{ xs: 12, md: 6 }} key={review.id}>
              <Box sx={{ 
                bgcolor: 'white', 
                borderRadius: 2, 
                p: 3, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                height: '100%'
              }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {review.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {review.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.date}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {renderStars(review.rating)}
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {review.reviewText}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {filteredReviews.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Отзывы не найдены. Попробуйте изменить параметры поиска.
            </Typography>
          </Box>
        )}

        {/* Пагинация */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={handlePageChange}
              color="primary"
              size="large"
              siblingCount={1}
              boundaryCount={1}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}
