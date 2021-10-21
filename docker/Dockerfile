FROM node:16

RUN apt-get update \   
 && apt-get install libpam0g-dev -y \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*
