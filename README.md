# Groupomania
⇢ Présentation :
Créer un réseau social d'entreprise.

⇢ Technologies utilisées :
▹ HTML
▹ CSS
▹ JavaScript
▹ Vue.js
▹ Node.js
▹ Express.js
▹ MySQL
▹ SQL

⇢ Prérequis :
Vous devrez avoir Vue CLI, Node et MySQL installés localement sur votre machine.

⇢ Installation :
Backend :
▹ Clonez ce repository ;
▹ Copiez le fichier .env.example en remplaçant les valeurs par défaut pour accéder à la base de données ;
▹ A partir du dossier backend, exécutez npm install puis nodemon server ;
▹ Le serveur doit fonctionner sur localhost avec le port par défaut 3000 ;


Base de données :
▹ Vérifier que les informations contenues dans le fichier config.json sont correctes et correspondent à votre base de données
▹ Exécutez sequelize model:create --attributes "username:string email:string password:string" --name User pour créer la table des utilisateurs et reproduire la même procédure pour chaque table;
▹ Exécutez sequelize db:migrate pour intégrer les modèles créés dans la base de données ;


Frontend :
▹ A partir du dossier frontend et du sous-dossier vue-groupomania, exécutez npm install puis npm run serve ;
▹ Le frontend de l'application doit fonctionner sur localhost avec le port par défaut 8080.
