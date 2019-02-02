import { Brewery } from "./brewery";
import { Observable } from "rxjs";

export interface Beer {
    id?: string;
    name: string;
    brewery?: Brewery;
    abv: number;
    ibu: number;
    type: string;
    description: string;
    withBrewery: boolean;
    masterBreweryKey: string;
    icon?: string;
    //searchName: string;
}
