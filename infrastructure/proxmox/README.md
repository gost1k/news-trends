# Proxmox — Инфраструктура виртуальных машин

## Обзор VM

```
Proxmox Host
├── vm-dev (ID: 100)         — Разработка
├── vm-infra (ID: 101)       — Docker-сервисы
├── vm-k3s (ID: 102)         — Kubernetes (Фаза 5)
└── [отдельная машина]       — Ollama (GPU)
```

## vm-dev (Ubuntu 24.04 LTS)

**Ресурсы:** 4 CPU, 4GB RAM, 50GB SSD

**Назначение:** разработка, запуск кода, тесты.

```bash
# Установка
sudo apt update && sudo apt upgrade -y

# Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Python 3.12
sudo apt install -y python3.12 python3.12-venv python3-pip

# Docker CLI (подключается к vm-infra)
sudo apt install -y docker.io
# Настрой Docker context для удалённого доступа:
# docker context create vm-infra --docker "host=ssh://user@vm-infra-ip"
# docker context use vm-infra

# Git
sudo apt install -y git
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

## vm-infra (Ubuntu 24.04 LTS)

**Ресурсы:** 4 CPU, 8-16GB RAM, 100GB SSD

**Назначение:** Docker Compose со всеми сервисами.

```bash
# Docker + Docker Compose
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER

# Запуск сервисов
cd /opt/newsmap/infrastructure/docker
docker compose -f docker-compose.dev.yml up -d

# Проверка
docker compose ps
curl http://localhost:9200  # Elasticsearch
curl http://localhost:5601  # Kibana
```

**Порты:**
| Порт | Сервис |
|------|--------|
| 5432 | PostgreSQL |
| 6379 | Redis |
| 9200 | Elasticsearch |
| 5601 | Kibana |
| 9090 | Prometheus |
| 3000 | Grafana |

## vm-k3s (Ubuntu 24.04 LTS) — Фаза 5

**Ресурсы:** 4 CPU, 8GB RAM, 50GB SSD

**Назначение:** Kubernetes для изучения оркестрации.

```bash
# Установка K3s (один node = master + worker)
curl -sfL https://get.k3s.io | sh -

# Проверка
sudo kubectl get nodes
sudo kubectl get pods -A

# Экспорт kubeconfig для vm-dev
sudo cat /etc/rancher/k3s/k3s.yaml
# Скопируй на vm-dev в ~/.kube/config, замени server IP
```

## Ollama Machine

**Ресурсы:** GPU (NVIDIA рекомендуется), 16GB+ RAM

```bash
# Установка Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Скачать модели
ollama pull llama3
ollama pull nomic-embed-text

# Запуск с доступом из сети
OLLAMA_HOST=0.0.0.0 ollama serve

# Проверка
curl http://localhost:11434/api/tags
```

## Сеть между VM

Все VM в Proxmox находятся в одной bridge-сети (vmbr0).
Общаются по внутренним IP (например, 192.168.1.x).

```
vm-dev (192.168.1.100) ──→ vm-infra (192.168.1.101):5432,6379,9200
vm-dev (192.168.1.100) ──→ ollama-host (192.168.1.200):11434
vm-dev (192.168.1.100) ──→ vm-k3s (192.168.1.102):6443
```

Настрой `/etc/hosts` на vm-dev для удобства:
```
192.168.1.101  vm-infra
192.168.1.102  vm-k3s
192.168.1.200  ollama-host
```
