import { NextApiRequest, NextApiResponse } from "next";

import { v4 as uuidv4 } from "uuid";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json({
      messages: [
        {
          id: uuidv4(),
          author: "Joe",
          date: "05-32-1997",
          content: "bzzz bzz ce chat sera super",
        },
        {
          id: uuidv4(),
          author: "Jean-jean",
          date: "05-32-1997",
          content: "bzzz bzz ce chat sera super",
        },
        {
          id: uuidv4(),
          author: "Jack",
          date: "04-01-2007",
          content:
            "Ca fait un bail Jo doubleJo comment ca va mon vieux j'ai pas grand chose a raconter je dois juste ecrire bcp de texte pour tester le format des retours a la ligne",
        },
        {
          id: uuidv4(),
          author: "Jo doubleJo",
          date: "05-32-1997",
          content: "bzzz bzz ce chat sera super",
        },
        {
          id: uuidv4(),
          author: "Joe",
          date: "05-32-1997",
          content: "bzzz bzz ce chat sera super",
        },
        {
          id: uuidv4(),
          author: "Jean-jean",
          date: "05-32-1997",
          content: "bzzz bzz ce chat sera super",
        },
        {
          id: uuidv4(),
          author: "Jack",
          date: "04-01-2007",
          content:
            "Ca fait un bail Jo doubleJo comment ca va mon vieux j'ai pas grand chose a raconter je dois juste ecrire bcp de texte pour tester le format des retours a la ligne",
        },
        {
          id: uuidv4(),
          author: "Jo doubleJo",
          date: "05-32-1997",
          content: "bzzz bzz ce chat sera super",
        },
      ],
      channels: [
        {
          id: uuidv4(),
          channelName: "General",
        },
        {
          id: uuidv4(),
          channelName: "Channel1",
        },
        {
          id: uuidv4(),
          channelName: "Chan2",
        },
        {
          id: uuidv4(),
          channelName: "Taverne",
        },
        {
          id: uuidv4(),
          channelName: "General",
        },
      ],
      users: [
        {
          id: uuidv4(),
          username: "Joe",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Jean-Jean",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Jack",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "DoubleJo",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Joe",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Jean-Jean",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Jack",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "DoubleJo",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Joe",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Jean-Jean",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Jack",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "DoubleJo",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Joe",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Jean-Jean",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Jack",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "DoubleJo",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Joe",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Jean-Jean",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Jack",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "DoubleJo",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Joe",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Jean-Jean",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "Jack",
          profilePicture: "catProfilePicture.jpg",
        },
        {
          id: uuidv4(),
          username: "DoubleJo",
          profilePicture: "catProfilePicture.jpg",
        },
      ],
    });
  } else {
    res.status(500).json({ message: "Invalid method" });
  }
}
