FROM golang:1.17

WORKDIR /app

RUN apt-get update && apt-get install -y git

RUN apt-get update && \
  apt-get install -y pkg-config nodejs npm git libvips-dev clang

ENV GO111MODULE=off

RUN git clone https://github.com/tinygo-org/tinygo.git /go/src/github.com/tinygo-org/tinygo \
    && cd /go/src/github.com/tinygo-org/tinygo \
    && git checkout dev \
    && git submodule update --init
    # && make gen-device \
    # && make wasi-libc \
    # && make

RUN go get -u github.com/h2non/bimg

COPY package*.json ./
RUN npm install

CMD ["bash"]
