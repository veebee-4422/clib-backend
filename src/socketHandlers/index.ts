import { Socket } from "socket.io";
import { playerJoined } from "./messageHandlers";

export default function registerGameHandlers(socket: Socket) {
    socket.on("PLAYER_JOINED", playerJoined);
}