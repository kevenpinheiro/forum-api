import { InMemoryQuestionRepository } from '../repositories/in-memory-questions-repository'
import { makeQuestion } from '../factories/make-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { InMemoryQuestionAttachmentsRepository } from '../repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments.repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository

let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentRepository = new InMemoryStudentRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentRepository,
    )

    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('Should be able to fetch recent questions', async () => {
    inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 6, 20) }),
    )
    inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 6, 18) }),
    )
    inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 6, 23) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 6, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 6, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 6, 18) }),
    ])
  })
})
