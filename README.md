# Структура

Приложение разбито на три части:

- web: mini-app
- native: приложение для android
- shared: весь независимый от платформы код, т.е.: компоненты, стили, истории storybook

# Стек

Общий стэк состоит из:

- React
- Storybook
- MUI
- Tailwind

Для упрощения работы:
Tailwind IntelliSense ([IntelliJ IDEa](https://plugins.jetbrains.com/plugin/15260-tailwind-intellisense), [VS Code](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss))
[Codeium AI](https://codeium.com)

# Запуск

`npm run storybook`: storybook, из корня

Запуск модулей производистя из их соответствующих папок

## Web

`npm run dev`
`npm run preview`
`npm run build`: сборка

## Native

`npm start`
`npx expo start`
`npx expo run:android`: сборка, требует android SDK и JDK

# Архитектура

Архитектура web части основана на [FSD](https://feature-sliced.design/)
