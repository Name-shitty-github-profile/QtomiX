let endpoints = {
    "POST" : {},
    "GET": {},
    "DELETE": {}
};

function getfiles(folderPath) {
    try {
        return fs.readdirSync(folderPath)
        .filter(file => path.extname(file) === '.js')
        .map(file => path.join(folderPath, path.parse(file).name));
    } catch (e) {
        return [];
    }
}
for (const file of getfiles(`${process.cwd()}/webapi/endpoints`)) {
    const content = require(file);
    if (!content.name) {
        const endpoint_name = file.replace(`${process.cwd()}/webapi/endpoints`, "");
    } else {
        const endpoint_name = content.name;
    }
    endpoints[content.mode].set(endpoint_name, {run: content.run, json: content.json, Header: content.Header});
}

module.exports = function(req, res, method) {
    const data = endpoints[method][req.params.endpoint];
    if (!data) {
        res.status(404).send("Not found");
        return;
    }
    const json_data = JSON.parse(req.body);
    for (const dat of data.json) {
        const da = json_data[dat];
        if (!da) {
            res.status(400).send(`Missing one argument ${dat}!`);
            return;
        }
        if ((typeof da) === data.json[dat]) {
            res.status(400).send(`Invalid argument type please use the right type!`);
            return;
        }
    }
    const header_data = JSON.parse(req.header);
    for (const dat of data.Header) {
        const da = header_data[dat];
        if (!da) {
            res.status(400).send(`Missing one argument in the header ${dat}!`);
            return;
        }
        if ((typeof da) === data.json[dat]) {
            res.status(400).send(`Invalid argument type in the header, please use the right type!`);
            return;
        }
    }
    data.run(req, res, json_data, header_data);
};