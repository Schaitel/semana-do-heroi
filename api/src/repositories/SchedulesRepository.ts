import { endOfDay, startOfDay } from 'date-fns';
import { prisma } from '../database/prisma';
import { ICreate } from '../interfaces/SchedulesInterface';

export class SchedulesRepository {
  async create({ name, phone, date, user_id }: ICreate) {
    return prisma.schedule.create({
      data: {
        name,
        phone,
        date,
        userId: user_id,
      },
    });
  }
  async find(date: Date, user_id: string) {
    return prisma.schedule.findFirst({
      where: { date, userId: user_id },
    });
  }
  async findAll(date: Date) {
    return prisma.schedule.findMany({
      where: {
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }
  async update(id: string, date: Date) {
    return prisma.schedule.update({
      where: { id },
      data: { date },
    });
  }
}
