/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import axios from "axios";
import { useEffect, useState } from "react";
import styles from "@/styles/ProfileEditor/ProfileEditor.module.css";

const USERNAME_MAX_LENGTH: number = 12;
const BIO_MAX_LENGTH: number = 150;

type EditorModes = {
  username: boolean;
  profilePicture: boolean;
  bio: boolean;
};

type EditedDatas = {
  username: string;
  profilePicture?: string;
  bio: string;
};

export default function ProfileEditor() {
  const [createObjectURL, setCreateObjectURL] = useState(undefined);
  const [username, setUsername] = useState<string>("");
  const [profileDatas, setProfileDatas] = useState<ProfileDatas | undefined>(
    undefined
  );
  const [editedDatas, setEditedDatas] = useState<EditedDatas>({
    username: "",
    profilePicture: "",
    bio: "",
  });
  const [datasEditor, setDatasEditor] = useState<EditorModes>({
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
      const profileDatas = res.data;
      return profileDatas;
    } catch (error) {
      console.error("Error fetching profile datas", error);
      return undefined;
    }
  }
  function handleChange(evt: any): void {
    const { name, value } = evt.target;
    if (
      (name === "username" && value.length > USERNAME_MAX_LENGTH) ||
      (name === "bio" && value.length > BIO_MAX_LENGTH)
    )
      return;
    setEditedDatas({
      ...editedDatas,
      [name]: value,
    });
  }

  async function handleChangeUsername(evt: any) {
    evt.preventDefault();
    try {
      const dataBody = {
        oldUsername: username,
        newUsername: editedDatas.username,
      };
      const res = await fetch("http://10.5.0.3:3001/users/update-username", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(dataBody),
      });
      if (res.ok) {
        setUsername(editedDatas.username);
      }
    } catch (error) {}
  }

  async function handleChangeBio(evt: any) {
    evt.preventDefault();
    try {
      const dataBody = {
        username: username,
        bio: editedDatas.bio,
      };
      const res = await fetch("http://10.5.0.3:3001/profiles/update-bio", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(dataBody),
      });
      if (res.ok) {
        setProfileDatas({ ...profileDatas, bio: editedDatas.bio });
      }
    } catch (error) {}
  }

  const uploadToClient = (evt: any) => {
    if (evt.target.files && evt.target.files[0]) {
      const localImage = evt.target.files[0];

      setEditedDatas({ ...editedDatas, profilePicture: localImage });
      setCreateObjectURL(URL.createObjectURL(localImage));
    }
  };

  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append("file", image);
    const response = await fetch("/api/file", {
      method: "POST",
      body,
    });
  };

  useEffect(() => {
    getUsername().then((username) => {
      setUsername(username);
      getProfileDatas(username).then((datas) => {
        setProfileDatas(datas);
      });
    });
  }, []);

  useEffect(() => {
    if (username && profileDatas) {
      setEditedDatas({
        username: username,
        profilePicture: profileDatas.profilePicture,
        bio: profileDatas.bio,
      });
    }
    setDatasEditor({
      username: false,
      profilePicture: false,
      bio: false,
    });
  }, [username, profileDatas]);

  if (!profileDatas) {
    return (
      <section className={`${styles.page}`}>
        <p>...</p>;
      </section>
    );
  }
  return (
    <div className={styles.profileEditor}>
      <div className={styles.editProfile}>
        {datasEditor.username ? (
          <form onSubmit={(evt) => handleChangeUsername(evt)}>
            <input
              type="text"
              name="username"
              value={editedDatas.username}
              onChange={(evt) => handleChange(evt)}
            />
            <button type="submit" className={styles.customButton}>
              update
            </button>
          </form>
        ) : (
          <h2>{editedDatas.username}</h2>
        )}
        <button
          onClick={() =>
            setDatasEditor({
              ...datasEditor,
              username: !datasEditor.username,
            })
          }
        >
          &#9998;
        </button>
      </div>

      <div className={styles.editProfile}>
        {datasEditor.profilePicture ? (
          <div className={styles.imageUploader}>
            {createObjectURL ? (
              <img className={styles.rounded} src={createObjectURL} />
            ) : (
              <img
                className={styles.rounded}
                src={`http://10.5.0.3:3001/uploads/avatar/${profileDatas["profilePicture"]}`}
              />
            )}
            <input
              type="file"
              id="uploadImg"
              name="uploadImg"
              className={styles.imageUploaderInput}
              onChange={uploadToClient}
            />
            <button
              type="submit"
              onClick={uploadToServer}
              className={styles.customButton}
            >
              update
            </button>
          </div>
        ) : (
          <img
            className={styles.rounded}
            src={`http://10.5.0.3:3001/uploads/avatar/${profileDatas["profilePicture"]}`}
          />
        )}
        <button
          onClick={() =>
            setDatasEditor({
              ...datasEditor,
              profilePicture: !datasEditor.profilePicture,
            })
          }
        >
          &#9998;
        </button>
      </div>

      <div className={styles.editProfile}>
        {datasEditor.bio ? (
          <form onSubmit={(evt) => handleChangeBio(evt)}>
            <textarea
              cols={25}
              rows={6}
              name="bio"
              id="bio"
              value={editedDatas.bio}
              onChange={(evt) => handleChange(evt)}
            />
            <button type="submit" className={styles.customButton}>
              update
            </button>
          </form>
        ) : (
          <p>{profileDatas.bio}</p>
        )}
        <button
          onClick={() =>
            setDatasEditor({
              ...datasEditor,
              bio: !datasEditor.bio,
            })
          }
        >
          &#9998;
        </button>
      </div>
      <p>{feedbackMessage}</p>
    </div>
  );
}
