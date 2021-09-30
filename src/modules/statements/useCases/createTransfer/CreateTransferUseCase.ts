import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";


interface ICreateTransferDTO {
  user_id: string;
  sender_id: string;
  amount: number;
  description: string;
}

enum OperationType {
  TRANSFER = 'transfer',
}

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({ user_id, sender_id, amount, description }: ICreateTransferDTO) {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new CreateTransferError.UserNotFound();
    }

    const senderUser = await this.usersRepository.findById(sender_id);
    if (!senderUser) {
      throw new CreateTransferError.UserNotFound();
    }
    const { balance } = await this.statementsRepository.getUserBalance({ user_id });

    console.log(balance);
    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    }

    const statement = await this.statementsRepository.create({
      user_id,
      sender_id,
      type: 'transfer' as OperationType,
      amount,
      description
    });

    return statement;

  }

}


export { CreateTransferUseCase };
