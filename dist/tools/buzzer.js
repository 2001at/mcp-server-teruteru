import z from "zod";
export const playScale = async (mcpServer, serialService) => {
    // @ts-ignore
    mcpServer.tool("playScale", "SP32 にシリアルで「周波数,鳴らす長さ」を送信すると、圧電ブザーでその通りに音を鳴らします。連続した音符を演奏するには、'freq1,dur1;freq2,dur2;...' の形式で入力します。", {
        reason: z.string().describe("ブザーを再生する理由").optional(),
        noteData: z
            .string()
            .describe("鳴らす音符データ。例: '440,500' または '262,500;262,500;...'"),
    }, async (input) => {
        await serialService.write(input.noteData);
        return {
            content: [
                {
                    type: "text",
                    text: `Successfully sent note data to ESP32: ${input.noteData}`,
                },
            ],
        };
    });
};
//# sourceMappingURL=buzzer.js.map