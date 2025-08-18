import z from "zod";
export const ledOnOff = async (mcpServer, serialService) => {
    // @ts-ignore
    mcpServer.tool("ledBrink", "ESP32 にシリアルで「on/off」を送信すると、LEDを点灯させます。", {
        reason: z.string().describe("LEDを点灯させる理由").optional(),
        command: z.string().describe("LEDを点灯させるコマンド（on/off）"),
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