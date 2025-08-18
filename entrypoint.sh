#!/bin/sh

# Smart Frontend Entrypoint
# Автоматически определяет режим работы из .env файла

set -e

echo "🚀 Starting Frontend Container..."

# Загружаем переменные из .env файла
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "Environment: ${NODE_ENV:-development}"
echo "Mode: ${FRONTEND_MODE:-auto}"

# Функция для установки зависимостей
install_dependencies() {
    if [ ! -d "node_modules" ] || [ ! -f "node_modules/.installed" ]; then
        echo "📦 Installing dependencies..."
        npm ci --legacy-peer-deps || npm install --legacy-peer-deps
        touch node_modules/.installed
        echo "✅ Dependencies installed"
    else
        echo "✅ Dependencies already installed"
    fi
}

# Функция для сборки проекта
build_project() {
    echo "🔨 Building project..."
    npm run build
    echo "✅ Build completed"
}

# Функция для запуска статического сервера
serve_static() {
    echo "🌐 Starting static server..."
    
    # Устанавливаем serve если его нет
    if ! command -v serve > /dev/null 2>&1; then
        echo "📦 Installing serve..."
        npm install -g serve
    fi
    
    # Запускаем статический сервер
    serve -s dist -l 5173 -n
}

# Функция для запуска dev сервера
start_dev() {
    echo "🔥 Starting development server..."
    npm run dev -- --host 0.0.0.0
}

# Устанавливаем зависимости
install_dependencies

# Определяем режим работы
MODE=${FRONTEND_MODE:-auto}

# Автоматическое определение режима по NODE_ENV
if [ "$MODE" = "auto" ]; then
    if [ "$NODE_ENV" = "production" ]; then
        MODE="build"
    else
        MODE="dev"
    fi
fi

echo "🎯 Selected mode: $MODE"

# Выполняем действие в зависимости от режима
case "$MODE" in
    "dev"|"development")
        start_dev
        ;;
    "build"|"production")
        build_project
        serve_static
        ;;
    "serve")
        # Если есть билд, запускаем статический сервер
        if [ -d "dist" ]; then
            serve_static
        else
            echo "📦 No build found, building first..."
            build_project
            serve_static
        fi
        ;;
    *)
        echo "❌ Unknown mode: $MODE"
        echo "Available modes: dev, build, serve, auto"
        exit 1
        ;;
esac
