# Tarnished Atlas: приложение за iPhone

Тази папка е цялото приложение. Качи я на хостинг с HTTPS, отвори адреса в Safari и избери „Сподели“ → „Добави към началния екран“ (Add to Home Screen).

## Вариант 1: GitHub Pages (безплатно, с HTTPS)
1. Създай ново публично repo, например `tarnished-atlas`.
2. Качи съдържанието на тази папка в корена на repo-то (не самата папка, а файловете в нея).
3. Settings → Pages → Source: "Deploy from a branch", Branch: `main` / `(root)` → Save.
4. След 1–2 минути отвори `https://<твоето-име>.github.io/tarnished-atlas/` в Safari на iPhone.
5. „Сподели“ → „Добави към началния екран“.

## Вариант 2: твой сървър с nginx
Сложи файловете в папка, например `/var/www/atlas`, и добави:

```nginx
server {
    listen 443 ssl;
    server_name atlas.example.com;
    root /var/www/atlas;
    location / { try_files $uri $uri/ /index.html; }
    location = /sw.js { add_header Cache-Control "no-cache"; }
    location /tiles/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
    types { application/manifest+json webmanifest; image/webp webp; }
}
```

Офлайн режимът (service worker) работи само през HTTPS. През обикновен `http://` в локалната мрежа приложението пак се отваря от началния екран, но без офлайн.

## Офлайн
При първото отваряне се свалят програмата, данните и картата в общ план (около 5 MB). Детайлните части на картата се запазват, докато ги разглеждаш, и после се отварят и без интернет.

## Прогрес
Отметките се пазят на телефона. За да пренесеш прогреса от версията в claude.ai: там Филтри → „Копирай прогреса“, а тук Филтри → постави → „Зареди“.

## Авторство
Карта и данни: datamine от elden-ring-compass (EthanShoeDev) чрез jw-ofs/elden-ring-map. Иконки: game-icons.net (CC BY 3.0). Leaflet (BSD-2). Elden Ring © FromSoftware / Bandai Namco. Неофициален личен проект.
