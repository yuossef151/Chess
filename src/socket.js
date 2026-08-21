import { io } from "socket.io-client";

// هذا السطر يربط الرياكت بسيرفر الـ Node.js الذي يعمل على المنفذ 3001
const socket = io("https://chess-backend-production-0e62.up.railway.app");
export default socket;
