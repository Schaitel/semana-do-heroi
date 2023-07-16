import { ICreate } from '../interfaces/SchedulesInterface';
import { getHours, isBefore, startOfHour } from 'date-fns';
import { SchedulesRepository } from '../repositories/SchedulesRepository';

export class SchedulesService {
  private schedulesRepository: SchedulesRepository;
  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }

  async create({ name, phone, date, user_id }: ICreate) {
    const dateFormatted = new Date(date);

    const hourStart = startOfHour(dateFormatted);
    const hourEnd = getHours(hourStart); // TODO: use date-fns-tz to get hour in timezone

    if (hourEnd <= 9 || hourEnd >= 19)
      throw new Error('Create schedule between 9 and 19');

    if (isBefore(hourStart, Date.now()))
      throw new Error('It is not allowed to schedule old date');

    const checkIsAvailable = await this.schedulesRepository.find(
      hourStart,
      user_id
    );

    if (checkIsAvailable) throw new Error('Schedule date is not available');

    return this.schedulesRepository.create({
      name,
      phone,
      date: hourStart,
      user_id,
    });
  }

  async index(date: Date) {
    return this.schedulesRepository.findAll(date);
  }

  async update(id: string, date: Date, user_id: string) {
    const dateFormatted = new Date(date);

    const hourStart = startOfHour(dateFormatted);

    if (isBefore(hourStart, Date.now()))
      throw new Error('It is not allowed to schedule old date');

    const checkIsAvailable = await this.schedulesRepository.find(
      hourStart,
      user_id
    );

    if (checkIsAvailable) throw new Error('Schedule date is not available');

    return this.schedulesRepository.update(id, hourStart);
  }
}
