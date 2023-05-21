
import { Utils } from '../utils/utils';
import { Song } from "./song";


//
// Artist data

export class Artist {
    id: number | undefined;
    name: string | undefined;
    dob: string | undefined;
    ratings: number | undefined;
    totalAlbums: number | undefined;
    totalSongs: number | undefined;
    cover: string | undefined;
    favorites: number | undefined;
    description: string | undefined;
    songs: any;
    detailsRoute: string | undefined;

    /**
     * Convert artist data for local
     * @param data 
     */
    toLocal(data: any): any {
        if (!data) {
            return this;
        }
        
        this.id = Utils.getInt(data.id);
        this.name = data.name;

        if (data.dob) {
            this.dob = Utils.localDate(data.date);
        }
        
        this.totalAlbums = Utils.getInt(data.totalAlbums);
        this.totalSongs = Utils.getInt(data.totalSongs);
        this.favorites = Utils.getInt(data.favorites);
        this.ratings = data.artistRatings;
        this.cover = data.artistCover;
        this.description = data.description;

        this.songs = data.songList.map((element: any) => {
            return new Song().toLocal(element);
        });

        this.detailsRoute = '/app/artist/' + this.id + '/details';

        return this;
    }
}