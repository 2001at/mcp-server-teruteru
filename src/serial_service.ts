import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

export class SerialService {
  private port: SerialPort;
  private parser: ReadlineParser;

  constructor(private path: string, private baudRate: number = 115200) {
    this.port = new SerialPort({ path: this.path, baudRate: this.baudRate });
    this.parser = this.port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    this.port.on("error", (err: Error) => {
      console.error("🚨 シリアルポートエラー:", err.message);
    });

    this.parser.on("data", (data: string) => {
      console.log(`💻 [ESP32] <- ${data}`);
    });
  }

  /**
   * シリアルポートへコマンド送信
   */
  async write(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.port.write(`${command}\n`, (err) => {
        if (err) return reject(err);
        console.log(`✅ [シリアル送信] -> ${command}`);
        resolve();
      });
    });
  }
}
