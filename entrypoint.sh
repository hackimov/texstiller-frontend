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
    # Диагностическая информация
    echo "📋 Diagnostic information:"
    echo "Working directory: $(pwd)"
    echo "User: $(whoami)"
    echo "Node modules exists: $(test -d node_modules && echo 'yes' || echo 'no')"
    echo "Vite exists: $(test -f node_modules/.bin/vite && echo 'yes' || echo 'no')"
    echo "Installed marker: $(test -f node_modules/.installed && echo 'yes' || echo 'no')"
    
    # Проверяем наличие ключевых зависимостей
    if [ ! -f "node_modules/.bin/vite" ] || [ ! -f "node_modules/.installed" ]; then
        echo "📦 Installing dependencies..."
        
        # Определяем режим установки
        if [ "$NODE_ENV" = "production" ]; then
            echo "Installing production + dev dependencies for build..."
            # Для продакшена нужны dev зависимости для сборки
            npm install --legacy-peer-deps
        else
            echo "Installing all dependencies..."
            npm install --legacy-peer-deps
        fi
        
        # Проверяем успешность установки
        if [ -f "node_modules/.bin/vite" ]; then
            touch node_modules/.installed
            echo "✅ Dependencies installed successfully"
        else
            echo "❌ Dependencies installation failed - vite not found"
            echo "📋 Checking node_modules structure:"
            ls -la node_modules/.bin/ 2>/dev/null || echo "No .bin directory found"
            echo "📋 Checking package.json scripts:"
            cat package.json | grep -A 5 '"scripts"' || echo "No scripts found"
            echo "⏳ Waiting 30 seconds before retry..."
            sleep 30
            exit 1
        fi
    else
        echo "✅ Dependencies already installed"
    fi
}

# Функция для сборки проекта
build_project() {
    echo "🔨 Building project..."
    
    # Проверяем наличие package.json и scripts
    if [ ! -f "package.json" ]; then
        echo "❌ package.json not found"
        exit 1
    fi
    
    # Отладочная информация
    echo "📋 Checking build environment..."
    echo "Working directory: $(pwd)"
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "Package.json exists: $(test -f package.json && echo 'yes' || echo 'no')"
    echo "Node modules exists: $(test -d node_modules && echo 'yes' || echo 'no')"
    
    # Проверяем наличие vite
    if [ -f "node_modules/.bin/vite" ]; then
        echo "✅ Vite found at node_modules/.bin/vite"
    else
        echo "❌ Vite not found in node_modules/.bin/"
        echo "📋 Listing node_modules/.bin/:"
        ls -la node_modules/.bin/ | head -10
    fi
    
    # Используем npm run build (который использует локально установленный vite)
    echo "🚀 Running npm run build..."
    if npm run build; then
        echo "✅ Build completed"
    else
        echo "❌ Build failed"
        exit 1
    fi
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
    
    # Проверяем наличие dev скрипта
    if npm run dev -- --host 0.0.0.0; then
        echo "✅ Dev server started"
    else
        echo "❌ Failed to start dev server"
        exit 1
    fi
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
