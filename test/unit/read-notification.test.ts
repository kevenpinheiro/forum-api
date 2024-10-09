import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ReadNotificationUseCase } from '../../src/domain/notification/application/use-cases/read-notification'
import { makeNotification } from '../factories/make-notification'
import { InMemoryNotificationRepository } from '../repositories/in-memory-notifications-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
  })

  it('Should be able to read a notification', async () => {
    const notification = makeNotification()

    await inMemoryNotificationRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('Should not be able to read a notification from another user', async () => {
    const notification = makeNotification(
      { recipientId: new UniqueEntityId('recipient-1') },
      new UniqueEntityId('answer-1'),
    )

    await inMemoryNotificationRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'recipientId-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
