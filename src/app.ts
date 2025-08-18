import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { z } from "zod";
import express, { type Request, type Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT_PATH: string = "/dev/cu.usbmodem101";
const SERVER_PORT: number = 3000;

const port = new SerialPort({ path: PORT_PATH, baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

port.on("error", (err: Error) => {
  console.error("🚨 シリアルポートエラー:", err.message);
});

parser.on("data", (data: string) => {
  console.log(`💻 [ESP32] <- ${data}`);
});

/**
 * シリアルポートへコマンド送信
 */
function writeToPort(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    port.write(`${command}\n`, (err) => {
      if (err) return reject(err);
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
    await writeToPort(command);
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
  const args: string[] = process.argv.slice(2);
  const useHttp: boolean = args.includes("--http");

  if (useHttp) {
    const app = express();
    app.use(express.json());

    app.all("/mcp", async (req: Request, res: Response) => {
      if (req.method !== "POST") {
        return res
          .status(405)
          .json({ error: { message: `Method not allowed: ${req.method}` } });
      }

      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

      try {
        res.on("close", () => {
          transport.close();
        });

        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        console.error("MCPリクエスト処理エラー:", error);
        if (!res.headersSent) {
          res.status(500).json({ error: { message: "Internal server error" } });
        }
      }
    });

    app.listen(SERVER_PORT, () => {
      console.log(
        `🚀 MCP HTTP Server running on http://localhost:${SERVER_PORT}/mcp`
      );
    });

    const httpTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(httpTransport);
  } else {
    console.log("Starting MCP Server with stdio transport...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
}

main().catch(console.error);
