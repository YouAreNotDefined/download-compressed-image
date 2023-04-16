FROM golang:latest

WORKDIR /app

RUN apt-get update && \
  apt-get install -y pkg-config nodejs npm git libvips-dev

COPY go.mod ./

RUN go install github.com/uudashr/gopkgs/v2/cmd/gopkgs@latest
RUN go install github.com/ramya-rao-a/go-outline@latest
RUN go install github.com/nsf/gocode@latest
RUN go install github.com/acroca/go-symbols@latest
RUN go install github.com/fatih/gomodifytags@latest
RUN go install github.com/josharian/impl@latest
RUN go install github.com/haya14busa/goplay/cmd/goplay@latest
RUN go install github.com/go-delve/delve/cmd/dlv@latest
RUN go install golang.org/x/lint/golint@latest
RUN go install golang.org/x/tools/gopls@latest

RUN go get -u github.com/h2non/bimg@latest
RUN go mod tidy

COPY package*.json ./
RUN npm install

CMD ["bash"]
