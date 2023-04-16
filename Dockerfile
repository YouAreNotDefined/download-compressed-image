FROM golang:1.17

WORKDIR /app

RUN apt-get update && \
  apt-get install -y pkg-config nodejs npm git libvips-dev clang

RUN go get -u github.com/h2non/bimg

COPY package*.json ./
RUN npm install

CMD ["bash"]
