# Build stage

FROM golang:1.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o server ./cmd/main.go


# Runtime stage

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/server .

COPY --from=builder /app/migrations ./migrations

EXPOSE 8080

CMD ["./server"]