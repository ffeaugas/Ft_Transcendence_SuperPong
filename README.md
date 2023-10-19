# Ft_Transcendence_Super
42 School Project : Last project to validate the cursus - A multiplayer pong game full stack app, with OAuth and Credentials auth, 2Fa, profile customization, socials (friends and real time chat), matchmaking, leaderboard, achievements...

<h2>Frontend</h2>

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"/></a>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"/></a>
<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white"/>

<h2>Backend</h2>

<img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white"/>
<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101"/>
<img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white"/>
<img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"/>

<h2>Deployment</h2>

<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"/>
<img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white"/>


<h1>Journal de bord</h1>

19 Octobre - 19h04 [Franci] : On attend juste Subielo et on fait valider le projet - Il s'est couché à 11h ce matin et vient de se réveiller

<h2>Liste non exhaustive des trucs à améliorer par la suite</h2>

[CLIENT]
- Sortir les fonctions métier des fichiers .tsx, pages comme component, pour les mettres dans des fichiers à part
- Homogénéïser les formulaires (virer formik pour le Register et faire un formulaire React classique)
- Homogénéïser les call API (finir de virer axios, améliorer la gestion d'erreur)
- Rajouter des pop-ups à plusieurs endroits (par exemple lors du setup de la double authentification)
- Optimiser la DB : utiliser des charsets de taille adaptée à la place des strings
- Fragmenter les components trop volumineux (le ProfilEditor par exemple)
- Regrouper les useState en objet quand trop nombreux (ex Chat, ProfileEditor)
- Refactoriser certains composants (le ProfilEditor encore et toujours)
- Revoir le style de l'ensemble du site pour le rendre plus pro + optimisation du css (beaucoup de lignes dupliquées, style de l'ui à homogénéïser)
- Améliorer la responsivité

[SERVER]
- Refactoriser les gros services (channels et users surtout), alléger le nombre d'appels à prisma dans le code en utilisant mieux class-validator, mieux utiliser prisma en règle général
- Séparer les gros services pour avoir plusieurs petits services au sein des modules (exemple service channel => service channel-administration + service channel-creation)
- Mettre à jour la documentation Swagger

[JEU]
- Refactoriser le jeu
- Mieux gérer la fenêtre de jeu, resoudre le glitch secret

[Gros boulot]
- Retirer Socket.io et utiliser uniquement colyseus pour gérer les channels du chat et le status des users en plus du jeu
