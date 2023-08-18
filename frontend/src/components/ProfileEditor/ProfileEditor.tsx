import axios from "axios";
import { useEffect, useState } from "react";
import styles from "@/styles/ProfileEditor/ProfileEditor.module.css";

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

type EditorModes = {
  username: boolean;
  profilePicture: boolean;
  bio: boolean;
};

type EditedDatas = {
  username: string;
  bio: string;
  profilePicture?: string;
};

export default function ProfileEditor() {
  const [username, setUsername] = useState<string>("");
  const [profileDatas, setProfileDatas] = useState<ProfileDatas | undefined>(
    undefined
  );
  const [editedDatas, setEditedDatas] = useState<EditedDatas>({
    username: "",
    bio: "",
    profilePicture: "",
  });
  const [usernameEditor, setUsernameEditor] = useState<EditorModes>({
    username: false,
    profilePicture: false,
    bio: false,
  });
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  async function getUsername(): Promise<string> {
    const res = await fetch("http://10.5.0.3:3001/users/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const user = await res.json();
    return user["username"];
  }

  async function getProfileDatas(
    username: string
  ): Promise<ProfileDatas | undefined> {
    try {
      const res = await axios.get("http://10.5.0.3:3001/profiles", {
        params: { username: username },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(res.data);
      const profileDatas = res.data;
      return profileDatas;
    } catch (error) {
      console.error("Error fetching profile datas", error);
      return undefined;
    }
  }
  function handleChange(evt: any): void {
    const { name, value } = evt.target;
    setEditedDatas({
      ...editedDatas,
      [name]: value,
    });
  }

  async function handleSubmit(evt: any): Promise<void> {
    evt.preventDefault();
    console.log("Change username : ", editedDatas.username);
    try {
      const data = {
        username: editedDatas.username,
        bio: editedDatas.bio,
        profilePicture: editedDatas.profilePicture,
      };
      const res = await fetch("http://10.5.0.3:3001/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setFeedbackMessage("Profile successfully updated !");
      } else {
        setFeedbackMessage("Profile update failed.");
        console.log("NOT OK");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUsername()
      .then((username) => {
        setUsername(username);
        getProfileDatas(username).then((datas) => {
          setProfileDatas(datas);
        });
      })
      .then(() => {
        if (username && profileDatas) {
          editedDatas.username = username;
          editedDatas.bio = profileDatas.bio;
          editedDatas.profilePicture = profileDatas.profilePicture;
        }
      });
  }, []);

  if (!profileDatas) {
    return (
      <section className={`${styles.page}`}>
        <p>...</p>;
      </section>
    );
  }
  return (
    <>
      <form onSubmit={(evt) => handleSubmit(evt)}>
        <input
          className={usernameEditor.username ? styles.hidden : undefined}
          type="text"
          name="username"
          id="username"
          value={editedDatas.username}
          onChange={(evt) => handleChange(evt)}
        />
      </form>
      <h2 className={usernameEditor.username ? undefined : styles.hidden}>
        {editedDatas.username}
      </h2>
      <button
        onClick={() =>
          setUsernameEditor({
            ...usernameEditor,
            username: !usernameEditor.username,
          })
        }
      >
        &#9998;
      </button>
      <img
        className={styles.rounded}
        src={`http://10.5.0.3:3001/uploads/avatar/${profileDatas["profilePicture"]}`}
      />
      <p>"{profileDatas["bio"]}Jojo a pas mis de bio ce looser"</p>
      <p>{feedbackMessage}</p>
    </>
  );
}
