import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

describe('Authenticate User', () => {

  let authenticateUserUseCase: AuthenticateUserUseCase;
  let userRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
  });

  it('should be able to authenticate an user', async () => {
    await createUserUseCase.execute({
      name: "name test",
      email: "test@gmail.com",
      password: "test"
    });

    const result = await authenticateUserUseCase.execute({
      email: "test@gmail.com",
      password: "test"
    });

    expect(result).toHaveProperty("token");
  });

  it('should not be able to authenticate an user with an incorrect email', async () => {
    await createUserUseCase.execute({
      name: "name test",
      email: "test2@gmail.com",
      password: "test2"
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test3@gmail.com",
        password: "test2"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with an incorrect password', async () => {
    await createUserUseCase.execute({
      name: "name test",
      email: "test3@gmail.com",
      password: "test3"
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test3@gmail.com",
        password: "test"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an nonexistent user', async () => {

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test4@gmail.com",
        password: "test"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

});
