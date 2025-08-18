import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
const PORT_PATH = "/dev/cu.usbmodem101";
const SERVER_PORT = 3000;
const port = new SerialPort({ path: PORT_PATH, baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
port.on("error", (err) => {
    console.error("🚨 シリアルポートエラー:", err.message);
});
parser.on("data", (data) => {
    console.log(`💻 [ESP32] <- ${data}`);
});
/**
 * シリアルポートへコマンド送信
 */
function writeToPort(command) {
    return new Promise((resolve, reject) => {
        port.write(`${command}\n`, (err) => {
            if (err)
                return reject(err);
            console.log(`✅ [シリアル送信] -> ${command}`);
            resolve();
        });
    });
}
const server = new McpServer({
    name: "ESP32 LED Control Server",
    version: "1.0.0",
});
// @ts-ignore
server.tool("playScale", "SP32 にシリアルで「周波数,鳴らす長さ」を送信すると、圧電ブザーでその通りに音を鳴らします。{frequency} は 20Hz から 20kHz の範囲で指定できます。また、{duration} は 100ms から 5000msの範囲で指定できます。", {
    reason: z.string().describe("ブザーを再生する理由").optional(),
    frequency: z
        .number()
        .int()
        .min(20)
        .max(20000)
        .describe("鳴らす周波数（Hz）"),
    duration: z
        .number()
        .int()
        .min(100)
        .max(5000)
        .describe("鳴らす長さ（ミリ秒）"),
}, async ({ reason, frequency, duration, }) => {
    const command = `${frequency},${duration}`;
    await writeToPort(command);
    return {
        content: [
            {
                type: "text",
                text: `Successfully played sound at ${frequency} Hz for ${duration} ms.`,
            },
        ],
    };
});
async function main() {
    console.log("Starting MCP Server with stdio transport...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch(console.error);
//# sourceMappingURL=app.js.map