import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
export class SerialService {
    constructor(path, baudRate = 115200) {
        this.path = path;
        this.baudRate = baudRate;
        this.port = new SerialPort({ path: this.path, baudRate: this.baudRate });
        this.parser = this.port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
        this.port.on("error", (err) => {
            console.error("🚨 シリアルポートエラー:", err.message);
        });
        this.parser.on("data", (data) => {
            console.log(`💻 [ESP32] <- ${data}`);
        });
    }
    /**
     * シリアルポートへコマンド送信
     */
    async write(command) {
        return new Promise((resolve, reject) => {
            this.port.write(`${command}\n`, (err) => {
                if (err)
                    return reject(err);
                console.log(`✅ [シリアル送信] -> ${command}`);
                resolve();
            });
        });
    }
}
//# sourceMappingURL=serial_service.js.map