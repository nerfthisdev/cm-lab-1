# Этап сборки
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY go.mod go.sum ./
RUN go mod download

# Копируем исходный код
COPY cmd/app/main.go ./cmd/app/main.go
COPY internal/ ./internal/

# Копируем статические файлы и .env
COPY public/ ./public/

# Собираем приложение
RUN CGO_ENABLED=0 GOOS=linux go build -o /main ./cmd/app/main.go

# Финальный этап
FROM alpine:latest

WORKDIR /app

# Копируем бинарник и ассеты
COPY --from=builder /main .
COPY --from=builder /app/public/ ./public/


EXPOSE 5176
CMD ["sh", "-c", "STATIC_PATH=./public/ ./main"]