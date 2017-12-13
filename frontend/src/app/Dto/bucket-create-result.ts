export class BucketCreateResult {
  bucketKey: string;
  bucketOwner: string;
  createdDate: number;
  permissions: Permission;
  policyKey: string;
}

export class Permission {
  authId: string;
  access: string;
}
