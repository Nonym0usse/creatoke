
import { Utils } from "../utils/utils";
import { Song } from "./song";


//
// Playlist data

export class Playlist {
    id: number | undefined;
    name: string | undefined;
    cover: string | undefined;
    likes: number | undefined;
    songs: any;
    detailsRoute: string | undefined;

    /**
     * Convert playlist data for local
     * @param data 
     */
    toLocal(data: any): any {
        if (!data) {
            return this;
        }
        
        this.id = Utils.getInt(data.id);
        this.name = data.name;
        this.likes = Utils.getFloat(data.links);
        this.cover = data.playlistCover;

        this.songs = data.songList.map((element: any) => {
            return new Song().toLocal(element);
        });

        this.detailsRoute = '/app/playlist/' + this.id + '/details';

        return this;
    }
}