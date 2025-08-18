import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { SerialService } from "./serial_service.js";
import { playScale } from "./tools/buzzer.js";
import { ledOnOff } from "./tools/led.js";
dotenv.config();
// export const PORT_PATH: string = "/dev/cu.usbmodem101";
const server = new McpServer({
    name: "ESP32 LED Control Server",
    version: "1.0.0",
});
ledOnOff();
// playScale(server, serial);
async function main() {
    console.log("Starting MCP Server with stdio transport...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch(console.error);
//# sourceMappingURL=app.js.map