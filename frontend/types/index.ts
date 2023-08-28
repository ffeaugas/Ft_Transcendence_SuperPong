/*-------------------------------------------------------------*/
/*                        [CHAT TYPES]                         */
/*-------------------------------------------------------------*/

type ChannelItem = {
  id: string;
  channelName: string;
  owner: string;
};

type Channels = {
  publics: ChannelItem[];
  privates: ChannelItem[];
  protecteds: ChannelItem[];
};

type ChannelDisplay = {
  publicChannels: boolean;
  privateChannels: boolean;
  protectedChannels: boolean;
};

type User = {
  id: string;
  username: string;
  status: UserStatus;
};

type ChannelInfos = {
  channelName: string;
  password?: string;
  mode: ChannelMode;
};

type FeedbackMessage = {
  success: string | undefined;
  failure: string | undefined;
};

type Sender = {
  id: number;
  createdAt: string;
  updatedAt: string;
  role: string;
  username: string;
  status: string;
  user42: boolean;
};

type Message = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  isPrivMessage: boolean;
  senderId: number;
  sender: Sender;
  receiverId?: number;
  receiver?: any;
  channelId?: number;
  Channel?: any;
};

type ProfileDatas = {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  bio: string;
  winCount?: number;
  loseCount?: number;
  profilePicture?: string;
  eloMatchMaking?: number;
  userId: number;
};

// enum MenuType {
//   CHANNEL_SELECTOR = "CHANNEL_SELECTOR",
//   USER_SELECTOR = "USER_SELECTOR",
//   CHANNEL_CREATION = "CHANNEL_CREATION",
//   CHANNEL_ADMINISTRATION = "CHANNEL_ADMINISTRATION",
// }

// enum UserStatus {
//   ONLINE = "ONLINE",
//   OFFLINE = "OFFLINE",
// }

// enum ActiveChannelOption {
//   PRIV_MSG = "PRIV_MSG",
//   CHANNEL = "CHANNEL",
// }
