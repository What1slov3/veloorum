# Veloorum

[![logoV1.png](https://i.postimg.cc/5y6nrqww/logoV1.png)](https://postimg.cc/1V1GnF7t)

❗️❗️ **Обновления будут выходить по мере возможности** ❗️❗️  

**31.01.2023 // На данный момент ведется "беспорядочная разработка" по причине рефакторинга всего кода и глобального пересмотра структуры проекта, поэтому коммиты содержат обновления типа "исправил, что увидел", а само приложение находится в нерабочей форме. Так уж получилось, потому что поддержка проекта не планировалась и решение было приянто спонтанно**

Исходный код сервера [Veloorum REST|WS](https://github.com/What1slov3/veloorum-rest 'Veloorum REST|WS')

---

## Стек

ES6/Typescript/React.js/Redux Toolkit/Axios/Socket.io

### Актуальные возможности

- Авторизация и регистрация в приложении
- Персонализация аккаунта
- Визуальные настройки приложения
- Создание сервера
- Редактирование сервера (иконка, название)
- Создание текстовых чатов внутри сервера
- Редактирование чатов
- Отправка сообщений с группировкой по времени
- Отправка и поиск эмодзи с поддержкой шорт-кодов
- Удаление и редактирование сообщений
- Форматирование текста сообщений ~~, \*\*, \*
- Отправка изображений (с поддержкой drag'n'drop)
- Создание приглашений в канал
  ...и многое другое

### Будущее проекта

Планируется долгосрочная поддержка, до состояния полноценного способа повседневного общения.  

### Установка и запуск

```console
  username:~$ yarn install | yarn start
```

_**Создать .env**_

```env
  REACT_APP_API_URL=https://example.com
  REACT_APP_WEBSOCKET_URL=ws://example.com
```

Вручную изменить пути к серверу в статике **_public/static_**  
Отдачу статики необходимо настроить по вашему усмотрению:  
- :domain:/invite/:inviteId -> invite.html
- :domain:/login -> login.html
- :domain:/app -> index.html

_Необходимо обязательное соединение с сервером [Veloorum REST|WS](https://github.com/What1slov3/veloorum-rest 'Veloorum REST|WS')_

---

### Связь с автором

what1slov333@gmail.com  
Telegram: what1slov333
