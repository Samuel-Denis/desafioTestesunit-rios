import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe('CreateUser', () => {

  let userRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('Should be able to create a user', async () => {
    const user = await createUserUseCase.execute({
      name: "Name Test",
      email: "test@gmail.com",
      password: "test"
    });
    expect(user).toHaveProperty("id");
  });

  it('Should not be able to create a user with an existent email', async () => {
    const user = await createUserUseCase.execute({
      name: "Name Test",
      email: "test@gmail.com",
      password: "test"
    });

    expect(async () => {
      await createUserUseCase.execute({
        name: "Name Test2",
        email: "test@gmail.com",
        password: "test"
      });
    }).rejects.toBeInstanceOf(AppError);
  });



});
