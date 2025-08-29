import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import cors from "cors";
import { errors } from 'celebrate';
import "./database/database.js";

const app = express();

const PORT = process.env.PORT || 8000

app.use(express.static('files'))
app.use(cors());

app.use(bodyParser.json({ limit: "10000mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10000mb" }));

app.all("*", function (req, res, next) {
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,Authorization ,Accept"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Expose-Headers", "Authorization");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type, Authorization"
    );
    next();
});


const server = createServer(app);
// const io = new Server(server, {
//     // allowEIO3: true, // false by default
//     // path: '/socket.io',
//     // transports: ['websocket'],
//     cors: {
//         // origin: "https://phenomenal-gecko-05a012.netlify.app/",
//         origin: "*",
//         methods: ["GET", "POST"],
//         secure: true,
//     }
// })

async function setupRoutes() {
    console.log("setting up routes");
    const routes = await import("./routers/index.js");
    routes.default.setup(app);
}

await setupRoutes();
app.use(errors());

server.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`);
});