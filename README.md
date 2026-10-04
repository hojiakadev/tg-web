<div align="center">

<img src="public/logo.png" alt="TG Web" width="96" height="96" />

# Telegram Web

**A Telegram Web–style messenger in the browser, powered by [Green-API](https://green-api.com/telegram/).**

[![Live demo](https://img.shields.io/badge/Live%20demo-tg--web--project.netlify.app-3390ec?style=for-the-badge&logo=netlify&logoColor=white)](https://tg-web-project.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-hojiakadev%2Ftg--web-181717?style=for-the-badge&logo=github)](https://github.com/hojiakadev/tg-web)

🌐 **Live:** https://tg-web-project.netlify.app/ &nbsp;·&nbsp; 💻 **Code:** https://github.com/hojiakadev/tg-web

**[🇬🇧 English](#-english)** &nbsp;|&nbsp; **[🇷🇺 Русский](#-русский)** &nbsp;|&nbsp; **[🇺🇿 O‘zbekcha](#-ozbekcha)**

</div>

---

## 🇬🇧 English

### What is it?

TG Web is a website that looks and works like **Telegram Web**. You sign in with your Telegram account and can read chats, write messages, reply, send photos and files — right in the browser, on a computer or a phone.

Behind the scenes it talks to Telegram through **Green-API** (a service that connects an account to an app). You don't need to know anything about it to use the site.

### 👤 For everyone — how to use

1. **Open** 👉 https://tg-web-project.netlify.app/
2. **Sign in** — the QR code is shown first:
   - On your phone open **Telegram → Settings → Devices → Link Desktop Device** and scan the code.
   - Prefer a phone number? Click **“Log in by phone number”**, choose your country, type the number, then enter the code Telegram sends you.
   - If your account has a **2-step password**, you'll be asked for it — that's normal.
3. **Chat:**
   - Click a chat on the left to open it. New messages appear by themselves.
   - Type and press **Enter** to send (**Shift + Enter** = new line).
   - **Double-click** (or right-click → *Reply*) a message to reply to it.
   - 📎 sends a photo, video or file · 🙂 adds an emoji.
   - ✏️ (bottom-left) → **New Chat** — start a chat by **phone number**, **chat ID** or **@username**.
4. **Settings** (☰ menu → Settings): your profile, **Dark / Light mode**, keyboard shortcuts and **Log Out**.

> 📱 Works on phones too: the chat list and the open chat take turns filling the screen; use ← to go back.

<details>
<summary>⌨️ Keyboard shortcuts</summary>

| Keys | Action |
|---|---|
| `Ctrl/⌘ + K` | Search chats (`Enter` opens the first result) |
| `Alt + ↑ / ↓` | Previous / next chat |
| `Ctrl/⌘ + 0` | Saved Messages |
| `Ctrl/⌘ + ↑ / ↓` | Choose a message to reply to |
| `Ctrl/⌘ + O` | Attach a file |
| `Esc` | Cancel reply → close the chat → go back |
| any letter | Start typing a message |

</details>

<details>
<summary>❓ Something doesn't work?</summary>

- **Stuck on the login page** — the QR code expires quickly and refreshes every 5 s — scan the newest one, and make sure the phone has internet.
- **No new messages arrive live** — they still refresh every 15–60 s. For instant updates the owner must enable notifications in Green-API (see the developer section).
- **“Log Out”** ends the Telegram session of this app — you'll need to sign in again.

</details>

### 🛠 For developers

**Stack:** React 19 · TypeScript · Vite 8 · Mantine 9 · TanStack Router & Query · react-hook-form + zod · Axios · SCSS modules · oxlint.

#### Quick start

```bash
git clone https://github.com/hojiakadev/tg-web.git
cd tg-web
cp .env.example .env      # then fill in your Green-API instance data
npm install               # or: pnpm install
npm run dev               # http://localhost:5173
```

Requires **Node.js 20.19+ or 22.12+** and a **Green-API Telegram instance** ([console.green-api.com](https://console.green-api.com/)).

#### Environment variables (`.env`)

| Variable | Example | What it is |
|---|---|---|
| `VITE_BASE_API_URL` | `https://4100.api.green-api.com` | Instance `apiUrl` |
| `VITE_INSTANCE` | `waInstance4100XXXXXX` | Instance id (with or without the `waInstance` prefix) |
| `VITE_QR_TOKEN` | `f81f…` | Instance `apiTokenInstance` |
| `VITE_QR_API_URL` | `https://api.green-api.com` | Host used to fetch the login QR code |
| `VITE_QR_CODE_URL` | `https://qr.green-api.com` | Green-API QR page (reference) |
| `VITE_MEDIA_API_URL` | `https://4100.media.green-api.com` | *Optional.* File upload host — derived from `VITE_BASE_API_URL` when empty |

> ⚠️ `VITE_*` values are bundled into the browser code — anyone can read them. Use a dedicated instance for a public deployment.

#### Green-API instance settings

Turn on in the console (or with `SetSettings`): **incoming messages**, **outgoing messages (phone & API)** and **outgoing message statuses**. Without them the app still works, but updates arrive by polling instead of instantly.

#### Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build to `dist/` + type-check (`tsc -b`) |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | Lint with oxlint |
| `npx tsc -b` | Type-check only |

#### Project structure

```
src/
├── common/        # http client, storage, Green-API helpers, rate limiter, shared hooks
├── components/    # reusable UI (Avatar, Panel, SearchBar, Fab, IconButton, NewChatModal…)
├── containers/    # react-hook-form bound fields
├── helpers/       # pure utils: dates, phones, avatars, DOM
├── layouts/       # Auth, Main (two columns), Session (live notifications)
├── modules/       # feature modules: auth, chats, messages, contacts, profile, notifications
│   └── <module>/  #   api · types · mappers · constants · hooks/ · forms/ · index
├── pages/         # Auth/Login, Chats, Settings (+ page-only components/)
├── routes/        # TanStack file routes; `_authenticated` guards signed-in pages
└── styles/        # global tokens (--tg-*), Mantine theme
```

Conventions are described in [`AGENTS/AGENT.md`](AGENTS/AGENT.md) — read it before contributing.

#### How it works

- **Sign-in:** QR code (`qr`) → or `startAuthorization` → `sendAuthorizationCode` → `sendAuthorizationPassword` (2FA). Routes check `getStateInstance` and redirect to `/login` when signed out.
- **Chats:** `getChats` + newest message per chat from `lastIncomingMessages` / `lastOutgoingMessages` + names from `getContacts`; missing titles come from `getContactInfo` / `getGroupData`.
- **Live updates:** one `receiveNotification` long-poll for the whole app patches the TanStack Query cache (messages, previews, unread counters, ✓/✓✓ statuses).
- **Rate limits:** avatar and info requests are queued so Green-API per-second limits are not exceeded.

#### Deploy (Netlify)

Build command `npm run build`, publish directory `dist`, add the `VITE_*` variables in *Site settings → Environment variables*. `public/_redirects` sends every route to `index.html`, so links like `/settings` survive a page refresh.

---

## 🇷🇺 Русский

### Что это?

TG Web — сайт, который выглядит и работает как **Telegram Web**. Вы входите в свой аккаунт Telegram и можете читать чаты, писать сообщения, отвечать, отправлять фото и файлы — прямо в браузере, на компьютере или телефоне.

«Под капотом» сайт общается с Telegram через **Green-API** (сервис, который подключает аккаунт к приложению). Чтобы пользоваться сайтом, знать о нём ничего не нужно.

### 👤 Для всех — как пользоваться

1. **Откройте** 👉 https://tg-web-project.netlify.app/
2. **Войдите** — сначала показывается QR-код:
   - На телефоне откройте **Telegram → Настройки → Устройства → Подключить устройство** и отсканируйте код.
   - Удобнее по номеру? Нажмите **«Log in by phone number»**, выберите страну, введите номер, затем код, который пришлёт Telegram.
   - Если у аккаунта есть **облачный пароль (2FA)**, сайт попросит его — это нормально.
3. **Общение:**
   - Нажмите на чат слева, чтобы открыть его. Новые сообщения появляются сами.
   - Напишите текст и нажмите **Enter** (**Shift + Enter** — новая строка).
   - **Двойной клик** (или правый клик → *Reply*) по сообщению — ответить на него.
   - 📎 — отправить фото, видео или файл · 🙂 — эмодзи.
   - ✏️ (внизу слева) → **New Chat** — начать чат по **номеру телефона**, **ID чата** или **@username**.
4. **Настройки** (меню ☰ → Settings): профиль, **тёмная / светлая тема**, горячие клавиши и **выход (Log Out)**.

> 📱 Работает и на телефоне: список чатов и открытый чат показываются по очереди; кнопка ← возвращает назад.

<details>
<summary>⌨️ Горячие клавиши</summary>

| Клавиши | Действие |
|---|---|
| `Ctrl/⌘ + K` | Поиск чатов (`Enter` открывает первый результат) |
| `Alt + ↑ / ↓` | Предыдущий / следующий чат |
| `Ctrl/⌘ + 0` | Избранное (Saved Messages) |
| `Ctrl/⌘ + ↑ / ↓` | Выбрать сообщение для ответа |
| `Ctrl/⌘ + O` | Прикрепить файл |
| `Esc` | Отменить ответ → закрыть чат → назад |
| любая буква | Начать писать сообщение |

</details>

<details>
<summary>❓ Что-то не работает?</summary>

- **Не получается войти** — QR-код быстро устаревает и обновляется каждые 5 с — сканируйте самый свежий и проверьте интернет на телефоне.
- **Новые сообщения приходят с задержкой** — список всё равно обновляется каждые 15–60 с. Для мгновенных обновлений владелец должен включить уведомления в Green-API (см. раздел для разработчиков).
- **«Log Out»** завершает сеанс Telegram в этом приложении — потребуется войти заново.

</details>

### 🛠 Для разработчиков

**Стек:** React 19 · TypeScript · Vite 8 · Mantine 9 · TanStack Router и Query · react-hook-form + zod · Axios · SCSS-модули · oxlint.

#### Быстрый старт

```bash
git clone https://github.com/hojiakadev/tg-web.git
cd tg-web
cp .env.example .env      # заполните данными своего инстанса Green-API
npm install               # или: pnpm install
npm run dev               # http://localhost:5173
```

Нужны **Node.js 20.19+ или 22.12+** и **инстанс Green-API для Telegram** ([console.green-api.com](https://console.green-api.com/)).

#### Переменные окружения (`.env`)

| Переменная | Пример | Назначение |
|---|---|---|
| `VITE_BASE_API_URL` | `https://4100.api.green-api.com` | `apiUrl` инстанса |
| `VITE_INSTANCE` | `waInstance4100XXXXXX` | ID инстанса (с префиксом `waInstance` или без) |
| `VITE_QR_TOKEN` | `f81f…` | `apiTokenInstance` инстанса |
| `VITE_QR_API_URL` | `https://api.green-api.com` | Хост для получения QR-кода входа |
| `VITE_QR_CODE_URL` | `https://qr.green-api.com` | Страница QR Green-API (справочно) |
| `VITE_MEDIA_API_URL` | `https://4100.media.green-api.com` | *Необязательно.* Хост загрузки файлов — по умолчанию вычисляется из `VITE_BASE_API_URL` |

> ⚠️ Значения `VITE_*` попадают в код браузера — их может прочитать любой. Для публичного сайта используйте отдельный инстанс.

#### Настройки инстанса Green-API

Включите в консоли (или через `SetSettings`): **входящие сообщения**, **исходящие сообщения (с телефона и API)** и **статусы исходящих сообщений**. Без них приложение работает, но обновления приходят опросом, а не мгновенно.

#### Скрипты

| Команда | Что делает |
|---|---|
| `npm run dev` | Dev-сервер с горячей перезагрузкой |
| `npm run build` | Сборка в `dist/` + проверка типов (`tsc -b`) |
| `npm run preview` | Локально запустить собранный `dist/` |
| `npm run lint` | Линтинг oxlint |
| `npx tsc -b` | Только проверка типов |

#### Структура проекта

```
src/
├── common/        # http-клиент, storage, хелперы Green-API, rate limiter, общие хуки
├── components/    # переиспользуемый UI (Avatar, Panel, SearchBar, Fab, IconButton, NewChatModal…)
├── containers/    # поля, связанные с react-hook-form
├── helpers/       # чистые утилиты: даты, телефоны, аватары, DOM
├── layouts/       # Auth, Main (две колонки), Session (живые уведомления)
├── modules/       # модули: auth, chats, messages, contacts, profile, notifications
│   └── <module>/  #   api · types · mappers · constants · hooks/ · forms/ · index
├── pages/         # Auth/Login, Chats, Settings (+ свои components/)
├── routes/        # файловые роуты TanStack; `_authenticated` защищает страницы
└── styles/        # глобальные токены (--tg-*), тема Mantine
```

Правила кода — в [`AGENTS/AGENT.md`](AGENTS/AGENT.md); прочитайте перед тем, как вносить изменения.

#### Как это устроено

- **Вход:** QR-код (`qr`) → или `startAuthorization` → `sendAuthorizationCode` → `sendAuthorizationPassword` (2FA). Роуты проверяют `getStateInstance` и перенаправляют на `/login`, если вход не выполнен.
- **Чаты:** `getChats` + последнее сообщение каждого чата из `lastIncomingMessages` / `lastOutgoingMessages` + имена из `getContacts`; недостающие названия — из `getContactInfo` / `getGroupData`.
- **Живые обновления:** один long-poll `receiveNotification` на всё приложение обновляет кэш TanStack Query (сообщения, превью, счётчики непрочитанных, статусы ✓/✓✓).
- **Лимиты:** запросы аватаров и профилей идут через очередь, чтобы не превышать лимиты Green-API в секунду.

#### Деплой (Netlify)

Команда сборки `npm run build`, папка публикации `dist`, переменные `VITE_*` — в *Site settings → Environment variables*. Файл `public/_redirects` отдаёт `index.html` на любой путь, поэтому ссылки вроде `/settings` работают и после обновления страницы.

---

## 🇺🇿 O‘zbekcha

### Bu nima?

TG Web — **Telegram Web** kabi ko‘rinadigan va ishlaydigan sayt. Telegram akkauntingiz bilan kirasiz va chatlarni o‘qish, xabar yozish, javob berish, rasm va fayl yuborish mumkin — to‘g‘ridan-to‘g‘ri brauzerda, kompyuter yoki telefonda.

Sayt Telegram bilan **Green-API** (akkauntni ilovaga ulaydigan xizmat) orqali ishlaydi. Saytdan foydalanish uchun bu haqda hech narsa bilish shart emas.

### 👤 Hamma uchun — qanday foydalaniladi

1. **Oching** 👉 https://tg-web-project.netlify.app/
2. **Kiring** — avval QR-kod ko‘rsatiladi:
   - Telefoningizda **Telegram → Sozlamalar → Qurilmalar → Qurilmani ulash** ni oching va kodni skanerlang.
   - Raqam orqali qulayroqmi? **“Log in by phone number”** ni bosing, davlatni tanlang, raqamni yozing, so‘ng Telegram yuborgan kodni kiriting.
   - Akkauntingizda **ikki bosqichli parol (2FA)** bo‘lsa, sayt uni so‘raydi — bu odatiy holat.
3. **Yozishish:**
   - Chapdagi chatni bosib oching. Yangi xabarlar o‘zi paydo bo‘ladi.
   - Matn yozib **Enter** ni bosing (**Shift + Enter** — yangi qator).
   - Xabarga **ikki marta bosing** (yoki o‘ng tugma → *Reply*) — unga javob berish.
   - 📎 — rasm, video yoki fayl yuborish · 🙂 — emoji.
   - ✏️ (pastda chapda) → **New Chat** — **telefon raqami**, **chat ID** yoki **@username** orqali chat boshlash.
4. **Sozlamalar** (☰ menyu → Settings): profil, **tungi / kunduzgi rejim**, tezkor tugmalar va **chiqish (Log Out)**.

> 📱 Telefonda ham ishlaydi: chatlar ro‘yxati va ochilgan chat navbat bilan ko‘rinadi; ← tugmasi orqaga qaytaradi.

<details>
<summary>⌨️ Tezkor tugmalar</summary>

| Tugmalar | Amal |
|---|---|
| `Ctrl/⌘ + K` | Chatlarni qidirish (`Enter` birinchi natijani ochadi) |
| `Alt + ↑ / ↓` | Oldingi / keyingi chat |
| `Ctrl/⌘ + 0` | Saqlangan xabarlar (Saved Messages) |
| `Ctrl/⌘ + ↑ / ↓` | Javob uchun xabar tanlash |
| `Ctrl/⌘ + O` | Fayl biriktirish |
| `Esc` | Javobni bekor qilish → chatni yopish → orqaga |
| istalgan harf | Xabar yozishni boshlash |

</details>

<details>
<summary>❓ Nimadir ishlamayaptimi?</summary>

- **Kira olmayapman** — QR-kod tez eskiradi va har 5 soniyada yangilanadi — eng yangisini skanerlang va telefonda internet borligini tekshiring.
- **Yangi xabarlar kechikib keladi** — ro‘yxat baribir har 15–60 soniyada yangilanadi. Darhol kelishi uchun egasi Green-API’da bildirishnomalarni yoqishi kerak (dasturchilar bo‘limiga qarang).
- **“Log Out”** shu ilovadagi Telegram seansini tugatadi — qaytadan kirish kerak bo‘ladi.

</details>

### 🛠 Dasturchilar uchun

**Texnologiyalar:** React 19 · TypeScript · Vite 8 · Mantine 9 · TanStack Router va Query · react-hook-form + zod · Axios · SCSS modullar · oxlint.

#### Tez boshlash

```bash
git clone https://github.com/hojiakadev/tg-web.git
cd tg-web
cp .env.example .env      # Green-API instansiyangiz ma’lumotlarini kiriting
npm install               # yoki: pnpm install
npm run dev               # http://localhost:5173
```

Kerak: **Node.js 20.19+ yoki 22.12+** va **Telegram uchun Green-API instansiyasi** ([console.green-api.com](https://console.green-api.com/)).

#### Muhit o‘zgaruvchilari (`.env`)

| O‘zgaruvchi | Misol | Vazifasi |
|---|---|---|
| `VITE_BASE_API_URL` | `https://4100.api.green-api.com` | Instansiya `apiUrl` |
| `VITE_INSTANCE` | `waInstance4100XXXXXX` | Instansiya ID (`waInstance` prefiksi bilan yoki usiz) |
| `VITE_QR_TOKEN` | `f81f…` | Instansiya `apiTokenInstance` |
| `VITE_QR_API_URL` | `https://api.green-api.com` | Kirish QR-kodini olish manzili |
| `VITE_QR_CODE_URL` | `https://qr.green-api.com` | Green-API QR sahifasi (ma’lumot uchun) |
| `VITE_MEDIA_API_URL` | `https://4100.media.green-api.com` | *Ixtiyoriy.* Fayl yuklash manzili — bo‘sh bo‘lsa `VITE_BASE_API_URL` dan hisoblanadi |

> ⚠️ `VITE_*` qiymatlari brauzer kodiga qo‘shiladi — ularni istalgan kishi o‘qiy oladi. Ommaviy sayt uchun alohida instansiya ishlating.

#### Green-API instansiya sozlamalari

Konsolda (yoki `SetSettings` orqali) yoqing: **kiruvchi xabarlar**, **chiquvchi xabarlar (telefon va API)** va **chiquvchi xabar statuslari**. Ularsiz ham ilova ishlaydi, lekin yangilanishlar darhol emas, so‘rov orqali keladi.

#### Buyruqlar

| Buyruq | Vazifasi |
|---|---|
| `npm run dev` | Avtoyangilanadigan dev-server |
| `npm run build` | `dist/` ga yig‘ish + tiplarni tekshirish (`tsc -b`) |
| `npm run preview` | Yig‘ilgan `dist/` ni lokal ishga tushirish |
| `npm run lint` | oxlint bilan tekshirish |
| `npx tsc -b` | Faqat tiplarni tekshirish |

#### Loyiha tuzilishi

```
src/
├── common/        # http-klient, storage, Green-API yordamchilari, rate limiter, umumiy hooklar
├── components/    # qayta ishlatiladigan UI (Avatar, Panel, SearchBar, Fab, IconButton, NewChatModal…)
├── containers/    # react-hook-form bilan bog‘langan maydonlar
├── helpers/       # sof yordamchilar: sana, telefon, avatar, DOM
├── layouts/       # Auth, Main (ikki ustun), Session (jonli bildirishnomalar)
├── modules/       # modullar: auth, chats, messages, contacts, profile, notifications
│   └── <module>/  #   api · types · mappers · constants · hooks/ · forms/ · index
├── pages/         # Auth/Login, Chats, Settings (+ o‘z components/ papkasi)
├── routes/        # TanStack fayl-routelari; `_authenticated` sahifalarni himoya qiladi
└── styles/        # global tokenlar (--tg-*), Mantine mavzusi
```

Kod qoidalari [`AGENTS/AGENT.md`](AGENTS/AGENT.md) da — o‘zgartirishdan oldin o‘qib chiqing.

#### Qanday ishlaydi

- **Kirish:** QR-kod (`qr`) → yoki `startAuthorization` → `sendAuthorizationCode` → `sendAuthorizationPassword` (2FA). Routelar `getStateInstance` ni tekshiradi va kirilmagan bo‘lsa `/login` ga yo‘naltiradi.
- **Chatlar:** `getChats` + har bir chatning oxirgi xabari (`lastIncomingMessages` / `lastOutgoingMessages`) + `getContacts` dagi ismlar; yetishmagan nomlar `getContactInfo` / `getGroupData` dan olinadi.
- **Jonli yangilanish:** butun ilova uchun bitta `receiveNotification` long-poll TanStack Query keshini yangilaydi (xabarlar, preview, o‘qilmaganlar soni, ✓/✓✓ statuslar).
- **Limitlar:** avatar va profil so‘rovlari navbat orqali yuboriladi, Green-API ning soniyalik limitlari oshmaydi.

#### Deploy (Netlify)

Build buyrug‘i `npm run build`, nashr papkasi `dist`, `VITE_*` o‘zgaruvchilarni *Site settings → Environment variables* ga qo‘shing. `public/_redirects` har qanday yo‘lni `index.html` ga yo‘naltiradi, shuning uchun `/settings` kabi havolalar sahifa yangilanganda ham ishlaydi.

---

<div align="center">

Made with ❤️ by [@hojiakadev](https://github.com/hojiakadev) · [Live demo](https://tg-web-project.netlify.app/) · [Source](https://github.com/hojiakadev/tg-web)

</div>
