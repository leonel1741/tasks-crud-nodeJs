// Importamos los modulos que usaremos http, path, fs
const http = require('http');
const path = require('path');
const fs = require('fs/promises');

const PORT = 8000;

const app = http.createServer(async (request, response) => {
    const requestMethod = request.method;
    const requestUrl = request.url;
    const jsonPath = path.resolve('./data.json');
    const jsonFile = await fs.readFile(jsonPath, 'utf8');
    const arr = JSON.parse(jsonFile);

    if (requestUrl === "/apiv1/tasks") {
        if (requestMethod === "GET") {
            response.setHeader('Content-Type', 'application/json');
            response.writeHead('200');
            response.write(jsonFile);
        }
        if (requestMethod === "POST") {
            request.on("data", (data) => {
                const newTask = JSON.parse(data);
                arr.push(newTask);
                const newData = JSON.stringify(arr);
                fs.writeFile(jsonPath, newData)
                    .catch((error) => console.log(error));
                response.writeHead('201');
            });
        }
        if (requestMethod === "PUT") {
            request.on("data", (data) => {
                const putTask = JSON.parse(data);
                // const {id, status} = JSON.parse(data);
                const taskIndex = arr.findIndex((task) => task.id === putTask.id);
                arr[taskIndex].status = putTask.status;
                console.log(arr[taskIndex].status);
                const newData = JSON.stringify(arr);
                response.writeHead('201');
                fs.writeFile(jsonPath, newData)
                    .catch((error) => console.log(error));
            })
        }

        if (requestMethod === "DELETE") {
            request.on("data", (data) => {
                const deleteTask = JSON.parse(data);
                const newData = JSON.stringify(arr.filter((task) => task.id !== deleteTask.id));
                console.log(deleteTask);
                fs.writeFile(jsonPath, newData)
                    .catch((error) => console.log(error));
                response.writeHead('200');
            })
        }

    } else {
        response.writeHead("503")
    }
    response.end();
})

app.listen(PORT);