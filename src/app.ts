import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import dotenv from "dotenv";
import { SerialService } from "./serial_service.js";
import { playScale } from "./buzzer.js";

dotenv.config();

const PORT_PATH: string = "/dev/cu.usbmodem101";

const serial = new SerialService(PORT_PATH);
const server = new McpServer({
  name: "ESP32 LED Control Server",
  version: "1.0.0",
});

playScale(server, serial);

async function main(): Promise<void> {
  console.log("Starting MCP Server with stdio transport...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
