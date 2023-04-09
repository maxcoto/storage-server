const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { exec } = require("child_process");
const fs = require('fs');
const crypto = require('crypto');
const { networks } = require("./constants");
const Web3 = require('web3');


const port = process.env.PORT || 8080;
const infura_key = process.env.INFURA_KEY || '85b362ba337e4c348faedff589c9026a';


function compare( a, b ) {
    if(a.slot < b.slot)     return -1;
    if(a.slot > b.slot)     return 1;
    if(a.offset < b.offset) return -1;
    if(a.offset > b.offset) return 1;
    return 0;
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.get('/', (req, res) => {
    let params = req.query;

    const { network, target } = params;

    if(!network || !target) {
        res.status(404);
        res.send(JSON.stringify({ error: "missing params" }));
        return;
    }

    const networkData = networks[network];

    if(!networkData) {
        res.status(404);
        res.send(JSON.stringify({ error: "wrong network" }));
        return;
    }

    const { subdomain, suffix } = networkData;
    const infura = `https://${subdomain}.infura.io/v3/${infura_key}`;
    const web3 = new Web3(infura);
    const isValid = web3.utils.isAddress(target);

     if(!isValid) {
        res.status(404);
        res.send(JSON.stringify({ error: "invalid address" }));
        return;
    }

    const uuid = crypto.randomUUID();
    const command = `mkdir ${uuid} && cd ${uuid} && slither-read-storage ${suffix}${target} --rpc-url ${infura} --value --json ${uuid}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            exec(`rm -rf ${uuid}`);
            res.status(404);
            res.send(JSON.stringify({ error: stderr }));
            return;
        }

        const data = fs.readFileSync(`${uuid}/${uuid}`);
        const json = JSON.parse(data);
        const array = Object.entries(json).map((variable, _i) => variable[1]);
        const storage = array.sort(compare);

        exec(`rm -rf ${uuid}`);

        res.send(JSON.stringify({ data: storage }));
    });
});

server.listen(port, () => {
    console.log('running on port ' + port);
});
