import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from '../repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCaseUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { makeQuestionComment } from '../factories/make-question-comment'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCaseUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()

    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentRepository,
    )

    sut = new FetchQuestionCommentsUseCaseUseCase(
      inMemoryQuestionCommentRepository,
    )
  })

  it('Should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentRepository.items.push(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentRepository.create(comment1)
    await inMemoryQuestionCommentRepository.create(comment2)
    await inMemoryQuestionCommentRepository.create(comment3)

    const result = await sut.execute({
      questionId: 'question-1',
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

  it('should be able to fetch paginated question comment', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
