import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryStudentRepository: InMemoryStudentRepository
let fakeHasher: FakeHasher

let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakeHasher)
  })

  it('Should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.items[0],
    })
  })

  it('Should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345',
    })

    const hashedPassword = await fakeHasher.hash('12345')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentRepository.items[0].password).toEqual(hashedPassword)
  })
})
