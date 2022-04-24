export type AirdropEligibilityCriteria = {
  description: string;
};

export type AirdropClaimAction = {
  actionType: string;
  tokenAutodropReceivingChain: string;
  AutodropBlockheight: string;
  AutodropSendingAddress: string;
  action: number;
  desc: string;
  actionURL: string;
  cosmosSDKMessageType: string;
  unlockPercentage: number;
};

export type AirdropCount = {
  count: number;
  totalAirdrops: number;
};

export type AirdropFile = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
};

export type AirdropList = Array<AirdropFile>;

export type Airdrop = {
  project: string;
  projectWebsiteUrl: string;
  eligibilityType: string;
  projectDescription: string;
  chainName: string;
  chainID: string;
  tokenTicker: string;
  tokenIcon: string;
  twitterUrl: string;
  discordUrl: string;
  mediumUrl: string;
  airdropBlogUrl: string;
  airdropStartDate: Date;
  airdropEndDate: Date;
  airdropStatus: string;
  eligibility: string;
  dateStatus: AirdropDateStatus;
  snapshotDate: string;
  snapshotBlockHeight: string;
  eligibilityCriteria: AirdropEligibilityCriteria[];
  eligibilityCheckEndpoint: string;
  unanimousClaim: boolean;
  claimActions: AirdropClaimAction[];
  eligibleTokens: string[];
};

export type selectedAirdropReq = {
  airdrop: Airdrop;
};

export type GitAirdropsListReq = {
  airdropFileName: string;
  checkEligibility: boolean;
  totalAirdrops: number;
};

export enum AirdropDateStatus {
  NOT_ANNOUNCED = "NOT_ANNOUNCED",
  NOT_STARTED = "NOT_STARTED",
  ONGOING = "ONGOING",
  ENDED = "ENDED",
}
