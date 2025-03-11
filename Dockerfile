FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY cmd/app/main.go ./cmd/app/main.go
COPY internal/ ./internal/

COPY public/ ./public/

RUN CGO_ENABLED=0 GOOS=linux go build -o /main ./cmd/app/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /main .
COPY --from=builder /app/public/ ./public/


EXPOSE 5176
CMD ["sh", "-c", "STATIC_PATH=./public/ ./main"]