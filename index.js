const server = require('./server');

server.listen(server.port, (err) => {

    if (err) {
        return console.error({ error: err.message });
    }

    console.log(`Server is running on port ${server.port}`);

});