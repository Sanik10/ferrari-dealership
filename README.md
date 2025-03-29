# Ferrari Dealership Web Application

Веб-приложение для автомобильного дилера Ferrari, разработанное с использованием React, Node.js и PostgreSQL.

## Содержание
- [Установка](#установка)
- [Запуск проекта](#запуск-проекта)
- [Структура проекта](#структура-проекта)
- [Git Workflow](#git-workflow)
- [Правила оформления коммитов](#правила-оформления-коммитов)
- [Функциональность](#функциональность)

## Установка

### Предварительные требования
- Node.js (v14+)
- npm или yarn
- PostgreSQL

### Клонирование репозитория
```bash
git clone git@github.com:Sanik10/ferrari-dealership.git
cd ferrari-dealership
```

### Установка зависимостей
```bash
# Установка серверных зависимостей
cd backend
npm install

# Установка клиентских зависимостей
cd ../frontend/react-dealership
npm install
```

## Запуск проекта

### Настройка базы данных
файл `.env` в папке `backend` со следующим содержимым:
```
PORT=5001
DB_HOST=localhost
DB_USER=твой пользователь
DB_PASSWORD=твой пароль от БД
DB_NAME=dealership_db
JWT_SECRET=your_jwt_secret - у меня cAtwa1kkEy
```

### Запуск сервера
```bash
cd backend
npm run dev
```

### Запуск клиента
```bash
cd frontend/react-dealership
npm run dev
```

## Структура проекта
```
ferrari-dealership/
├── backend/              # Серверная часть Node.js
│   ├── controllers/      # Обработчики запросов
│   ├── middleware/       # Промежуточные обработчики
│   ├── models/           # Модели данных
│   ├── routes/           # Маршруты API
│   ├── services/         # Бизнес-логика
│   └── uploads/          # Загруженные файлы
├── frontend/             # Клиентская часть React
│   └── react-dealership/ # React-приложение
```

## Git Workflow

Наш проект использует модель Git Flow для организации рабочего процесса.

### Основные ветки

- **main** - стабильная версия продукта, готовая к релизу
- **develop** - основная ветка для разработки, содержит последние изменения

### Дополнительные ветки

- **feature/** - для разработки новых функций
- **bugfix/** - для исправления ошибок
- **hotfix/** - для срочных исправлений в production
- **release/** - подготовка к релизу

### Рабочий процесс

1. **Начало работы над новой функцией**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/название-функции
   ```

2. **Внесение изменений**:
   ```bash
   git add .
   git commit -m "feat: добавлена функция X"
   ```

3. **Обновление ветки разработки**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/название-функции
   git rebase develop
   ```

4. **Отправка изменений**:
   ```bash
   git push origin feature/название-функции
   ```

5. **Создание Pull Request**:
   - Создайте Pull Request на GitHub из вашей ветки в `develop`
   - После ревью и одобрения, выполните слияние

6. **Релиз**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   # Внесите финальные изменения, обновите версию
   git push origin release/v1.0.0
   # После тестирования:
   git checkout main
   git merge release/v1.0.0
   git tag -a v1.0.0 -m "Версия 1.0.0"
   git push origin main --tags
   ```

## Правила оформления коммитов

Для коммитов мы используем соглашение [Conventional Commits](https://www.conventionalcommits.org/).

Формат:
```
<тип>(<область>): <описание>

[тело]

[футер]
```

Типы коммитов:
- **feat**: новая функциональность
- **fix**: исправление ошибки
- **docs**: изменения в документации
- **style**: форматирование, отступы, точки с запятой и т.д.
- **refactor**: рефакторинг кода без изменения функциональности
- **test**: добавление или исправление тестов
- **chore**: изменения в сборке, инструментах, зависимостях

Примеры:
```
feat(admin): добавлена страница управления автомобилями
fix(auth): исправлена ошибка авторизации
docs(readme): обновлена документация по установке
```

## Функциональность

- Просмотр каталога автомобилей
- Детальная информация о каждом автомобиле
- Административная панель для управления контентом
- Система записи на тест-драйв
- Авторизация и регистрация пользователей
