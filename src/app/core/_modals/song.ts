
import { Utils } from '../utils/utils';


//
// Song data

export class Song {
    id: number | undefined;
    name: string | undefined;
    premium: boolean | undefined;
    favorite: boolean | undefined;
    artists: any;
    album: any;
    release: string | undefined;
    company: string | undefined;
    url: string | undefined;
    thumb: string | undefined;
    ratings: number | undefined;
    cover: string | undefined;
    duration: string | undefined;
    played: number | undefined;
    favorites: number | undefined;
    composers: any;
    lyricists: any;
    directors: any;
    categories: any;
    downloads: string | undefined;
    lyrics: string | undefined;
    detailsRoute: string | undefined;

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

        this.artists = data.artists.map((element: any) => {
            element.id = Utils.getInt(element.id);
            element.name = element.name;
            return element;
        });

        if (data.album) {
            this.album = {
                id: Utils.getInt(data.album.id),
                name: data.album.name
            }
        }

        this.release = Utils.localDate(data.release);
        this.url = data.songUrl;
        this.company = data.company;
        this.thumb = data.songThumb;
        this.ratings = Utils.getFloat(data.songRatings);
        this.cover = data.songCover;
        this.duration = data.songDuration;
        this.played = Utils.getInt(data.played);
        this.favorites = Utils.getInt(data.favorites);

        this.composers = data.composers.map((element: any) => {
            element.id = Utils.getInt(element.id);
            element.name = element.name;
            return element;
        });

        this.lyricists = data.lyricists.map((element: any) => {
            element.id = Utils.getInt(element.id);
            element.name = element.name;
            return element;
        });

        this.directors = data.directors.map((element: any) => {
            element.id = Utils.getInt(element.id);
            element.name = element.name;
            return element;
        });

        if (data.categories) {
            this.categories = data.categories.map((element: any) => {
                element.id = Utils.getInt(element.id);
                element.name = element.name;
                return element;
            });
        }        

        this.downloads = data.songDownloads;
        this.lyrics = data.songLyrics;
        this.detailsRoute = '/app/song/' + this.id + '/details';

        return this;
    }
}