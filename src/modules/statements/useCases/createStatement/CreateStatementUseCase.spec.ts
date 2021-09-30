
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "./CreateStatementController";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe('Create Statement', () => {

  let userRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let statementRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;


  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(userRepository);
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementRepository);
  });

  it('should be able to realize a deposit', async () => {
    const user = await createUserUseCase.execute({
      name: "name test",
      email: "test@gmail.com",
      password: "test"
    });

    const statement = await createStatementUseCase.execute({
      amount: 200,
      description: "deposit",
      type: "deposit" as OperationType,
      user_id: user.id!
    });

    expect(statement).toHaveProperty("id");
  });

  it('should be able to realize a withdraw', async () => {
    const user = await createUserUseCase.execute({
      name: "name test",
      email: "test@gmail.com",
      password: "test"
    });

    await createStatementUseCase.execute({
      amount: 200,
      description: "deposit",
      type: "deposit" as OperationType,
      user_id: user.id!
    });

    const withdraw = await createStatementUseCase.execute({
      amount: 200,
      description: "withdraw",
      type: "withdraw" as OperationType,
      user_id: user.id!
    });

    expect(withdraw).toHaveProperty("id");
  });

  it('should not be able to do a statement with an inexistent user', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 200,
        description: "withdraw",
        type: "withdraw" as OperationType,
        user_id: "3123123"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to do a withdraw with an insufficient balance amount', async () => {
    const user = await createUserUseCase.execute({
      name: "name test",
      email: "test@gmail.com",
      password: "test"
    });

    expect(async () => {
      await createStatementUseCase.execute({
        amount: 200,
        description: "withdraw",
        type: "withdraw" as OperationType,
        user_id: user.id!
      });
    }).rejects.toBeInstanceOf(AppError);
  });

});
