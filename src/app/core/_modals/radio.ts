
import { Utils } from "../utils/utils";


//
// Radio data

export class Radio {
    id: number | undefined;
    name: string | undefined;
    premium: boolean | undefined;
    favorite: boolean | undefined;
    cover: string | undefined;

    /**
     * Convert song data for local
     * @param data 
     */
    toLocal(data: any): any {
        if (!data) {
            return this;
        }
        
        this.id = Utils.getInt(data.id);
        this.name = data.name;

        if (data.premium) {
            this.premium = data.premium;
        }

        if (data.favorite) {
            this.favorite = data.favorite;
        }

        this.cover = data.radioCover;

        return this;
    }
}