import { SerialService } from "../serial_service.js";
import z from "zod";
// const serial = new SerialService("/dev/cu.usbmodem101");
export const ledOnOff = async (mcpServer, serialService) => {
    // @ts-ignore
    mcpServer.tool("ledBrink", "ESP32 にシリアルで「HIGH/LOW」を送信すると、LEDを点灯させます。", {
        reason: z.string().describe("LEDを点灯させる理由").optional(),
        command: z.string().describe("LEDを点灯させるコマンド（HIGH/LOW）"),
    }, async (input) => {
        await serialService.write(input.command);
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