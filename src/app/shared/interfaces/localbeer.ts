import { Beer } from "./beer";

export interface Localbeer {
    id?: string;
    price?: string;
    local_description?: string;
    beer?: Beer
    beerID: string;
    onDeck?: boolean;
    onSpecial?: boolean;
    soldOut?: boolean;
}
