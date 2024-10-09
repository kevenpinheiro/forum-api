import { InMemoryAnswerCommentsRepository } from '../repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from '../factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeStudent } from 'test/factories/make-student'
import { FetchAnswerCommentsUseCaseUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: FetchAnswerCommentsUseCaseUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()

    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentRepository,
    )

    sut = new FetchAnswerCommentsUseCaseUseCase(inMemoryAnswerCommentRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentRepository.create(comment1)
    await inMemoryAnswerCommentRepository.create(comment2)
    await inMemoryAnswerCommentRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})

// describe('Delete Answer Comment', () => {
//   beforeEach(() => {
//     inMemoryStudentRepository = new InMemoryStudentRepository()

//     inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository(
//       inMemoryStudentRepository,
//     )

//     sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository)
//   })

//   it.skip('Should not be able to delete another user answer comment', async () => {
//     const student = makeStudent({ name: 'John Doe' })

//     inMemoryStudentRepository.items.push(student)

//     const answerComment = makeAnswerComment({
//       authorId: new UniqueEntityId('author-1'),
//     })

//     await inMemoryAnswerCommentRepository.create(answerComment)

//     const result = await sut.execute({
//       answerCommentId: answerComment.id.toString(),
//       authorId: 'author-2',
//     })

//     expect(result.isLeft()).toBe(true)
//     expect(result.value).toBeInstanceOf(NotAllowedError)
//   })
// })
