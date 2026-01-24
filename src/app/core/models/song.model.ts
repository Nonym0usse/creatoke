// song.model.ts
export type YesNo = "oui" | "non";

export interface Song {
    id: string;
    title: string;
    artist: string;

    lyrics?: string | null;
    description: string;

    price_base?: number | string | null;
    price_premium?: number | string | null;
    price_base_creatoke?: number | string | null;
    price_premium_creatoke?: number | string | null;

    exclu?: YesNo | boolean | null;

    image?: string | null;
    slug: string;
    category: string;

    created_at?: string | Date | null;

    youtubeURL?: string | null;
    spotifyURL?: string | null;

    creatoke?: string | null;

    // fichiers / urls de fichiers
    chanson_wav?: string | File | null;
    creatoke_wav?: string | File | null;
    chanson_mp3?: string | File | null;
    creatoke_mp3?: string | File | null;

    url?: string | null;

    // flags (tu utilises "non" par défaut dans le form)
    isLicenceBase: YesNo;
    isPremium: YesNo;
    isLicenceBaseCreatoke: YesNo;
    isPremiumCreatoke: YesNo;
    isHeartStroke: YesNo;

    message?: string | null;
    ratings?: number | null;
    played: number | null;
}