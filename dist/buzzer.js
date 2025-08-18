import z from "zod";
export const playScale = async (mcpServer, serialService) => {
    // @ts-ignore
    mcpServer.tool("playScale", "SP32 にシリアルで「周波数,鳴らす長さ」を送信すると、圧電ブザーでその通りに音を鳴らします。{frequency} は 20Hz から 20kHz の範囲で指定できます。また、{duration} は 100ms から 5000msの範囲で指定できます。", {
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
        await serialService.write(command);
        return {
            content: [
                {
                    type: "text",
                    text: `Successfully played sound at ${frequency} Hz for ${duration} ms.`,
                },
            ],
        };
    });
};
//# sourceMappingURL=buzzer.js.map