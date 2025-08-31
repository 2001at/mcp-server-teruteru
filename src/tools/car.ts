import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { SerialService } from "../serial_service.js";
import z from "zod";

export const carControl = async (
  mcpServer: McpServer,
  serialService: SerialService
) => {
  // @ts-ignore
  mcpServer.tool(
    "carControl",
    "ESP32 にシリアルで「コマンド,時間」を送信すると、車をその通りに動かします。{command} は動作の種類、{duration} は動作時間（ミリ秒）です。",
    {
      reason: z.string().describe("車を動かす理由").optional(),
      command: z
        .enum(["FORWARD", "BACKWARD", "LEFT", "RIGHT", "STOP"])
        .describe("車の動作コマンド（前進/後退/左旋回/右旋回/止まる）"),
      duration: z
        .number()
        .int()
        .min(100)
        .max(10000)
        .describe("動作時間（ミリ秒）"),
    },
    async (input) => {
      const command = `${input.command},${input.duration}`;
      await serialService.write(command);
      return {
        content: [
          {
            type: "text",
            text: `reason: ${input.reason || "なし"}, command: ${command}`,
          },
        ],
      };
    }
  );
};
