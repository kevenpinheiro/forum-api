import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionsCommentRepository } from './prisma/repositories/prisma-question-comment-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { PrismaStudentRepository } from './prisma/repositories/prisma-students-repository'
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { PrismaNotificationRepository } from './prisma/repositories/prisma-notification-repository'
import { CacheModule } from '../cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionsCommentRepository,
    },
    { provide: AnswersRepository, useClass: PrismaAnswersRepository },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentRepository,
    },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionRepository,
    StudentRepository,
    QuestionAttachmentsRepository,
    QuestionCommentRepository,
    AnswersRepository,
    AnswerAttachmentsRepository,
    AnswerCommentRepository,
    AttachmentsRepository,
    NotificationRepository,
  ],
})
export class DatabaseModule {}
