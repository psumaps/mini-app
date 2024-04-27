# Структура

Приложение разбито на три части:

- web: mini-app
- native: приложение для android
- shared: весь независимый от платформы код, т.е.: компоненты, стили, истории storybook

# Стек

Общий стэк состоит из:

- [React](https://react.dev)
- [Storybook](https://storybook.js.org)
- [MUI](https://mui.com)
- [Tailwind](https://tailwindcss.com)

Для упрощения работы:
Tailwind IntelliSense ([IntelliJ IDEa](https://plugins.jetbrains.com/plugin/15260-tailwind-intellisense), [VS Code](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss))
[Codeium AI](https://codeium.com)

# Запуск

`npm run storybook`: storybook, из корня

Запуск модулей производистя из их соответствующих папок

## Web

`npm run dev + npm run tailwind:watch`: запускать в разных терминалах
`npm run preview`
`npm run build`: сборка

## Native

`npm start`
`npx expo start`
`npx expo run:android`: сборка, требует android SDK и JDK

# Архитектура

Архитектура web части основана на [FSD](https://feature-sliced.design/)

# Рабочий процесс

Общий код находится в папке shared. Компоненты помещаются в папку shared/components, для каждого компонента создается история (`shared/stories/<componentName>.stories.tsx`). Истории помогают лучше и проще тестировать и понимать компоненты. Для всех значимых вариантов компонента должен быть создан отдельный шаблон. Пример:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import Input from "../components/controls/input";

const meta: Meta<typeof Input> = {
  title: "Controls/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Имя",
    name: "firstName",
    type: "text",
  },
};

export const Email: Story = {
  args: {
    label: "Почта",
    name: "email",
    type: "email",
  },
};

export const Password: Story = {
  args: {
    label: "Пароль",
    name: "password",
    type: "password",
  },
};
```

Код, специфичный для конкретного модуля, помещается в папку модуля. Специфичный код - это такой, который использует библиотеки, доступные только на одной из платформ.

# Оформление иззменений

Правила оформления изменений кода в основном репозитории

## Ветки

Ветки должны иметь название, соответствующее своему содержанию, и префикс:
| Название ветки | Значение ветки | Пример ветки |
| --------------- | ------------------------------------------- | --------------- |
| **fix-\*** | Исправляет баг нового функционала | _fix-auth_ |
| **feat-\*** | Добавляет новую возможность | _feat-auth_ |
| **refactor-\*** | Рефакторинг существующего кода | _refactor-auth_ |

## Коммиты

Имя коммита должно иметь префикс в зависимости от внесенных изменений, а также указывать на измененную часть кода
| Название ветки | Значение ветки | Пример ветки |
| --------------- | ------------------------------------------- | -------------------------------------- |
| **fix:\*** | Исправляет баг нового функционала | _fix: submit button in map screen_ |
| **feat:\*** | Добавляет новую возможность | _feat: dark theme_ |
| **refactor:\*** | Рефакторинг существующего кода | _refactor: home screen_ |
| **chore:\*** | Общие действия по поддержке проекта | _chore: update tailwind version_ |
| **docs:\*** | Документация (например, истории storybook) | _docs: add story for Button_ |
| **deps:\*** | Настройка зависимостей проекта | _deps: add Tailwind_ |
| **any:\*** | Все, что не подходит к предыдущему | _any: prettify_ |

## PR

Pull Request (запрос на слияние) должен быть назван по правилам именования коммитов. В описании следует включить всю значимую информацию по внесенному изменению:

- что было сделано (если может быть непонятно из названия)
- в каком модуле
- какую issue закрывает PR
- скриншоты, если актуально
