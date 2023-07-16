import { NextFunction, Request, Response } from 'express';
import { SchedulesService } from '../services/SchedulesService';
import { parseISO } from 'date-fns';

export class SchedulesController {
  private schedulesService: SchedulesService;
  constructor() {
    this.schedulesService = new SchedulesService();
  }

  async store(request: Request, response: Response, next: NextFunction) {
    try {
      const { date, name, phone } = request.body;
      const { user_id } = request;

      const result = await this.schedulesService.create({
        name,
        phone,
        date,
        user_id,
      });

      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { date } = request.query;
      const parseDate = date ? parseISO(date.toString()) : new Date();

      const result = await this.schedulesService.index(parseDate);

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const { date } = request.body;
      const { user_id } = request;

      const result = await this.schedulesService.update(id, date, user_id);

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  async delete(request: Request, response: Response, next: NextFunction) {}
}
