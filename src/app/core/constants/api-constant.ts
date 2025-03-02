//
// API URLs variables

export class ApiConstant {

    // Holds API URL you can replace it.
    public static API_BASE_URL = './app/core/_data/';

    // These are dummy data URLs you can replace with you data.
    public static ALBUMS = ApiConstant.API_BASE_URL + 'albums.json';
    public static ARTISTS = ApiConstant.API_BASE_URL + 'artists.json';
    public static EVENTS = ApiConstant.API_BASE_URL + 'events.json';
    public static GENRES = ApiConstant.API_BASE_URL + 'genres.json';
    public static PLANS = ApiConstant.API_BASE_URL + 'plans.json';
    public static PLAYLISTS = ApiConstant.API_BASE_URL + 'playlists.json';
    public static RADIO = ApiConstant.API_BASE_URL + 'radio.json';
    public static SONGS = ApiConstant.API_BASE_URL + 'songs.json';
    public static API =  window.location.hostname === 'localhost' ? "http://localhost:3001" : "https://api.creatoke.fr"

    public static CATEGORY = ApiConstant.API_BASE_URL + 'category.json';

}
