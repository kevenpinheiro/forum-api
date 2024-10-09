import {
  Uploader,
  UpaloadParams,
} from '@/domain/forum/application/storage/uploader'
import { randomUUID } from 'node:crypto'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async uploader({ fileName }: UpaloadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url,
    })

    return { url }
  }
}
