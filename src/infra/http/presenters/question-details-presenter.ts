import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachments-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(questiondetails: QuestionDetails) {
    return {
      questionId: questiondetails.questionId.toString(),
      authorId: questiondetails.authorId.toString(),
      author: questiondetails.author,
      title: questiondetails.title,
      slug: questiondetails.slug.value,
      attachments: questiondetails.attachments.map(AttachmentPresenter.toHTTP),
      bestAnswerId: questiondetails.bestAnswerId?.toString(),
      createdAt: questiondetails.createdAt,
      updatedAt: questiondetails.updatedAt,
    }
  }
}
