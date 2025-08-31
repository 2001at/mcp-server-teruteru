import z from "zod";
export const playSongFromTitle = async (mcpServer, serialService) => {
    // @ts-ignore
    mcpServer.tool("playSongFromTitle", "曲のタイトル名を受け取り、その楽譜を生成してブザーで演奏します。", {
        reason: z.string().describe("曲を演奏する理由").optional(),
        title: z.string().describe("演奏したい曲名"),
        noteData: z.string().describe("AIが生成した楽譜データ。フォーマットは '周波数,鳴らす長さ;周波数,鳴らす長さ;...'。例えば、'262,250;262,250;392,500;...' のように指定します。"),
    }, async (input) => {
        // ここでは、AIが生成したnoteDataをそのままESP32に送信する
        await serialService.write(input.noteData);
        return {
            content: [
                {
                    type: "text",
                    text: `"${input.title}" の演奏を開始しました。`,
                },
            ],
        };
    });
};
//# sourceMappingURL=music.js.map