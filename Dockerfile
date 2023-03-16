# syntax=docker/dockerfile:1

FROM nikolaik/python-nodejs:python3.10-nodejs18
WORKDIR /
COPY . .

ENV NODE_ENV production
ENV PORT 8080

#RUN git clone --branch slr-deps https://github.com/crytic/slither.git
RUN git clone --branch slr-deps https://github.com/maxcoto/slither.git
RUN cd slither && python3 ./setup.py install
# RUN pip install slither-analyzer
RUN pip install web3

RUN pip install solc-select


RUN for i in {1..$(($(solc-select install | wc -l)))}; do solc-select install $(solc-select install | tail -1); done

#RUN solc-select install 0.6.12

RUN npm install
CMD ["node", "server.js"]
EXPOSE 8080

