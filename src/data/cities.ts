export interface City {
  id: string
  name: string
  nameGenitive: string // родительный падеж (в Москве, в Санкт-Петербурге)
  nameDative: nameDative // дательный падеж (для Москвы, для Санкт-Петербурга)
  population: number
  slug: string
}

type nameDative = string

export const cities: City[] = [
  { id: '1', name: 'Москва', nameGenitive: 'в Москве', nameDative: 'для Москвы', population: 13000000, slug: 'moskva' },
  { id: '2', name: 'Санкт-Петербург', nameGenitive: 'в Санкт-Петербурге', nameDative: 'для Санкт-Петербурга', population: 5600000, slug: 'sankt-peterburg' },
  { id: '3', name: 'Новосибирск', nameGenitive: 'в Новосибирске', nameDative: 'для Новосибирска', population: 1600000, slug: 'novosibirsk' },
  { id: '4', name: 'Екатеринбург', nameGenitive: 'в Екатеринбурге', nameDative: 'для Екатеринбурга', population: 1500000, slug: 'ekaterinburg' },
  { id: '5', name: 'Казань', nameGenitive: 'в Казани', nameDative: 'для Казани', population: 1300000, slug: 'kazan' },
  { id: '6', name: 'Нижний Новгород', nameGenitive: 'в Нижнем Новгороде', nameDative: 'для Нижнего Новгорода', population: 1250000, slug: 'nizhny-novgorod' },
  { id: '7', name: 'Челябинск', nameGenitive: 'в Челябинске', nameDative: 'для Челябинска', population: 1200000, slug: 'chelyabinsk' },
  { id: '8', name: 'Самара', nameGenitive: 'в Самаре', nameDative: 'для Самары', population: 1150000, slug: 'samara' },
  { id: '9', name: 'Омск', nameGenitive: 'в Омске', nameDative: 'для Омска', population: 1100000, slug: 'omsk' },
  { id: '10', name: 'Ростов-на-Дону', nameGenitive: 'в Ростове-на-Дону', nameDative: 'для Ростова-на-Дону', population: 1100000, slug: 'rostov-na-donu' },
  { id: '11', name: 'Уфа', nameGenitive: 'в Уфе', nameDative: 'для Уфы', population: 1100000, slug: 'ufa' },
  { id: '12', name: 'Волгоград', nameGenitive: 'в Волгограде', nameDative: 'для Волгограда', population: 1000000, slug: 'volgograd' },
  { id: '13', name: 'Красноярск', nameGenitive: 'в Красноярске', nameDative: 'для Красноярска', population: 1000000, slug: 'krasnoyarsk' },
  { id: '14', name: 'Воронеж', nameGenitive: 'в Воронеже', nameDative: 'для Воронежа', population: 1000000, slug: 'voronezh' },
  { id: '15', name: 'Пермь', nameGenitive: 'в Перми', nameDative: 'для Перми', population: 1000000, slug: 'perm' },
  { id: '16', name: 'Краснодар', nameGenitive: 'в Краснодаре', nameDative: 'для Краснодара', population: 950000, slug: 'krasnodar' },
  { id: '17', name: 'Тюмень', nameGenitive: 'в Тюмени', nameDative: 'для Тюмени', population: 900000, slug: 'tyumen' },
  { id: '18', name: 'Саратов', nameGenitive: 'в Саратове', nameDative: 'для Саратова', population: 830000, slug: 'saratov' },
  { id: '19', name: 'Тольятти', nameGenitive: 'в Тольятти', nameDative: 'для Тольятти', population: 700000, slug: 'tolyatti' },
  { id: '20', name: 'Ижевск', nameGenitive: 'в Ижевске', nameDative: 'для Ижевска', population: 650000, slug: 'izhevsk' },
]

export const getCityBySlug = (slug: string): City | undefined => {
  return cities.find(city => city.slug === slug)
}

export const getTopCities = (count: number = 10): City[] => {
  return [...cities].sort((a, b) => b.population - a.population).slice(0, count)
}
