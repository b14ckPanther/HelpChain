import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { DemoStore } from "./server/demo-store.mjs";
import { registerSocketHandlers } from "./server/socket-handlers.mjs";
import { getLocalIpAddresses } from "./server/network-info.mjs";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Attach Socket.IO to the http server
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Initialize in-memory demo state store
  const store = new DemoStore();
  
  // Register handlers
  registerSocketHandlers(io, store);

  // Start listening
  server.listen(port, hostname, (err) => {
    if (err) {
      console.error(`[Server Error] Failed to start server:`, err);
      process.exit(1);
    }

    const localIps = getLocalIpAddresses();

    console.log("\n========================================================");
    console.log("             HELPCHAIN PROTOTYPE DEMO SERVER            ");
    console.log("========================================================\n");
    console.log(`Local Access:      http://localhost:${port}`);
    
    if (localIps.length > 0) {
      console.log("Network Access (for iPhone / Wi-Fi devices):");
      for (const ip of localIps) {
        console.log(`  http://${ip}:${port}`);
      }
      if (dev) {
        console.log(
          `\nDev LAN origins allowed: ${localIps.join(", ")} (restart after Wi-Fi change)`
        );
      }
    } else {
      console.log("Network Access:    No LAN IP detected. Connect to Wi-Fi.");
    }
    
    console.log("\nRoutes:");
    console.log(`  Requester Device: http://localhost:${port}/requester`);
    console.log(`  Volunteer Device: http://localhost:${port}/volunteer`);
    
    if (localIps.length > 0) {
      console.log("\nWi-Fi Direct Links:");
      console.log(`  Requester iPhone: http://${localIps[0]}:${port}/requester`);
      console.log(`  Volunteer Device: http://${localIps[0]}:${port}/volunteer`);
    }
    console.log("\n========================================================\n");
  });
});
