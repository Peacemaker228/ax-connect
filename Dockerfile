# Базовый образ Node.js
FROM node:20

# Устанавливаем Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы проекта в контейнер
COPY . .

# Устанавливаем зависимости с помощью Bun
#RUN bun install --no-peer-deps
RUN bun install

# Строим приложение Next.js
RUN bun next build

# Экспонируем порт (порт 3000 по умолчанию для Next.js)
EXPOSE 3000

# Команда для запуска приложения
CMD ["bun", "next", "start"]
