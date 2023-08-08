import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json({
      name: "Roger",
      isKickable: true,
      profilePicture: "catProfilePicture.jpg",
    });
  } else {
    res.status(500).json({ message: "Invalid method" });
  }
}
