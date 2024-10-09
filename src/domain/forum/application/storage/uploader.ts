export interface UpaloadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract uploader(params: UpaloadParams): Promise<{ url: string }>
}
