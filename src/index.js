import express from "express";
import morgan from "morgan";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { config as dotenvConfig } from "dotenv";

import routes from "./routes.js";
import cronScheduler from "./crons.js";
import { corsFix } from "./middleware/corsFix.js";
import registerGameHandlers from "./socketHandlers.js";

dotenvConfig();

const port = process.env.PORT || 4000;
const nodeEnv = process.env.NODE_ENV;

const app = express();
const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: nodeEnv === "PRODUCTION" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
	}
})


io.on("connection", registerGameHandlers);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(corsFix);

app.use(routes);

server.listen(port || 3000, async () => {
    console.log(`Server listening at port ${port}`);
    await cronScheduler();
});