import { Kafka, logLevel } from 'kafkajs'
import { ITransport } from '.'
import * as fs from 'fs'
import { LEVEL } from '../types'

export default class KafkaTransport implements ITransport {
  private readonly kafka: Kafka
  private readonly producer: any
  private readonly topic: string
  private connected: boolean = false

  constructor(brokers: string[], topic: string) {
    this.kafka = new Kafka({
      clientId: `build-server-${process.env.PROJECT_ID}`,
      brokers: brokers,
      ssl: {
        rejectUnauthorized: true,
        ca: [fs.readFileSync('/home/app/ca.pem')], // Mount them using volumes
        cert: fs.readFileSync('/home/app/service.crt'),
        key: fs.readFileSync('/home/app/service.key'),
      },
      logLevel: logLevel.ERROR,
    })
    this.producer = this.kafka.producer()
    this.topic = topic
    this.connect()
  }

  async log(level: LEVEL, message: any, meta?: any): Promise<void> {
    if (!this.connected) {
      await this.connect()
    }

    const logEntry = {
      level,
      message,
      meta,
      timestamp: new Date().toISOString(),
    }

    await this.producer.send({
      topic: this.topic,
      messages: [{ value: JSON.stringify(logEntry) }],
    })
  }

  private async connect(): Promise<void> {
    if (!this.connected) {
      await this.producer.connect()
      this.connected = true
    }
  }

  async close(): Promise<void> {
    if (this.connected) {
      await this.producer.disconnect()
      this.connected = false
    }
  }
}
