# shri18-home-work
## ШРИ2018/2 - ДЗ «Node.js»

### Запуск
```
npm i
node server.js
```

### Описание сервера
Сервер поддерживает всю функциональность из базового задания
- POST запрос на `/api/status` возвращает время, прошедшее с начала запуска сервера в формате hh:mm:ss
- POST запрос на `/api/events` возвращает все события
- POST запрос на остальные адреса выдает ошибку 404 
- POST запрос с параметрами `/api/events/?type=critical` возвращает отфильтрованные события по заданному типу. Возможен запрос несколько типов через символ `:` (`type=critical:info`)
- POST запрос с некорректным типом `/api/events/?type=warning` выбрасывает ошибку 400
- POST запрос с остальными параметрами (не `type`) возвращает все события

#### Дополнительные задания
- Запросы через POST
- Сервер прикручен к шаблонизатору из первого задания. Для проверки необходимо скачать репозиторий с [этой ветки](https://github.com/nik-el/shri18-home-work-1/tree/HW-1-adaptvie) и запустить 
```
npm i
npm start
```
- Данные к шаблонизатору будут приходить от текущего сервера