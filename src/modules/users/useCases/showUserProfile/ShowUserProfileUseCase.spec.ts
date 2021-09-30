

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe('Show user profile', () => {

  let userRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let showUserProfileUseCase: ShowUserProfileUseCase;


  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository);

  });

  it('should be able to show an user profile', async () => {
    const user = await createUserUseCase.execute({
      name: "name test",
      email: "test@gmail.com",
      password: "test"
    });

    const userProfile = await showUserProfileUseCase.execute(user.id!);

    expect(userProfile).toHaveProperty("email");

  });


  it('should not be able to show a profile from an inexistent user', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("423423423");
    }).rejects.toBeInstanceOf(AppError);
  });
});
