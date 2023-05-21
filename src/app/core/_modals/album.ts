
import { Utils } from "../utils/utils";
import { Song } from "./song";


//
// Album data

export class Album {
    id: number | undefined;
    name: string | undefined;
    premium: boolean | undefined;
    favorite: boolean | undefined;
    thumb: string | undefined;
    ratings: number | undefined;
    cover: string | undefined;
    release: string | undefined;
    company: string | undefined;
    favorites: number | undefined;
    downloads: string | undefined;
    artists: any;
    songs: any;
    detailsRoute: string | undefined;

    /**
     * Convert album data for local
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
        
        this.thumb = data.albumThumb;
        this.ratings = Utils.getFloat(data.albumRatings);
        this.cover = data.albumCover;
        this.release = Utils.localDate(data.release);
        this.company = data.albumCompany;
        this.favorites = Utils.getInt(data.favorites);
        this.downloads = data.albumDownloads;

        this.artists = data.artists.map((element: any) => {
            element.id = Utils.getInt(element.id);
            element.name = element.name;
            return element;
        });

        this.songs = data.songList.map((element: any) => {
            return new Song().toLocal(element);
        });

        this.detailsRoute = '/app/album/' + this.id + '/details';

        return this;
    }
}