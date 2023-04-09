# syntax=docker/dockerfile:1

FROM nikolaik/python-nodejs:python3.10-nodejs18
WORKDIR /
COPY . .

ENV NODE_ENV production
ENV PORT 8080
ENV INFURA_KEY 85b362ba337e4c348faedff589c9026a

# RUN git clone --branch slr-deps https://github.com/crytic/slither.git
# RUN pip install slither-analyzer
# RUN solc-select install 0.8.16

RUN git clone --branch slr-deps https://github.com/maxcoto/slither.git
RUN cd slither && python3 ./setup.py install

RUN pip install web3 solc-select

RUN for i in {1..$(($(solc-select install | wc -l)))}; do solc-select install $(solc-select install | tail -1); done

RUN npm install
CMD ["node", "server.js"]
EXPOSE 8080

