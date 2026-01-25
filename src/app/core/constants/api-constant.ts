//
// API URLs variables

export class ApiConstant {

    // Holds API URL you can replace it.
    public static API_BASE_URL = './app/core/_data/';

    // These are dummy data URLs you can replace with you data.
    public static API =  window.location.hostname === 'localhost' ? "http://localhost:3001" : "https://api.creatoke.fr"

}
