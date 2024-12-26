# .devcontainer/Dockerfile

FROM mcr.microsoft.com/vscode/devcontainers/python:3.10

# Node.js (apt-get)
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs iputils-ping

# Python
RUN pip install --upgrade pip && \
    pip install django djangorestframework django-cors-headers djangorestframework-simplejwt

# フロントエンド用の npm install
#   必要に応じて書く (必須ではない)
COPY ./frontend/package.json ./frontend/package-lock.json /tmp/frontend/
RUN cd /tmp/frontend && npm install