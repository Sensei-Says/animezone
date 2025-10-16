# Деплой на GitHub Pages

## Автоматический деплой

1. Убедитесь, что у вас есть репозиторий на GitHub
2. Настройте GitHub Pages:
   - Перейдите в Settings → Pages
   - Source: GitHub Actions
3. Запушьте код в ветку `main`
4. GitHub Actions автоматически соберет и задеплоит проект

## Ручной деплой

1. Соберите проект:
```bash
npm run build
```

2. Загрузите содержимое папки `dist` в ветку `gh-pages` или используйте GitHub Actions

## Настройка

- **Base URL**: `/anime-watchlist/` (настроено в `vite.config.ts`)
- **SPA Support**: Настроено в `index.html` и `404.html`
- **Icon**: Создана SVG иконка в `public/assets/icon.svg`

## Файлы для GitHub Pages

- `.nojekyll` - отключает Jekyll обработку
- `404.html` - перенаправление для SPA
- `index.html` - основной файл с SPA поддержкой
- `.github/workflows/deploy.yml` - автоматический деплой

## Проверка

После деплоя сайт должен быть доступен по адресу:
`https://yourusername.github.io/anime-watchlist/`
