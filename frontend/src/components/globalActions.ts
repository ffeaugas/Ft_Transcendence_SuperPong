import axios from "axios";

export async function getProfileDatas(
  username: string | undefined
): Promise<ProfileDatas | undefined> {
  if (username) {
    try {
      const res = await axios.get(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/profiles`,
        {
          params: { username: username },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const profileDatas = res.data;
      return profileDatas.profilePicture;
    } catch (error) {
      console.error("Error fetching profile datas", error);
      return undefined;
    }
  }
}
