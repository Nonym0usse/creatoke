
import { Utils } from "../utils/utils";
import { Song } from "./song";


//
// Genre data

export class Genre {
    id: number | undefined;
    name: string | undefined;
    cover: string | undefined;
    songs: any;
    detailsRoute: string | undefined;

    /**
     * Convert genre data for local
     * @param data 
     */
    toLocal(data: any): any {
        if (!data) {
            return this;
        }
        
        this.id = Utils.getInt(data.id);;
        this.name = data.name;
        this.cover = data.genreCover;

        this.songs = data.songList.map((element: any) => {
            return new Song().toLocal(element);
        });

        this.detailsRoute = '/app/genre/' + this.id + '/details';

        return this;
    }
}