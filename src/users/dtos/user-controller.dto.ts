export type CreateUserRequestProps = {
  name: string;
  email: string;
  password: string;
  document: string;
  accessLevel: string;
};

export type CreateUserRrequestHeaderProps = {
  companyid: string;
};

export type GetUserAccountRequestHeaders = {
  userId: string;
  companyId: string;
};
