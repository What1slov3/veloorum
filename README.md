# Veloorum

[![logoV1.png](https://i.postimg.cc/5y6nrqww/logoV1.png)](https://postimg.cc/1V1GnF7t)

❗️❗️ **Приложение находится на раннем этапе разработки** ❗️❗️  
❗️❗️ **Обновления будут выходить по мере возможности** ❗️❗️

Исходный код сервера [Veloorum REST|WS](https://github.com/What1slov3/veloorum-rest 'Veloorum REST|WS')

Данная информация предназначена для ознакомления, но не использования сторонними людьми  

##### CURRENT STAGE

Будет проведен полный рефакторинг кода, оптимизация и стандартизация текущих процессов, внедрение полноценной модерации каналов, пользовательских ролей, расширение возможностей форматирования сообщений  
Проверяйте dev ветку

---

## Стек

ES6/Typescript/React.js/Redux Toolkit/Axios/Socket.io

### Актуальные возможности

- Авторизация и регистрация в приложении
- Персонализация аккаунта (никнейм, аватар, смена пароля)
- Визуальные настройки приложения
- Создание Veloorum сервера
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
На данный момент приоритетом являются добавление нового функционала и создание "ядра" приложения, с редкими выпусками исправления мелких багов (с учетом недопускания критических), оптимизацией и рефакторингом.  
В скором времени приложение будет поставлено на хост и станет доступно всем. Когда это произойдет - в README появится ссылка.

### Установка и запуск

```console
  username:~$ yarn install | yarn start
```

_**Создать env/env.js**_

```js
  export const PROCESS_ENV = {
    apiURL: '' // URL сервера бекенда
    localhost: '' // URL сервера бекенда на dev сборке
    websocketURL: '', // URL websocket сервера
    localWebsocketURL: '', // URL websocket сервера на dev сборке
    env: 'dev' | 'prod' // текущая среда
  }
```
**Важно:** не забыть сменить PROCCESS_ENV.env перед сборкой

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
