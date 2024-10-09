import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { InMemoryAnswerCommentsRepository } from '../repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from '../factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository

let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentRepository,
    )

    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository)
  })

  it('Should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await inMemoryAnswerCommentRepository.create(answerComment)

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
