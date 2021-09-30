import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe('Get Statement by operation', () => {

  let userRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let statementRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(userRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepository, statementRepository);
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementRepository);
  });

  it('should be able to get a statement operation', async () => {
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

    const operationStatement = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!
    });

    expect(operationStatement).toHaveProperty("id");
    expect(operationStatement.type).toBe("deposit" as OperationType);
  });

  it('should not be able to get a statement operation of a invalid user', async () => {
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

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: '1232112',
        statement_id: statement.id!
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to get a statement operation of a invalid statement', async () => {
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

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: '243324532'
      });
    }).rejects.toBeInstanceOf(AppError);
  });


});
