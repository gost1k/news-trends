# Nginx Gateway — центральный reverse proxy сети

Замена HAProxy на OpenWRT. Отдельная VM (или LXC-контейнер) в Proxmox,
через которую проходит весь HTTP(S)-трафик внутри сети.

## Схема

```
Интернет / VPN
       │
       ▼
┌─────────────────────────────────────────────────┐
│              vm-gateway (Nginx)                  │
│         SSL termination + HTTP/2                 │
│                                                  │
│  newsmap.example.com  ──→ vm-dev:3001 / :5173   │
│  kibana.example.com   ──→ vm-infra:5601         │
│  grafana.example.com  ──→ vm-infra:3000         │
│  es.example.com       ──→ vm-infra:9200         │
│  prometheus.example.com → vm-infra:9090         │
│  ollama.example.com   ──→ ollama:11434          │
│  myproject.example.com → любой IP:PORT          │
└─────────────────────────────────────────────────┘
       │
       ▼
  Внутренняя сеть Proxmox (192.168.1.0/24)
```

## vm-gateway (Ubuntu 24.04 LTS)

**Ресурсы:** 1 CPU, 512MB-1GB RAM, 10GB disk. Nginx очень лёгкий.

Можно использовать LXC-контейнер вместо VM — ещё меньше ресурсов.

## Установка

```bash
# Nginx
sudo apt update
sudo apt install -y nginx certbot

# Для DNS-01 challenge (Cloudflare)
sudo apt install -y python3-certbot-dns-cloudflare

# Или для DNS-01 через другие провайдеры:
# sudo apt install -y python3-certbot-dns-route53      (AWS)
# sudo apt install -y python3-certbot-dns-digitalocean  (DO)
```

## SSL — wildcard сертификат Let's Encrypt

Wildcard сертификат (`*.example.com`) покрывает все субдомены одним сертификатом.
Для него нужен DNS-01 challenge (подтверждение через DNS-запись, не через HTTP).

### Вариант A: Cloudflare DNS (рекомендуется)

Если домен на Cloudflare (бесплатный тариф подходит):

```bash
# 1. Создать API-токен в Cloudflare:
#    https://dash.cloudflare.com/profile/api-tokens
#    Permissions: Zone → DNS → Edit

# 2. Сохранить токен
sudo mkdir -p /etc/letsencrypt
sudo tee /etc/letsencrypt/cloudflare.ini > /dev/null <<EOF
dns_cloudflare_api_token = YOUR_CLOUDFLARE_API_TOKEN
EOF
sudo chmod 600 /etc/letsencrypt/cloudflare.ini

# 3. Получить wildcard сертификат
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini \
  -d "*.example.com" \
  -d "example.com" \
  --agree-tos \
  -m your@email.com

# 4. Автопродление (certbot ставит cron/systemd timer автоматически)
sudo certbot renew --dry-run
```

### Вариант B: Самоподписанный (для быстрого старта без домена)

```bash
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 3650 \
  -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 \
  -keyout /etc/nginx/ssl/selfsigned.key \
  -out /etc/nginx/ssl/selfsigned.crt \
  -subj "/CN=*.home.local"
```

В `nginx.conf` заменить пути сертификатов на `/etc/nginx/ssl/selfsigned.*`.
Браузер будет ругаться — добавь сертификат в доверенные.

## Настройка Nginx

```bash
# Скопировать конфиги из проекта
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo mkdir -p /etc/nginx/conf.d
sudo cp sites/*.conf /etc/nginx/conf.d/

# Заменить example.com на свой домен
sudo sed -i 's/example.com/yourdomain.com/g' /etc/nginx/nginx.conf
sudo sed -i 's/example.com/yourdomain.com/g' /etc/nginx/conf.d/*.conf

# Заменить IP-адреса на реальные
sudo sed -i 's/192.168.1.100/REAL_VM_DEV_IP/g' /etc/nginx/nginx.conf
sudo sed -i 's/192.168.1.101/REAL_VM_INFRA_IP/g' /etc/nginx/nginx.conf
sudo sed -i 's/192.168.1.200/REAL_OLLAMA_IP/g' /etc/nginx/nginx.conf

# Проверить конфигурацию
sudo nginx -t

# Перезапустить
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## DNS — как субдомены попадают на gateway

### Вариант A: Домен с Cloudflare (для внешнего + VPN доступа)

В Cloudflare DNS добавить A-записи, указывающие на IP gateway:

```
*.example.com    → 192.168.1.99  (IP vm-gateway)
example.com      → 192.168.1.99
```

Если доступ только через VPN — поставить Proxy OFF (DNS only) в Cloudflare.

### Вариант B: Локальный DNS (dnsmasq на OpenWRT)

На OpenWRT роутере в dnsmasq (или /etc/hosts):

```
# /etc/dnsmasq.conf на OpenWRT
address=/example.com/192.168.1.99
```

Это направит ВСЕ *.example.com на vm-gateway. Просто и работает.

### Вариант C: /etc/hosts на каждом клиенте (самый простой)

```
192.168.1.99  newsmap.example.com kibana.example.com grafana.example.com
```

## Добавление нового сервиса

1. Добавь upstream в `nginx.conf`:
   ```
   upstream myservice {
       server 192.168.1.XXX:PORT;
   }
   ```

2. Скопируй `sites/_template.conf` → `sites/myservice.conf`, заполни

3. Перезапусти: `sudo nginx -t && sudo systemctl reload nginx`

4. Добавь DNS-запись (или /etc/hosts)

## Мониторинг Nginx

```bash
# Статус
sudo systemctl status nginx

# Логи в реальном времени
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Проверить SSL
curl -vI https://newsmap.example.com 2>&1 | grep -E 'SSL|subject|expire'

# Проверить HTTP/2
curl -vI --http2 https://newsmap.example.com 2>&1 | grep 'HTTP/2'
```
