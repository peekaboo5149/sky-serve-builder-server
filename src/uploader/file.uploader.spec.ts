import * as fs from 'fs'
import path from 'path'
import logger from '../logger'
import { FileUploader } from './file.uploader'

export class MockFileUploader extends FileUploader {
  protected async uploadFile(
    filePath: string,
    projectId: string
  ): Promise<void> {
    // Simulate file upload logic
    console.log(`Uploading ${filePath} to project ${projectId}`)
  }
}

// Jest setup
jest.mock('fs')
jest.mock('../logger')

describe('FileUploader', () => {
  const mockLoggerInfo = logger.info as jest.Mock
  const mockReaddirSync = fs.readdirSync as jest.Mock
  const mockLstatSync = fs.lstatSync as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.PROJECT_ID = 'test-project'
  })

  it('should upload all files in the specified folder', async () => {
    const uploader = new MockFileUploader()
    const uploadFileSpy = jest.spyOn(uploader as any, 'uploadFile')

    mockReaddirSync.mockReturnValue(['file1.txt', 'file2.txt'])
    mockLstatSync.mockImplementation((filePath: string) => {
      return {
        isDirectory: () => false,
      }
    })

    await uploader.upload('dist')

    expect(mockLoggerInfo).toHaveBeenCalledWith('Starting to upload...')
    expect(mockLoggerInfo).toHaveBeenCalledWith('Done')
    expect(uploadFileSpy).toHaveBeenCalledTimes(2)
    expect(uploadFileSpy).toHaveBeenCalledWith('dist/file1.txt', 'test-project')
    expect(uploadFileSpy).toHaveBeenCalledWith('dist/file2.txt', 'test-project')
  })

  it('should skip directories', async () => {
    const uploader = new MockFileUploader()
    const uploadFileSpy = jest.spyOn(uploader as any, 'uploadFile')

    mockReaddirSync.mockReturnValue(['file1.txt', 'dir1'])
    mockLstatSync.mockImplementation((filePath: string) => {
      return {
        isDirectory: () => path.basename(filePath) === 'dir1',
      }
    })

    await uploader.upload('dist')

    expect(uploadFileSpy).toHaveBeenCalledTimes(1)
    expect(uploadFileSpy).toHaveBeenCalledWith('dist/file1.txt', 'test-project')
  })
})
