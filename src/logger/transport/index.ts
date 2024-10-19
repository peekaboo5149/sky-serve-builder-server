import { LEVEL } from '../types'

export interface ITransport {
  log(level: LEVEL, message: string, meta?: any): Promise<void> | void
  close?(): Promise<void> | void
}
