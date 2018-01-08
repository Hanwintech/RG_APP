import { Attachment } from "./../attachment.model";
import { IntegerKeyValue } from "./../integer-key-value.model";
import { BaseApiSearch } from "./../base-api-search.model";

export class UserLocationInfo {
    public userId: string;
    public latitude: string;
    public longitude: string;
}