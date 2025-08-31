import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import dotenv from "dotenv";
import { SerialService } from "./serial_service.js";
import { playScale } from "./tools/buzzer.js";
import { ledOnOff } from "./tools/led.js";
import z from "zod";
import { carControl } from "./tools/car.js";
import { playSongFromTitle } from "./tools/music.js";


// npx tsc を実行前に入力

dotenv.config();

export const PORT_PATH: string = "/dev/cu.usbmodem2101";
const server = new McpServer({
  name: "ESP32 LED Control Server",
  version: "1.0.0",
});
const serial = new SerialService(PORT_PATH);

ledOnOff(server, serial);

playScale(server, serial);

carControl(server, serial); 

playSongFromTitle(server, serial);

async function main(): Promise<void> {
  console.log("Starting MCP Server with stdio transport...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
