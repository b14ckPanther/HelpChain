import type { NextConfig } from "next";
import os from "os";

/** LAN IPv4 addresses so phones on the same Wi‑Fi/hotspot can load dev assets. */
function getLocalIpAddresses(): string[] {
  const addresses: string[] = [];

  for (const interfaces of Object.values(os.networkInterfaces())) {
    if (!interfaces) continue;
    for (const iface of interfaces) {
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }

  return addresses;
}

function getAllowedDevOrigins(): string[] {
  const fromEnv =
    process.env.ALLOWED_DEV_ORIGINS?.split(",")
      .map((entry) => entry.trim())
      .filter(Boolean) ?? [];

  return [...new Set([...fromEnv, ...getLocalIpAddresses()])];
}

const nextConfig: NextConfig = {
  // Required for iPhone / LAN access in dev — without this, client JS is blocked
  // and role routes render a blank dark canvas.
  allowedDevOrigins: getAllowedDevOrigins(),
};

export default nextConfig;
