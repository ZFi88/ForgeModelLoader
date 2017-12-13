import {AcceptedJobsDto} from './accepted-jobs-dto';

export class TranslateJobResultDto {
  result: string;
  urn: string;
  acceptedJobs: AcceptedJobsDto;
}
