import {OutputDto} from './output-dto';
import {InputDto} from './input-dto';

export class TranslationJobDto {
  input: InputDto = new InputDto();
  output: OutputDto = new OutputDto();
}
