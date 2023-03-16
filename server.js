const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { exec } = require("child_process");
const fs = require('fs');
const crypto = require('crypto');
const port = process.env.PORT || 8080;


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

    console.log(params);

    if(!params?.network || !params?.target || !params?.infura || !params?.subdomain) {
        res.status(404);
        res.send(JSON.stringify({ error: "wrong params" }));
        return;
    }

    const uuid = crypto.randomUUID();
    const target = params.network === 'ethereum' ? params.target : params.network + ':' + params.target;
    const infura = `https://${params.subdomain}.infura.io/v3/${params.infura}`;

    const command = `mkdir ${uuid} && cd ${uuid} && slither-read-storage ${target} --rpc-url ${infura} --value --json ${uuid}`;

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
