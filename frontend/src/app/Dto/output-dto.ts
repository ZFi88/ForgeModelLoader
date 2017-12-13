import {FormatDto} from './format-dto';
import {DestinationDto} from './destination-dto';

export class OutputDto {
  destination: DestinationDto = new DestinationDto();
  formats: FormatDto[] = [];
}
