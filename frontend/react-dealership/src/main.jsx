import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './styles/index.css'

// Инициализация библиотеки анимаций AOS
AOS.init({
  duration: 800,
  easing: 'ease-out',
  once: true,
  offset: 50,
})

// Предварительная загрузка шрифтов
const fontLinks = [
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Racing+Sans+One&display=swap',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap'
]

fontLinks.forEach(href => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
