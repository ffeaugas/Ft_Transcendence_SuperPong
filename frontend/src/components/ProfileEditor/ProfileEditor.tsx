/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import axios from "axios";
import { useEffect, useState } from "react";
import styles from "@/styles/ProfileEditor/ProfileEditor.module.css";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/GlobalRedux/store";
import { useSelector, useDispatch } from "react-redux";
import { setUsername } from "@/app/GlobalRedux/Features/user/userSlice";
import BlockedList from "../BlockedList/BlockedList";

const USERNAME_MAX_LENGTH: number = 12;
const BIO_MAX_LENGTH: number = 150;

export default function ProfileEditor() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [objectURL, setObjectURL] = useState<any | undefined>(undefined);
    const [objectFile, setObjectFile] = useState<any | undefined>(undefined);
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
    const username = useSelector((state: RootState) => state.user.username);

    async function getProfileDatas(
        username: string
    ): Promise<ProfileDatas | undefined> {
        try {
            const res = await fetch(
                `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/profiles?username=${username}`,
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            const profileDatas = await res.json();
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
            const res = await fetch(
                `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/update-username`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                    body: JSON.stringify(dataBody),
                }
            );
            if (res.ok) {
                dispatch(setUsername(editedDatas.username));
                router.push(`/profile/${editedDatas.username}`);
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
            const res = await fetch(
                `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/profiles/update-bio`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                    body: JSON.stringify(dataBody),
                }
            );
            if (res.ok) {
                setProfileDatas({ ...profileDatas, bio: editedDatas.bio });
            }
        } catch (error) {}
    }

    const uploadToClient = (evt: any) => {
        if (evt.target.files && evt.target.files[0]) {
            const localImage = evt.target.files[0];

            setEditedDatas({ ...editedDatas, profilePicture: localImage });
            setObjectURL(URL.createObjectURL(localImage));
        }
    };

    const uploadToServer = async () => {
        const body = new FormData();
        body.append("file", image);
        const response = await fetch("/api/file", {
            method: "POST",
            body,
        });
    };

    useEffect(() => {
        if (username) {
            getProfileDatas(username).then((datas) => {
                console.log(datas);
                setProfileDatas(datas);
            });
        }
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
                            <img
                                className={styles.rounded}
                                src={createObjectURL}
                            />
                        ) : (
                            <img
                                className={styles.rounded}
                                src={`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/uploads/avatar/${profileDatas.profilePicture}`}
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
                        src={`http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/uploads/avatar/${profileDatas.profilePicture}`}
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
                    <p>"{profileDatas.bio}"</p>
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
            <BlockedList />
            <p>{feedbackMessage}</p>
        </div>
    );
}
