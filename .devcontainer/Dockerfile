# .devcontainer/Dockerfile

FROM mcr.microsoft.com/vscode/devcontainers/python:3.10

# Node.js (apt-get)
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs iputils-ping

# Python
RUN pip install --upgrade pip && \
    pip install django djangorestframework django-cors-headers
