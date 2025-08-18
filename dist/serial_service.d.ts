export declare class SerialService {
    private path;
    private baudRate;
    private port;
    private parser;
    constructor(path: string, baudRate?: number);
    /**
     * シリアルポートへコマンド送信
     */
    write(command: string): Promise<void>;
}
//# sourceMappingURL=serial_service.d.ts.map