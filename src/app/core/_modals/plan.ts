
import { Utils } from "../utils/utils";


//
// Plan data

export class Plan {
    id: number | undefined;
    name: string | undefined;
    icon: string | undefined;
    price: number | undefined;
    subscribed: boolean | undefined;
    features: any;

    /**
     * Convert plan data for local
     * @param data 
     */
    toLocal(data: any): any {
        if (!data) {
            return this;
        }
        
        this.id = Utils.getInt(data.id);
        this.name = data.name;
        this.icon = data.icon;

        if (data.price) {
            this.price = Utils.getFloat(data.price);
        }
        
        this.subscribed = data.subscribed;
        
        if (data.features) {
            this.features = data.features.map((element: any) => {
                element.id = Utils.getInt(element.id);
                element.name = element.name;
                return element;
            });
        }

        return this;
    }
}