import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { z } from "zod";
import dotenv from "dotenv";
import { SerialService } from "./serial_service.js";

dotenv.config();

const PORT_PATH: string = "/dev/cu.usbmodem101";

const serial = new SerialService(PORT_PATH);
const server = new McpServer({
  name: "ESP32 LED Control Server",
  version: "1.0.0",
});

// @ts-ignore
server.tool(
  "playScale",
  "SP32 にシリアルで「周波数,鳴らす長さ」を送信すると、圧電ブザーでその通りに音を鳴らします。{frequency} は 20Hz から 20kHz の範囲で指定できます。また、{duration} は 100ms から 5000msの範囲で指定できます。",
  {
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
  },
  async ({
    reason,
    frequency,
    duration,
  }: {
    reason?: string;
    frequency: number;
    duration: number;
  }) => {
    const command = `${frequency},${duration}`;
    await serial.write(command);
    return {
      content: [
        {
          type: "text",
          text: `Successfully played sound at ${frequency} Hz for ${duration} ms.`,
        },
      ],
    };
  }
);

async function main(): Promise<void> {
  console.log("Starting MCP Server with stdio transport...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
