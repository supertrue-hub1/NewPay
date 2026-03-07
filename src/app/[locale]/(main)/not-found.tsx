import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="text-center">
        <h1 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-400 via-pink-500 to-red-500">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Страница не найдена</h2>
        <p className="text-slate-400 mb-8 text-lg">Вы попали в неизведанную территорию</p>
        
        <div className="text-6xl md:text-8xl mb-8 animate-bounce">
          👨‍🚀
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-colors"
          >
            <Home className="w-5 h-5" />
            На главную
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 border border-slate-600 rounded-xl font-semibold hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}
