# Базовый образ Node.js
FROM node:20

# Устанавливаем Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы проекта в контейнер
COPY . .

# Передача переменных окружения для сборки
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL
ARG DATABASE_URL
ARG UPLOADTHING_TOKEN
ARG LIVEKIT_API_KEY
ARG LIVEKIT_API_SECRET
ARG NEXT_PUBLIC_LIVEKIT_URL

# Устанавливаем переменные окружения для процесса сборки
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
ENV DATABASE_URL=$DATABASE_URL
ENV UPLOADTHING_TOKEN=$UPLOADTHING_TOKEN
ENV LIVEKIT_API_KEY=$LIVEKIT_API_KEY
ENV LIVEKIT_API_SECRET=$LIVEKIT_API_SECRET
ENV NEXT_PUBLIC_LIVEKIT_URL=$NEXT_PUBLIC_LIVEKIT_URL

# Устанавливаем зависимости с помощью Bun
RUN bun install

# Строим приложение Next.js
RUN bun next build

# Экспонируем порт (порт 3000 по умолчанию для Next.js)
EXPOSE 3000

# Команда для запуска приложения
CMD ["bun", "next", "start"]
