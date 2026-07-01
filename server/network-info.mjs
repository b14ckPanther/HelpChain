import os from "os";

/**
 * Gets all non-loopback IPv4 addresses of the current host.
 * This is useful for printing the LAN URL so users can access
 * the prototype on their iPhones/other devices on the same Wi-Fi.
 */
export function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const interfaceName of Object.keys(interfaces)) {
    for (const iface of interfaces[interfaceName]) {
      // Skip loopback (e.g. 127.0.0.1) and non-IPv4
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }

  return addresses;
}
