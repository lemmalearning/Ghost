FROM node:6.11.2-alpine
COPY . /opt/ghost

ADD https://storage.googleapis.com/lm-assets/ghost-built.tar.gz /opt/ghost/
RUN cd /opt/ghost/; tar -xvzf ghost-built.tar.gz; rm ghost-built.tar.gz
