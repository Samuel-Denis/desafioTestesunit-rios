
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransferUseCase } from './CreateTransferUseCase';

class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { id: sender_id } = request.params;
    const { amount, description } = request.body;

    console.log(sender_id);

    const createTransfer = container.resolve(CreateTransferUseCase);

    const statement = await createTransfer.execute({
      user_id,
      sender_id,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}

export { CreateTransferController };
