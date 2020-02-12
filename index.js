const express = require('express');

const blogRouter = require('./routers/blogRouter');

const server = express();

server.use(express.json());

server.use('/api/posts', blogRouter);

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda Blog API</h>
    <p>Welcome to the Lambda Blog API</p>
  `);
})

const port = 5000;
server.listen(port, () => {
    console.log(`\n*** Server running on http://localhost:${port} ***\n`);
});