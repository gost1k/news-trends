# Инфраструктура

## Схема окружения

```
┌─────────────────────────────────────────────────────────┐
│                    Proxmox Host                         │
│                                                         │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐ │
│  │   vm-dev     │  │   vm-infra    │  │   vm-k3s     │ │
│  │              │  │               │  │  (Фаза 5)    │ │
│  │  Node.js     │  │  Docker       │  │              │ │
│  │  Python      │  │  Compose:     │  │  K3s cluster │ │
│  │  Docker CLI  │──│  - PostgreSQL │  │              │ │
│  │  kubectl     │  │  - Redis      │  │              │ │
│  │  VS Code     │  │  - ES+Kibana  │  │              │ │
│  │              │  │  - Prometheus  │  │              │ │
│  │              │  │  - Grafana    │  │              │ │
│  │              │  │  - Nginx      │  │              │ │
│  └──────────────┘  └───────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
         │
         │ HTTP :11434
         ▼
┌──────────────────┐
│  Ollama Machine  │
│  (GPU)           │
└──────────────────┘
```

## Docker Compose — порядок запуска

```bash
# Перейти в папку с конфигами
cd infrastructure/docker

# Скопировать переменные окружения
cp .env.example .env
# Отредактируй .env: IP Ollama-машины, пароли

# Запуск только инфры (лёгкий вариант)
docker compose -f docker-compose.services.yml up -d

# Или полный набор (с мониторингом)
docker compose -f docker-compose.dev.yml up -d

# Проверка
docker compose ps
docker compose logs postgres
docker compose logs elasticsearch
```

## Проверка сервисов

| Сервис | URL | Что проверить |
|--------|-----|---------------|
| PostgreSQL | `psql -h localhost -U newsmap -d newsmap` | `SELECT PostGIS_version();` |
| Redis | `redis-cli ping` | Ответ: PONG |
| Elasticsearch | `curl http://localhost:9200` | JSON с версией |
| Kibana | `http://localhost:5601` | Web UI |
| Prometheus | `http://localhost:9090` | Targets |
| Grafana | `http://localhost:3000` | Login: admin/admin |

## pgvector — установка в Docker

Образ `postgis/postgis:16-3.4` уже содержит PostGIS.
pgvector устанавливается через `init-db.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Проверка:

```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

## Kubernetes (K3s) — Фаза 5

### Установка K3s

```bash
# На vm-k3s
curl -sfL https://get.k3s.io | sh -

# Получить kubeconfig
sudo cat /etc/rancher/k3s/k3s.yaml
```

### Деплой приложения

```bash
# На vm-dev (kubectl настроен на vm-k3s)
kubectl apply -f infrastructure/k8s/namespaces/
kubectl apply -f infrastructure/k8s/configmaps/
kubectl apply -f infrastructure/k8s/secrets/
kubectl apply -f infrastructure/k8s/deployments/
kubectl apply -f infrastructure/k8s/services/
kubectl apply -f infrastructure/k8s/ingress/

# Проверка
kubectl get all -n newsmap
kubectl logs -n newsmap deployment/newsmap-api
```

### Docker → K8s: что меняется

| Docker Compose | Kubernetes |
|---------------|-----------|
| `services:` | Deployment + Service |
| `volumes:` | PersistentVolumeClaim |
| `environment:` | ConfigMap + Secret |
| `ports:` | Service (ClusterIP/NodePort) |
| `depends_on:` | InitContainers / readinessProbe |
| `docker-compose.yml` | Набор YAML-манифестов |

## Мониторинг

### Prometheus
Собирает метрики с приложений и инфраструктуры.
Конфиг: `infrastructure/monitoring/prometheus/prometheus.yml`

### Grafana
Визуализация метрик. Дашборды для:
- API: RPS, latency, error rate
- PostgreSQL: connections, query time
- Redis: memory, operations/sec
- Elasticsearch: indexing rate, search latency

## Полезные команды

```bash
# Docker
docker compose logs -f postgres    # Логи PostgreSQL
docker compose exec postgres psql -U newsmap  # SQL консоль
docker compose exec redis redis-cli  # Redis CLI

# Kubernetes
kubectl get pods -n newsmap        # Статус подов
kubectl describe pod <name> -n newsmap  # Детали пода
kubectl port-forward svc/newsmap-api 3001:3001 -n newsmap  # Проброс порта
kubectl rollout restart deployment/newsmap-api -n newsmap  # Рестарт
```
