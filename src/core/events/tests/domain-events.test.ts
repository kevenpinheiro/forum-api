import { AggregateRoot } from '@/core/entities/aggregate-root'
import { DomainEvent } from '../domain-event'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '../domain-events'
import { vi } from 'vitest'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callBackSpy = vi.fn()

    // Subscriber cadastrado (ouvindo o evento de resposta criada)
    DomainEvents.register(callBackSpy, CustomAggregateCreated.name)

    // Estou criando uma resposta porém SEM salvar no banco de dados
    const aggregate = CustomAggregate.create()

    // Estou assegurando que o evento foi criado porém não disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // O Subscriber ouve o evento e faz o que precisar ser feito com o dado
    expect(callBackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
