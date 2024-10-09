import { makeAnswer } from '../factories/make-answer'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { InMemoryAnswerRepository } from '../repositories/in-memory-answer-repository'
import { InMemoryAnswerCommentsRepository } from '../repositories/in-memory-answer-comments-repository'
import { InMemoryAnswerAttachmentsRepository } from '../repositories/in-memory-answer-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswerRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository

let sut: CommentOnAnswerUseCase

describe('Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentRepository,
    )

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerCommentRepository,
      inMemoryAnswersRepository,
    )
  })

  it('Should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Comentário teste',
    })

    expect(inMemoryAnswerCommentRepository.items[0].content).toEqual(
      'Comentário teste',
    )
  })
})
