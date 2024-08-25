import { Socket } from "socket.io";
import { playerJoined } from "./messageHandlers";

export default function registerGameHandlers(socket) {
    socket.on("PLAYER_JOINED", playerJoined);
}