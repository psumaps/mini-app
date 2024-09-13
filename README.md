<p align="center">
  <a href="https://psu-maps.tilda.ws/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="shared/src/assets/icon.svg">
      <img src="shared/src/assets/icon.svg" alt="PSUMaps" width="120" />
    </picture>
  </a>
</p>
<p align="center">Репозиторий содержит код интерфейса приложения «PSUMaps – интерактивный университет в кармане»</p>
<br/>
<p align="center">
  <a href="https://github.com/psumaps/mini-app/blob/main/LICENSE.txt">
    <img src="https://img.shields.io/github/license/psumaps/mini-app.svg" alt="License" />
  </a>
  <a href="https://t.me/psumaps">
    <img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white&longCache=true&style=flat" />
  </a>
  <a href="https://github.com/psumaps/mini-app/graphs/contributors">
    <img src="https://img.shields.io/github/all-contributors/psumaps/mini-app" alt="Contributors"/>
  </a>
</p>

<p align="center">
    Проект разрабатывается при поддержке
</p>
<p align="center">
    <a href="https://vk.com/molcentre_psu">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="shared/src/assets/ypc-icon.svg">
          <img src="shared/src/assets/ypc-icon.svg" alt="Центр молодёжной политики ПГНИУ" width="120" />
        </picture>
    </a>
</p>

## Содержание

- [Структура](#Структура)
- 📒 [Стек](#Стек)
- 🚀 [Запуск](#Запуск)
    - [Web - Mini App](#Web)
    - [Native - Mobile app](#Native)
- [Архитектура](#Архитектура)
- [Рабочий процесс](#Рабочий-процесс)
- [Оформление изменений](#Оформление-изменений)
    - [Ветки](#Ветки)
    - [Коммиты](#Коммиты)
    - [PR](#PR)
- 👨‍💻 [Contributors](#Contributors)


# Структура

Приложение разбито на три части:

- web: mini-app
- native: приложение для android
- shared: весь независимый от платформы код, т.е.: компоненты, стили, истории storybook

# Стек

Общий стэк состоит из:

- [React](https://react.dev)
- [Storybook](https://storybook.js.org)
- [Tailwind](https://tailwindcss.com)

Для упрощения работы:
- Tailwind IntelliSense ([IntelliJ IDEa](https://plugins.jetbrains.com/plugin/15260-tailwind-intellisense), [VS Code](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss))
- [Codeium AI](https://codeium.com)

# Запуск

Запускать из корня:
- `npm run storybook`: storybook
- `npm run web`: запустит параллельно dev и tailwind:watch скрипты web модуля
- `npm run native`: запустит start скрипт native модуля

## Web

Запускать из web/
- `npm run dev`
- `npm run preview`
- `npm run build`: сборка

## Native (n/a)

Запускать из native/
- `npm start`
- `npx expo start`
- `npx expo run:android`: сборка, требует android SDK и JDK

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

# Оформление изменений

Правила оформления изменений кода в основном репозитории

## Ветки

Ветки должны иметь название, соответствующее своему содержанию, и префикс:
| Название ветки  | Значение ветки                              | Пример ветки    |
| --------------- | ------------------------------------------- | --------------- |
| **fix-\***      | Исправление баг в функционале               | _fix-auth_      |
| **feat-\***     | Добавление новой возможности                | _feat-auth_     |
| **refactor-\*** | Рефакторинг существующего кода              | _refactor-auth_ |

## Коммиты

Имя коммита должно иметь префикс в зависимости от внесенных изменений, а также указывать на измененную часть кода
| Название ветки   | Значение ветки                              | Пример ветки                           |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| **fix: \***      | Исправление бага в функционале              | _fix: submit button in map screen_     |
| **feat: \***     | Добавление новой возможности                | _feat: dark theme_                     |
| **refactor: \*** | Рефакторинг существующего кода              | _refactor: home screen_                |
| **chore: \***    | Общие действия по поддержке проекта         | _chore: update tailwind version_       |
| **docs: \***     | Документация (например, истории storybook)  | _docs: add story for Button_           |
| **deps: \***     | Настройка зависимостей проекта              | _deps: add Tailwind_                   |
| **style: \***    | Нефункциональные изменения дизайна          | _style: change text color (calendar)_  |
| **tests: \***    | Добавление/обновление тестов                | _tests: cover Button_                  |
| **any: \***      | Все, что не подходит к предыдущему          | _any: prettify_                        |

## PR

Pull Request (запрос на слияние) должен быть назван по правилам именования коммитов. В описании следует включить всю значимую информацию по внесенному изменению:

- что было сделано (если может быть непонятно из названия)
- в каком модуле
- какую issue закрывает PR
- скриншоты, если актуально

# Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/esperor"><img src="https://avatars.githubusercontent.com/u/49198951?v=4?s=100" width="100px;" alt="esperor"/><br /><sub><b>esperor</b></sub></a><br /><a href="#projectManagement-esperor" title="Project Management">📆</a> <a href="#code-esperor" title="Code">💻</a> <a href="#platform-esperor" title="Packaging/porting to new platform">📦</a> <a href="#ideas-esperor" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://ijo42.ru"><img src="https://avatars.githubusercontent.com/u/53531892?v=4?s=100" width="100px;" alt="Aleksandr"/><br /><sub><b>Aleksandr</b></sub></a><br /><a href="#projectManagement-ijo42" title="Project Management">📆</a> <a href="#code-ijo42" title="Code">💻</a> <a href="#ideas-ijo42" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-ijo42" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#data-ijo42" title="Data">🔣</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Toderry"><img src="https://avatars.githubusercontent.com/u/106995468?v=4?s=100" width="100px;" alt="Toderry"/><br /><sub><b>Toderry</b></sub></a><br /><a href="#code-Toderry" title="Code">💻</a> <a href="#ideas-Toderry" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/li3pm"><img src="https://avatars.githubusercontent.com/u/118972242?v=4?s=100" width="100px;" alt="li3pm"/><br /><sub><b>li3pm</b></sub></a><br /><a href="#code-li3pm" title="Code">💻</a> <a href="#ideas-li3pm" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
