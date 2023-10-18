/*-------------------------------------------------------------*/
/*                        [CHAT TYPES]                         */
/*-------------------------------------------------------------*/

type Toast = {
  id: string;
  sender: User;
  receiver: string;
  roomId: number;
};

type FriendRequest = {
  id: string;
  sender: User;
};

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
  blockedUsers: User[];
  friends: User[];
};

type ChannelInfos = {
  channelName: string;
  password?: string;
  mode: ChannelMode;
  owner?: User;
  adminUsers?: User[];
  invitedUsers?: User[];
  banUsers?: User[];
};

type ChannelAdminFormDatas = {
  password: string;
  channelMode: ChannelMode;
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
  otpEnabled: boolean;
};

type EditorModes = {
  username: boolean;
  profilePicture: boolean;
  bio: boolean;
};

type EditedDatas = {
  username: string;
  profilePicture?: string;
  bio: string;
  code2fa: string;
};
