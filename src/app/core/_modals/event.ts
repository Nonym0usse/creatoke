
import { Utils } from '../utils/utils';


//
// Event data

export class Event {
    id: number | undefined;
    name: string | undefined;
    image: string | undefined;
    date: string | undefined;
    price: number | undefined;
    address: string | undefined;
    phone: string | undefined;
    email: string | undefined;
    description: string | undefined;
    seats: number | undefined;
    attendee: any;
    totalAttendee: number | undefined;

    /**
     * Convert event data for local
     * @param data 
     */
    toLocal(data: any): any {
        if (!data) {
            return this;
        }
        
        this.id = Utils.getInt(data.id);;
        this.name = data.name;
        this.image = data.image;
        this.date = Utils.localDate(data.date);

        if (data.price) {
            this.price = Utils.getFloat(data.price);
        }
        
        this.address = data.address;
        this.phone = data.phone;
        this.email = data.email;
        this.description = data.description;
        
        if (data.seats) {
            this.seats = Utils.getInt(data.seats);
        }

        if (data.attendee) {
            this.attendee = data.attendee.map((element: any) => {
                element.id = Utils.getInt(element.id);
                element.name = element.name;
                element.cover = element.userCover;
                return element;
            });

            this.totalAttendee = data.attendee.length > 3 ? data.attendee.length : null;
        }

        return this;
    }
}