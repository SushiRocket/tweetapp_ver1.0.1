# .devcontainer/Dockerfile

# ベースイメージとして、VSCodeが提供しているPython 3.xのDev Containerイメージを使用
FROM mcr.microsoft.com/vscode/devcontainers/python:3.10

# Node.js (16系など)をインストールするための準備
# ※curlのインストール、Node.jsのセットアップを行い、npmでyarnをグローバルインストール
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get install -y iputils-ping
    && npm install -g yarn create-react-app
    && npm install web-vitals

# Python ライブラリ (Django, DRF, など) をあらかじめインストールしておく
# こうすることでコンテナを再度立ち上げ直しても再インストールの手間がかかりません
RUN pip install --upgrade pip \
    && pip install django djangorestframework django-cors-headers

# できるだけコンテナが軽くなるよう、不要キャッシュを削除
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
