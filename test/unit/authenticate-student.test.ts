import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student-use-case'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryStudentRepository: InMemoryStudentRepository
let fakeHasher: FakeHasher
let fakeEncryter: FakeEncrypter

let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    fakeHasher = new FakeHasher()
    fakeEncryter = new FakeEncrypter()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentRepository,
      fakeHasher,
      fakeEncryter,
    )
  })

  it('Should be able to authenticate a  student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('12345'),
    })

    inMemoryStudentRepository.items.push(student)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '12345',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
