const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { exec } = require("child_process");
const fs = require('fs');
const crypto = require('crypto');
const port = process.env.PORT || 8080;

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

        const rawdata = fs.readFileSync(`${uuid}/${uuid}`);
        const storage = JSON.parse(rawdata);
        
        exec(`rm -rf ${uuid}`);

        res.send(JSON.stringify({ data: storage }));
    });
});

server.listen(port, () => {
    console.log('running on port ' + port);
});
