export class CreateEventsDto {
    id(id: any): Promise<import("../events.entity").Events> {
      throw new Error('Method not implemented.');
    }
    date: Date;
    sport: string;
  }