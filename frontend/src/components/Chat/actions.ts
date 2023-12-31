import axios from "axios";

enum ActiveDiscussionType {
  PRIV_MSG = "PRIV_MSG",
  CHANNEL = "CHANNEL",
}

enum RelationType {
  FRIEND = "FRIEND",
  BLOCK = "BLOCK",
}

export async function getMessages(
  activeDiscussionType: ActiveDiscussionType,
  activeDiscussion: string | undefined
): Promise<Message[]> {
  if (activeDiscussionType === ActiveDiscussionType.CHANNEL) {
    try {
      const res = await axios.get(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/channels/messages`,
        {
          params: { channelName: activeDiscussion },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const messages = res.data;
      return messages;
    } catch (error) {
      console.error("Error fetching channel messages", error);
      return [];
    }
  } else {
    try {
      const res = await axios.get(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/message/${activeDiscussion}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const privMessages = res.data;
      return privMessages;
    } catch (error) {
      console.error("Error fetching private messages", error);
      return [];
    }
  }
}

export async function addMessage(
  content: string,
  activeDiscussionType: ActiveDiscussionType,
  activeDiscussion: string | undefined
) {
  let data;
  try {
    if (activeDiscussionType === ActiveDiscussionType.CHANNEL) {
      data = {
        isPrivMessage: false,
        channelName: activeDiscussion,
        content: content,
        receiver: "",
      };
    } else {
      data = {
        isPrivMessage: true,
        channelName: "",
        content: content,
        receiver: activeDiscussion,
      };
    }
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      }
    );
  } catch (error) {
    console.error("Error adding a new message", error);
  }
}

export async function getChannels(): Promise<Channels> {
  try {
    const res = await axios.get(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/channels/all`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const channels = res.data;
    return channels;
  } catch (error) {
    console.error("Error fetching public channel list", error);
    return { privates: [], publics: [], protecteds: [] };
  }
}

export async function getOtherUsers(
  myUsername: string | undefined
): Promise<User[]> {
  try {
    const res = await axios.get(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/all`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const users = res.data;
    return users.filter((user: User) => user.username !== myUsername);
  } catch (error) {
    console.error("Error fetching user list", error);
    return [];
  }
}

export async function getUserInfos(): Promise<User | undefined> {
  try {
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/me`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const user = await res.json();
    return user;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export const isBlocked = (message: Message, blockedUsers: User[]) => {
  if (
    blockedUsers.some(
      (blockedUser) => blockedUser.id == message.senderId.toString()
    )
  )
    return true;
  return false;
};

export function removeBlockedMessages(
  messages: Message[],
  blockedUsers: User[]
) {
  const filtratedMessages = messages.filter((message) => {
    return !isBlocked(message, blockedUsers);
  });
  return filtratedMessages;
}

export async function rejectGameRequest(senderUsername: string) {
  try {
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/deleteGameRequest`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ senderUsername: senderUsername }),
      }
    );
  } catch (error) {
    console.log(error);
  }
  return;
}

export async function getGameRequests(): Promise<Toast[]> {
  try {
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/getGameRequests`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const gameRequests = await res.json();
    return gameRequests;
  } catch (error) {
    console.error("Error fetching game requests", error);
    return [];
  }
}

export async function getFriendRequests() {
  try {
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/getfriendrequests`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const requests = res.json();
    return requests;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function acceptFriendRequest(senderId: string) {
  try {
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/acceptFriendRequest`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ senderId: senderId }),
      }
    );
  } catch (error) {
    console.log(error);
  }
  return;
}

export async function rejectFriendRequest(senderId: string) {
  try {
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/rejectFriendRequest`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ senderId: senderId }),
      }
    );
  } catch (error) {
    console.log(error);
  }
  return;
}

export async function changeRelation(
  relationType: RelationType,
  targetUsername: string
) {
  try {
    const res = await axios.patch(
      `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/changeRelation`,
      {
        targetUsername: targetUsername,
        relationType: relationType,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const profileDatas = res.data;
    return profileDatas;
  } catch (error) {
    console.error("Error fetching profile datas", error);
    return undefined;
  }
}
