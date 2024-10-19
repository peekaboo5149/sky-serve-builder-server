import { ITransport } from './transport'
import ConsoleTransport from './transport/console.transport'
import { LEVEL } from './types'

export class Logger {
  constructor(private readonly transports: ITransport[]) {}

  private async log(level: LEVEL, message: string, meta?: any): Promise<void> {
    for (const transport of this.transports) {
      await transport.log(level, message, meta)
    }
  }

  async info(message: string, meta?: any): Promise<void> {
    await this.log('info', message, meta)
  }

  async error(message: string, meta?: any): Promise<void> {
    await this.log('error', message, meta)
  }

  async close(): Promise<void> {
    for (const transport of this.transports) {
      if (typeof transport.close === 'function') {
        await transport.close()
      }
    }
  }
}

const logger = new Logger([new ConsoleTransport()])

export default logger
