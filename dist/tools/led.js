import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SerialService } from "../serial_service.js";
import z from "zod";
export const PORT_PATH = "/dev/cu.usbmodem101";
const serial = new SerialService(PORT_PATH);
export const ledOnOff = async () => {
    // @ts-ignore
    mcpServer.tool("ledBrink", "ESP32 にシリアルで「HIGH/LOW」を送信すると、LEDを点灯させます。", {
        reason: z.string().describe("LEDを点灯させる理由").optional(),
        command: z.string().describe("LEDを点灯させるコマンド（HIGH/LOW）"),
    }, async (input) => {
        await serial.write(input.command);
        return {
            content: [
                {
                    type: "text",
                    text: `reason: ${input.reason || "なし"}, command: ${input.command}`,
                },
            ],
        };
    });
};
//# sourceMappingURL=led.js.map