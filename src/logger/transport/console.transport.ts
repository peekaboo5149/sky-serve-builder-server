import { ITransport } from '.'
import { LEVEL } from '../types'

export default class ConsoleTransport implements ITransport {
  log(level: LEVEL, message: string, meta?: any): void {
    if (level === 'error') {
      console.error(`[${level}] ${message}`, meta || '')
    } else {
      console.log(`[${level}] ${message}`, meta || '')
    }
  }
}
