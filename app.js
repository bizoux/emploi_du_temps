var express = require("express");
var app = express();
var port = 3000;
const { startOfMonth, addDays, eachDayOfInterval, getDay } = require('date-fns');
const axios = require('axios');
var mysql = require("mysql");
var cors = require("cors");
const multer = require('multer');
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const nodemailer = require('nodemailer');
const notifier = require('node-notifier');
const path = require("path");
const { google } = require('googleapis');
const { isGeneratorFunction } = require("util/types");
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));



var db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"emploi_du_temps"
});



// CONNEXION AU BASE DE DONNEES 1
// var db = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"jwfampirantiana"
// });
// Configurer Socket.IO pour gérer les connexions
// io.on('connection', (socket) => {
//     console.log('Un utilisateur est connecté');
  
//     socket.on('disconnect', () => {
//       console.log('Un utilisateur est déconnecté');
//     });
//   });
// CONNEXION AU BASE DE DONNEES 1

db.connect(function(err){
    if(err)
    {
        console.log("Echec de connection au base de données1");
    }
    else
    {
        console.log("Connection au base de données avec succès!\n");
        }
});




// DEBUT EMPLOIS DU TEMPS

// app.get('/timetable', (req, res) => {
//  const query = "SELECT date.Date, date.HeureDeb, date.HeureFin, enseignant.Prenom, salle.NumSalle, cours.Libelle,niveau.NomNiveau,parcour.NomParcour from emploidutemps,date,salle,enseignant,cours,enseigner,niveau,parcour where(emploidutemps.idCours=cours.idCours) and (emploidutemps.IDENS=enseignant.IDENS) and (emploidutemps.NumSalle=salle.NumSalle) and (emploidutemps.idDate=date.idDate) and (enseigner.id_niveau=niveau.id_niveau) and (enseigner.id_parcour=parcour.id_parcour) ORDER BY niveau.NomNiveau,date.Date, date.HeureDeb";
//     db.query(query, (err, results) => {
//         if (err) throw err;
//         res.status(200).json(results);
//     });
// });

app.get('/timetable', (req, res) => {
    const query = `
      SELECT 
        date.Date, 
        date.HeureDeb, 
        date.HeureFin, 
        enseignant.Prenom, 
        salle.NumSalle, 
        cours.Libelle, 
        niveau.NomNiveau, 
        parcour.NomParcour
      FROM 
        date
      LEFT JOIN emploidutemps ON date.idDate = emploidutemps.idDate
      LEFT JOIN enseignant ON emploidutemps.IDENS = enseignant.IDENS
      LEFT JOIN salle ON emploidutemps.NumSalle = salle.NumSalle
      LEFT JOIN cours ON emploidutemps.idCours = cours.idCours
      LEFT JOIN enseigner ON (emploidutemps.IDENS = enseigner.idEns AND emploidutemps.idCours = enseigner.idCours)
      LEFT JOIN niveau ON enseigner.id_niveau = niveau.id_niveau
      LEFT JOIN parcour ON enseigner.id_parcour = parcour.id_parcour
      ORDER BY niveau.NomNiveau, date.Date, date.HeureDeb
    `;
  
    db.query(query, (err, results) => {
      if (err) throw err;
      res.status(200).json(results);
    });
  });
  



app.post('/generate-timetable', (req, res) => {
    const { startDate } = req.body;

    const times = [
        { heuredeb: '07:00', heureFin: '09:00' },
        { heuredeb: '09:00', heureFin: '10:00' },
        { heuredeb: '10:00', heureFin: '12:00' },
        { heuredeb: '13:00', heureFin: '14:00' },
        { heuredeb: '14:00', heureFin: '16:00' },
        { heuredeb: '16:00', heureFin: '17:00' }
    ];

    const days = 5;

    const disponibilitesEnseignants = {
        "Christian": [
            { jour: 'lundi', heuredeb: '07:00', heureFin: '09:00' },
            { jour: 'lundi', heuredeb: '13:00', heureFin: '14:00' },
            { jour: 'mardi', heuredeb: '13:00', heureFin: '14:00' },
            { jour: 'mardi', heuredeb: '07:00', heureFin: '09:00' },
            { jour: 'mercredi', heuredeb: '13:00', heureFin: '14:00' },
            { jour: 'jeudi', heuredeb: '13:00', heureFin: '14:00' },
            { jour: 'jeudi', heuredeb: '16:00', heureFin: '17:00' },

            
        ],
        "Siaka": [
            { jour: 'lundi', heuredeb: '14:00', heureFin: '16:00' },
            { jour: 'lundi', heuredeb: '16:00', heureFin: '17:00' },
            { jour: 'mardi', heuredeb: '09:00', heureFin: '10:00' },
            { jour: 'mardi', heuredeb: '16:00', heureFin: '17:00' },    
        ],
        "Hajarisena": [
            { jour: 'vendredi', heuredeb: '07:00', heureFin: '09:00' },
            { jour: 'mercredi', heuredeb: '10:00', heureFin: '12:00' },
            { jour: 'mercredi', heuredeb: '16:00', heureFin: '17:00' },
                
        ],
        "Cyprien": [
            { jour: 'vendredi', heuredeb: '07:00', heureFin: '09:00' },
            { jour: 'mercredi', heuredeb: '07:00', heureFin: '09:00' },
                
        ],
        "Bertin": [
            { jour: 'vendredi', heuredeb: '07:00', heureFin: '09:00' },
            { jour: 'mercredi', heuredeb: '07:00', heureFin: '09:00' },
                
        ],
    };

    const niveaux = ["L1", "L2","L3", "M1", "M2"]; // Les niveaux concernés
    const parcours = ["5", "6", "7"]; // Les niveaux concernés

    // Fonction pour vérifier si un enseignant est disponible pour un créneau donné
    function estDisponible(disponibilites, jour, heuredeb, heureFin) {
        return disponibilites.some(d => d.jour === jour && heuredeb >= d.heuredeb && heureFin <= d.heureFin);
    }

    function trouverCreneauLibre(enseignantPrenom, jour, creneauxDefinis, niveau) {
        for (const time of times) {
            const enseignantKey = `${enseignantPrenom}-${jour}-${time.heuredeb}-${time.heureFin}`;
    
            const conflitTrouve = Object.keys(enseignantOccupation).some(key => 
                key.startsWith(`${enseignantPrenom}-${jour}-${time.heuredeb}-${time.heureFin}-`) && !key.endsWith(`-${niveau}`)
            );
    
            if (!creneauxDefinis.has(enseignantKey) && !conflitTrouve) {
                return time;
            }
        }
        return null;
    }

    // Suivi de l'occupation des enseignants par créneau horaire et niveau
    const enseignantOccupation = {};

    niveaux.forEach(niveau => {
        // Requête pour récupérer les matières enseignées pour chaque enseignant, niveau et parcours depuis la table `enseigner`
        db.query(`SELECT * FROM enseigner 
                  INNER JOIN cours ON enseigner.idCours = cours.idCours
                  WHERE enseigner.id_niveau = (SELECT id_niveau FROM niveau WHERE NomNiveau = "${niveau}") and enseigner.id_parcour="${parcours}"`, (err, enseignements) => {
            if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des matières enseignées' });

            // Mapper les volumes horaires des cours enseignés
            const volumeHoraireMap = {};
            enseignements.forEach(e => {
                volumeHoraireMap[e.idCours] = e.volumeHoraire;
            });
            
            db.query('SELECT * FROM enseignant', (err, enseignants) => {
                if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des enseignants' });

                db.query('SELECT * FROM salle', (err, salles) => {
                    if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des salles' });

                    const volumeHoraireAttribue = {};
                    enseignants.forEach(enseignant => {
                        const enseignementsEnseignant = enseignements.filter(e => e.idEns === enseignant.idEns);
                        volumeHoraireAttribue[enseignant.Prenom] = enseignementsEnseignant.map(e => ({
                            id: e.idCours,
                            id_parcour: e.id_parcour,
                            volumeHoraire: volumeHoraireMap[e.idCours] || 0,
                            heuresAttribuees: 0
                        }));
                    });


                    // console.log(volumeHoraireAttribue);

                    let date = new Date(startDate);
                    let salleIdx = 0;

                    for (let i = 0; i < days; i++) {
                        const dayName = date.toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase();
                        const creneauxDefinis = new Set();

                        times.forEach(time => {
                            let aUnCoursProgramme = false;

                            enseignants.forEach(enseignant => {
                                const disponibilites = disponibilitesEnseignants[enseignant.Prenom];
                                const matieres = volumeHoraireAttribue[enseignant.Prenom];

                                if (disponibilites && estDisponible(disponibilites, dayName, time.heuredeb, time.heureFin)) {
                                    let coursNom = null;

                                    for (const matiere of matieres) {
                                        if (matiere.heuresAttribuees < matiere.volumeHoraire) {
                                            coursNom = matiere.id;
                                            matiere.heuresAttribuees += 1.5;
                                            break;
                                        }
                                        console.log(matiere.heuresAttribuees);
                                        console.log(matiere.volumeHoraire);
                                    }
                                    



                                    if (coursNom) {
                                        const enseignantKey = `${enseignant.Prenom}-${dayName}-${time.heuredeb}-${time.heureFin}-${niveau}`;

                                        const conflitTrouve = Object.keys(enseignantOccupation).some(key => {
                                            return key.startsWith(`${enseignant.Prenom}-${dayName}-${time.heuredeb}-${time.heureFin}-`) && !key.endsWith(`-${niveau}`);
                                        });
                                        
                                        const salle = salles[salleIdx];

                                        if (!conflitTrouve) {
                                            enseignantOccupation[enseignantKey] = true;

                                            const insertDateQuery = `INSERT INTO Date (Heuredeb, HeureFin, Date) VALUES ('${time.heuredeb}', '${time.heureFin}', '${date.toISOString().split('T')[0]}')`;

                                            db.query(insertDateQuery, (err, result) => {
                                                if (err) throw err;

                                                const idDate = result.insertId;
                                                const insertEmpQuery = `
                                                    INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
                                                    VALUES ('${coursNom}', ${enseignant.idEns}, '${salle.NumSalle}', ${idDate})
                                                `;
                                                db.query(insertEmpQuery, (err) => {
                                                    if (err) throw err;
                                                    console.log(`Ajouté à l'emploi du temps: Cours: ${coursNom}, Enseignant: ${enseignant.Prenom}, Salle: ${salle.NumSalle}`);
                                                });
                                            });

                                            salleIdx = (salleIdx + 1) % salles.length;
                                            aUnCoursProgramme = true;
                                            creneauxDefinis.add(enseignantKey);
                                        } else {
                                            console.log(`Conflit détecté pour ${enseignant.Prenom} à ${niveau} le ${date.toISOString().split('T')[0]} de ${time.heuredeb} à ${time.heureFin}`);

                                            const autreCreneau = trouverCreneauLibre(enseignant.Prenom, dayName, creneauxDefinis);
                                            if (autreCreneau) {
                                                const insertDateQuery = `INSERT INTO Date (Heuredeb, HeureFin, Date) VALUES ('${autreCreneau.heuredeb}', '${autreCreneau.heureFin}', '${date.toISOString().split('T')[0]}')`;

                                                db.query(insertDateQuery, (err, result) => {
                                                    if (err) throw err;

                                                    const idDate = result.insertId;
                                                    const insertEmpQuery = `
                                                        INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
                                                        VALUES ('${coursNom}', ${enseignant.idEns}, '${salle.NumSalle}', ${idDate})
                                                    `;
                                                    db.query(insertEmpQuery, (err) => {
                                                        if (err) throw err;
                                                        console.log(`Ajouté à un créneau libre: Cours: ${coursNom}, Enseignant: ${enseignant.Prenom}, Salle: ${salle.NumSalle}`);
                                                    });
                                                });

                                                salleIdx = (salleIdx + 1) % salles.length;
                                                aUnCoursProgramme = true;
                                                creneauxDefinis.add(`${enseignant.Prenom}-${dayName}-${autreCreneau.heuredeb}-${autreCreneau.heureFin}`);
                                            }
                                        }
                                    }
                                }
                            });

                            // Insertion d'un créneau sans cours
                            if (!aUnCoursProgramme) {
                                const insertDateQuery = `INSERT INTO Date (Heuredeb, HeureFin, Date) VALUES ('${time.heuredeb}', '${time.heureFin}', '${date.toISOString().split('T')[0]}')`;
                                db.query(insertDateQuery, (err, result) => {
                                    if (err) throw err;

                                    const idDate = result.insertId;
                                    const insertEmptyEmpQuery = `
                                        INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
                                        VALUES (NULL, NULL, NULL, ${idDate})
                                    `;
                                    db.query(insertEmptyEmpQuery, (err) => {
                                        if (err) throw err;
                                        console.log(`Créneau vide ajouté: ${date.toISOString().split('T')[0]} de ${time.heuredeb} à ${time.heureFin}`);
                                    });
                                });
                            }
                        });

                        date.setDate(date.getDate() + 1);
                    }
                });
            });
        });
    });

    res.status(200).json({ message: 'Emploi du temps généré avec succès.' });

});


// MANDEHA TSARA EMPLOI DU TEMPS DU NIVEAU L1 ET L2

// app.post('/generate-timetable', (req, res) => {
//     const { startDate } = req.body;
//     const times = [
//         { heuredeb: '07:00', heureFin: '09:00' },
//         { heuredeb: '09:00', heureFin: '10:00' },
//         { heuredeb: '10:00', heureFin: '12:00' },
//         { heuredeb: '13:00', heureFin: '14:00' },
//         { heuredeb: '14:00', heureFin: '16:00' },
//         { heuredeb: '16:00', heureFin: '17:00' }
//     ];
//     const days = 5;

//     const disponibilitesEnseignants = {
//         "Christian": [
//             { jour: 'lundi', heuredeb: '07:00', heureFin: '09:00' },
//             { jour: 'lundi', heuredeb: '13:00', heureFin: '14:00' },
//             { jour: 'mardi', heuredeb: '09:00', heureFin: '10:00' },
//         ],
//         "Siaka": [
//             { jour: 'lundi', heuredeb: '07:00', heureFin: '09:00' },
//             { jour: 'mercredi', heuredeb: '14:00', heureFin: '17:00' }
//         ],
//         "Michel": [
//             { jour: 'lundi', heuredeb: '13:00', heureFin: '14:00' },
//             { jour: 'vendredi', heuredeb: '09:00', heureFin: '10:00' },
//             { jour: 'jeudi', heuredeb: '10:00', heureFin: '12:00' }
//         ],
//         "Andry": [
//             { jour: 'vendredi', heuredeb: '10:00', heureFin: '12:00' },
//             { jour: 'jeudi', heuredeb: '09:00', heureFin: '10:00' }
//         ],
//         "Haja": [
//             { jour: 'vendredi', heuredeb: '09:00', heureFin: '10:00' },
//             { jour: 'vendredi', heuredeb: '10:00', heureFin: '12:00' },
//             { jour: 'jeudi', heuredeb: '10:00', heureFin: '12:00' },
//             { jour: 'jeudi', heuredeb: '09:00', heureFin: '10:00' }
//         ],
//         "Benedicte": [
//             { jour: 'mercredi', heuredeb: '14:00', heureFin: '17:00' },
//             { jour: 'vendredi', heuredeb: '10:00', heureFin: '12:00' },
//             { jour: 'jeudi', heuredeb: '10:00', heureFin: '12:00' },
//             { jour: 'jeudi', heuredeb: '09:00', heureFin: '10:00' }
//         ],
//         "Fontaine": [
//             { jour: 'mercredi', heuredeb: '14:00', heureFin: '16:00' }
//         ],
//     };

//     const matieresEnseignees = {
//         "Christian": ["3", "19", "18", "25"],
//         "Siaka": ["12"],
//         "Michel": ["15", "16"],
//         "Andry": ["21"],
//         "Haja": ["13", "4"],
//         "Benedicte": ["23"],
//         "Fontaine":["11"]
//     };

//     const niveaux = ["L1", "L2"];
//     Pour gérer L1 et L2

//     niveaux.forEach((niveau) => {
//         db.query(`SELECT * FROM cours WHERE NomSemestre = "impair" AND Niveau = "${niveau}"`, (err, cours) => {
//             if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des cours' });

//             const volumeHoraireMap = {};
//             cours.forEach(c => {
//                 volumeHoraireMap[c.idCours] = c.volumeHoraire;
//             });

//             db.query('SELECT * FROM enseignant', (err, enseignants) => {
//                 if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des enseignants' });

//                 db.query('SELECT * FROM salle', (err, salles) => {
//                     if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des salles' });

//                     const volumeHoraireAttribue = {};
//                     enseignants.forEach(enseignant => {
//                         const matieres = matieresEnseignees[enseignant.Prenom] || [];
//                         volumeHoraireAttribue[enseignant.Prenom] = matieres.map(idMatiere => ({
//                             id: idMatiere,
//                             volumeHoraire: volumeHoraireMap[idMatiere] || 0,
//                             heuresAttribuees: 0
//                         }));
//                     });

//                     let date = new Date(startDate);
//                     let salleIdx = 0;

//                     for (let i = 0; i < days; i++) {
//                         const dayName = date.toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase();

//                         times.forEach(time => {
//                             let enseignantsDispos = enseignants.filter(enseignant => {
//                                 const dispo = disponibilitesEnseignants[enseignant.Prenom];
//                                 return dispo && dispo.some(d => d.jour === dayName && time.heuredeb >= d.heuredeb && time.heureFin <= d.heureFin);
//                             });

//                             if (enseignantsDispos.length > 0) {
//                                 const salle = salles[salleIdx];
//                                 enseignantsDispos.forEach(enseignantDispo => {
//                                     const matieres = volumeHoraireAttribue[enseignantDispo.Prenom];
//                                     let coursNom = null;

//                                     for (const matiere of matieres) {
//                                         if (matiere.heuresAttribuees < matiere.volumeHoraire) {
//                                             coursNom = matiere.id;
//                                             matiere.heuresAttribuees += 1.5;
//                                             break;
//                                         }
//                                     }

//                                     if (coursNom) {
//                                         const insertDateQuery = `INSERT INTO Date (heuredeb, heureFin, Date) VALUES ('${time.heuredeb}', '${time.heureFin}', '${date.toISOString().split('T')[0]}')`;
//                                         db.query(insertDateQuery, (err, result) => {
//                                             if (err) throw err;

//                                             const idDate = result.insertId;

//                                             const insertEmpQuery = `
//                                                 INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
//                                                 VALUES ('${coursNom}', ${enseignantDispo.idEns}, '${salle.NumSalle}', ${idDate})
//                                             `;
//                                             db.query(insertEmpQuery, (err) => {
//                                                 if (err) throw err;
//                                             });
//                                         });
//                                     }
//                                 });

//                                 salleIdx++;
//                                 if (salleIdx >= salles.length) {
//                                     salleIdx = 0;
//                                 }
//                             }
//                         });

//                         date.setDate(date.getDate() + 1);
//                     }

//                     if (niveau === "L2") {
//                         res.status(200).json({ message: 'Emploi du temps généré avec succès pour L1 et L2' });
//                     }
//                 });
//             });
//         });
//     });
// });
























// app.post('/generate-timetable', (req, res) => {
//     const { startDate } = req.body;
//     const times = [
//         { heuredeb: '07:30', heureFin: '09:00' },
//         { heuredeb: '09:00', heureFin: '10:30' },
//         { heuredeb: '10:30', heureFin: '12:00' },
//         { heuredeb: '13:30', heureFin: '15:00' },
//         { heuredeb: '15:00', heureFin: '16:30' },
//         { heuredeb: '16:30', heureFin: '18:00' }
//     ];
//     const days = 5;
//     let date = new Date(startDate);

//     for (let i = 0; i < days; i++) {
//         times.forEach(time => {
//             Utilisation de requêtes paramétrées pour éviter les injections SQL
//             const insertDateQuery = `INSERT INTO Date (Date, HeureDeb, HeureFin) VALUES (?, ?, ?)`;
//             const queryValues = [date.toISOString().split('T')[0], time.heuredeb, time.heureFin];

//             db.query(insertDateQuery, queryValues, (err, result) => {
//                 if (err) {
//                     console.error("Erreur lors de l'insertion dans la table Date:", err);
//                     res.status(500).send('Erreur lors de la génération de l\'emploi du temps');
//                     return;
//                 }
//             });
//         });

//         Avance d'un jour dans la semaine
//         date.setDate(date.getDate() + 1);
//     }

//     res.status(200).send('Emploi du temps généré avec succès');
// });

                                       
                                    

                                   
                               
                            
             



















// FIN EMPLOIS DU TEMPS





// Algorithme simplifié pour générer un emploi du temps
// function generateTimetable() {
//     const courses = ['Math', 'Physics', 'Chemistry', 'Biology'];
//     const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//     const timeslots = ['08:00:00', '10:15:00', '13:00:00', '15:15:00'];
//     const scheduleEntries = [];

//     days.forEach(day => {
//         timeslots.forEach((start_time, index) => {
//             const course = courses[index % courses.length];
//             const end_time = calculateEndTime(start_time);
//             scheduleEntries.push([course, day, start_time, end_time]);
//         });
//     });

//     const insertQuery = `
//         INSERT INTO schedule (course_name, day, start_time, end_time)
//         VALUES ?
//     `;

//     db.query(insertQuery, [scheduleEntries], (err, result) => {
//         if (err) throw err;
//         console.log('Emploi du temps généré avec succès');
//     });
// }

// Calcul de l'heure de fin du cours
// function calculateEndTime(startTime) {
//     const [hours, minutes, seconds] = startTime.split(':').map(Number);
//     const endHours = hours + 2;
//     return `${endHours}:${minutes}:${seconds}`;
// }

// Route API pour obtenir l'emploi du temps
// app.get('/api/schedule', (req, res) => {
//     const query = 'SELECT * FROM schedule';
//     db.query(query, (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         res.json(results);
//     });
// });

// Générer l'emploi du temps au démarrage du serveur
// generateTimetable();




// ----------------------  TABLE EMPLOIS DU TEMPS ---------------------





            //  Définir les disponibilités des enseignants directement dans le code
            // const disponibilites = [
//     { idEns: 1, jour: 'Lundi', heuredeb: '08:00', heurefin: '12:00' },
//     { idEns: 1, jour: 'Mardi', heuredeb: '09:00', heurefin: '11:00' },
//     { idEns: 2, jour: 'Lundi', heuredeb: '10:00', heurefin: '14:00' },
//     { idEns: 2, jour: 'Mardi', heuredeb: '08:00', heurefin: '12:00' }
            // ];

            // API pour générer l'emploi du temps
            // app.post('/generate-timetable', (req, res) => {
//     const { startDate } = req.body;  Date de départ choisie par l'utilisateur
//     const times = [ Créneaux horaires
//         { heuredeb: '07:30', heureFin: '09:00' },
//         { heuredeb: '09:00', heureFin: '10:30' },
//         { heuredeb: '10:30', heureFin: '12:00' },
//         { heuredeb: '13:00', heureFin: '14:30' },
//         { heuredeb: '14:30', heureFin: '16:00' }
//     ];
//     const days = 5;  Générer sur 5 jours

//     db.query('SELECT * FROM cours', (err, cours) => {
//         if (err) throw err;
//         db.query('SELECT * FROM enseignant', (err, enseignants) => {
//             if (err) throw err;
//             db.query('SELECT * FROM salle', (err, salles) => {
//                 if (err) throw err;

//                 let date = new Date(startDate);
//                 let empCounter = 0;

//                 for (let i = 0; i < days; i++) { Pour chaque jour
//                     const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });

//                     times.forEach(time => {
//                          Filtrer les enseignants disponibles pour le jour et l'horaire
//                         const enseignantsDisponibles = enseignants.filter(ens => {
//                             return disponibilites.some(dispo =>
//                                 dispo.idEns === ens.idEns &&
//                                 dispo.jour === dayName &&
//                                 dispo.heuredeb <= time.heuredeb &&
//                                 dispo.heurefin >= time.heureFin
//                             );
//                         });

//                         if (enseignantsDisponibles.length > 0) {
//                             const coursIdx = empCounter % cours.length;
//                             const salleIdx = empCounter % salles.length;
//                             const ensIdx = empCounter % enseignantsDisponibles.length;

//                              Insertion dans la table `Date`
//                             const insertDateQuery = `
//                                 INSERT INTO Date (Date, heuredeb, heureFin) 
//                                 VALUES ('${date.toISOString().split('T')[0]}','${time.heuredeb}', '${time.heureFin}')`;
                            
//                             db.query(insertDateQuery, (err, result) => {
//                                 if (err) throw err;

//                                 const idDate = result.insertId;

//                                  Insertion dans la table `emploidutemps`
//                                 const insertEmpQuery = `
//                                     INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate) 
//                                     VALUES (${cours[coursIdx].idCours}, ${enseignantsDisponibles[ensIdx].idEns}, '${salles[salleIdx].NumSalle}', ${idDate})`;
//                                 db.query(insertEmpQuery, (err) => {
//                                     if (err) throw err;
//                                 });
//                             });

//                             empCounter++;
//                         }
//                     });

//                     date.setDate(date.getDate() + 1); Passer au jour suivant
//                 }

//                 res.status(200).json({ message: 'Emploi du temps généré avec succès' });
//             });
//         });
//     });
            // });







// ----------------------  FIN TABLE EMPLOIS DU TEMPS ---------------------



// app.post('/generate-timetable', (req, res) => {
//     const { startDate } = req.body;
    
//     const disponibilites = [
//         { idEns: 1, date: '2024-09-11', heuredeb: '07:30', heureFin: '09:00' },
//         { idEns: 2, date: '2024-09-11', heuredeb: '09:00', heureFin: '10:30' }
//     ];

//     const times = [
//         { heuredeb: '07:30', heureFin: '09:00' },
//         { heuredeb: '09:00', heureFin: '10:30' },
//         { heuredeb: '10:30', heureFin: '12:00' },
//         { heuredeb: '13:00', heureFin: '14:30' },
//         { heuredeb: '14:30', heureFin: '16:00' },
//         { heuredeb: '16:00', heureFin: '17:30' }
//     ];

//     const days = 5;  Générer pour 5 jours

//     db.query('SELECT * FROM cours', (err, cours) => {
//         if (err) throw err;
//         db.query('SELECT * FROM enseignant', (err, enseignants) => {
//             if (err) throw err;
//             db.query('SELECT * FROM salle', (err, salles) => {
//                 if (err) throw err;

//                 let date = new Date(startDate);
//                 let empCounter = 0;

//                 for (let i = 0; i < days; i++) { Pour chaque jour de la semaine
//                     times.forEach(time => {
//                         const coursIdx = empCounter % cours.length;
//                         const availableEnseignants = enseignants.filter(ens => {
//                             return disponibilites.some(d => 
//                                 d.idEns === ens.idEns && 
//                                 d.date === date.toISOString().split('T')[0] &&
//                                 d.heuredeb <= time.heuredeb &&
//                                 d.heureFin >= time.heureFin
//                             );
//                         });

//                         if (availableEnseignants.length === 0) {
//                             throw new Error('Aucun enseignant disponible pour cette plage horaire.');
//                         }

//                         const ensIdx = empCounter % availableEnseignants.length;
//                         const selectedEnseignant = availableEnseignants[ensIdx];

//                         Insertion dans la table `Date`
//                         const insertDateQuery = `INSERT INTO Date (heuredeb, heureFin, Date) VALUES ('${time.heuredeb}', '${time.heureFin}', '${date.toISOString().split('T')[0]}')`;
//                         db.query(insertDateQuery, (err, result) => {
//                             if (err) throw err;

//                             const idDate = result.insertId;

//                             Insertion dans la table `emploidutemps`
//                             const insertEmpQuery = `
//                                 INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
//                                 VALUES (${cours[coursIdx].idCours}, ${selectedEnseignant.idEns}, '${salles[empCounter % salles.length].NumSalle}', ${idDate})
//                             `;
//                             db.query(insertEmpQuery, (err) => {
//                                 if (err) throw err;
//                             });
//                         });

//                         empCounter++;
//                     });
//                     date.setDate(date.getDate() + 1);  Passer au jour suivant
//                 }

//                 res.status(200).json({ message: 'Emploi du temps généré avec succès' });
//             });
//         });
//     });
// });












                                // EMPLOI DU TEMPS

                                // app.get('/timetable', (req, res) => {
                                //     const query = "select date.Date,date.heuredeb,date.heurefin,enseignant.Prenom,cours.Libelle,cours.Niveau,cours.Parcours,salle.NumSalle from emploidutemps,cours,enseignant,salle,date where(emploidutemps.idCours=cours.idCours) and (emploidutemps.idEns=enseignant.idEns) and (emploidutemps.NumSalle=salle.NumSalle) and (emploidutemps.idDate=date.idDate) order by date.Date,heuredeb";
                                    

                                //     const query = "SELECT date.Date, date.heuredeb, date.heurefin, enseignant.Prenom, cours.Libelle, cours.Niveau, cours.Parcours, salle.NumSalle FROM emploidutemps JOIN cours ON emploidutemps.idCours = cours.idCours JOIN enseignant ON emploidutemps.idEns = enseignant.idEnsJOIN salle ON emploidutemps.NumSalle = salle.NumSalle JOIN date ON emploidutemps.idDate = date.idDate ORDER BY date.Date, date.heuredeb;"


                                //     db.query(query, (err, results) => {
                                //         if (err) throw err;
                                //         res.status(200).json(results);
                                //     });
                                // });
                                

                                // API pour générer l'emploi du temps
                                // app.post('/generate-timetable', (req, res) => {
                                //     const { startDate } = req.body;
                                //     const times = [
                                //         { heuredeb: '07:30', heureFin: '09:00' },
                                //         { heuredeb: '09:00', heureFin: '10:30' },
                                //         { heuredeb: '10:30', heureFin: '12:00' },
                                //         { heuredeb: '13:00', heureFin: '14:30' },
                                //         { heuredeb: '14:30', heureFin: '16:00' },
                                //         { heuredeb: '16:00', heureFin: '17:30' }
                                //     ];
                                //     const days = 5; 
                                //     Générer pour 5 jours 
                                
                                //     db.query('SELECT * FROM cours', (err, cours) => {
                                //         if (err) throw err;
                                //         db.query('SELECT * FROM enseignant', (err, enseignants) => {
                                //             if (err) throw err;
                                //             db.query('SELECT * FROM salle', (err, salles) => {
                                //                 if (err) throw err;
                                
                                //                 let date = new Date(startDate);
                                //                 let empCounter = 0;
                                
                                //                 for (let i = 0; i < days; i++) { 
                                //                     Pour chaque jour de la semaine
                                //                     times.forEach(time => {
                                //                         const coursIdx = empCounter % cours.length;
                                //                         const ensIdx = empCounter % enseignants.length;
                                //                         const salleIdx = empCounter % salles.length;
                                
                                //                         Insertion dans la table `Date`
                                //                         const insertDateQuery = `INSERT INTO Date (heuredeb, heureFin, Date) VALUES ('${time.heuredeb}', '${time.heureFin}', '${date.toISOString().split('T')[0]}')`;
                                //                         db.query(insertDateQuery, (err, result) => {
                                //                             if (err) throw err;
                                
                                //                             const idDate = result.insertId;
                                
                                //                             Insertion dans la table `emploidutemps`
                                //                             const insertEmpQuery = `
                                //                                 INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
                                //                                 VALUES (${cours[coursIdx].idCours}, ${enseignants[ensIdx].idEns}, '${salles[salleIdx].NumSalle}', ${idDate})
                                //                             `;
                                //                             db.query(insertEmpQuery, (err) => {
                                //                                 if (err) throw err;
                                //                             });
                                //                         });
                                
                                //                         empCounter++;
                                //                     });
                                //                     date.setDate(date.getDate() + 1); 
                                //                     Passer au jour suivant
                                //                 }
                                
                                //                 res.status(200).json({ message: 'Emploi du temps généré avec succès' });
                                //             });
                                //         });
                                //     });
                                // });
                                
                










                            // FIN EMPLOI DU TEMPS









// app.post('/generate-timetable', (req, res) => {
//     const { startDate } = req.body;
//     const times = [
//         { heuredeb: '07:30', heureFin: '09:00' },
//         { heuredeb: '09:00', heureFin: '10:30' },
//         { heuredeb: '10:30', heureFin: '12:00' },
//         { heuredeb: '13:00', heureFin: '14:30' },
//         { heuredeb: '14:30', heureFin: '16:00' },
//         { heuredeb: '16:00', heureFin: '17:30' }
//     ];
//     const days = 5; 
//     Générer pour 5 jours

//     Simuler la disponibilité des enseignants (jours de disponibilité par exemple)
//     const disponibilites = {
//         'ens1': { jours: ['Lundi', 'Mercredi', 'Vendredi'], heures: ['07:30', '09:00', '13:00'] },
//         'ens2': { jours: ['Mardi', 'Jeudi'], heures: ['10:30', '14:30'] },
//         Ajoutez la disponibilité pour chaque enseignant
//     };

//     db.query('SELECT * FROM cours', (err, cours) => {
//         if (err) throw err;
//         db.query('SELECT * FROM enseignant', (err, enseignants) => {
//             if (err) throw err;
//             db.query('SELECT * FROM salle', (err, salles) => {
//                 if (err) throw err;

//                 let date = new Date(startDate);
//                 let empCounter = 0;

//                 for (let i = 0; i < days; i++) { // Pour chaque jour de la semaine
//                     times.forEach(time => {
//                         const coursIdx = empCounter % cours.length;
//                         const ensIdx = empCounter % enseignants.length;
//                         const salleIdx = empCounter % salles.length;

//                         const enseignant = enseignants[ensIdx];
//                         const disponibilite = disponibilites[enseignant.nom]; 
//                         Par exemple, en utilisant le nom de l'enseignant
//                         const jourSemaine = date.toLocaleDateString('fr-FR', { weekday: 'long' });

//                         Vérifier si l'enseignant est disponible pour le jour et l'heure actuels
//                         if (disponibilite && disponibilite.jours.includes(jourSemaine) && disponibilite.heures.includes(time.heuredeb)) {
//                             Insertion dans la table Date
//                             const insertDateQuery = `
//                                 INSERT INTO Date (heuredeb, heureFin, Date) 
//                                 VALUES ('${time.heuredeb}', '${time.heureFin}', '${date.toISOString().split('T')[0]}')
//                             `;
//                             db.query(insertDateQuery, (err, result) => {
//                                 if (err) throw err;

//                                 const idDate = result.insertId;

//                                 Insertion dans la table emploidutemps
//                                 const insertEmpQuery = `
//                                     INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
//                                     VALUES (${cours[coursIdx].idCours}, ${enseignants[ensIdx].idEns}, '${salles[salleIdx].NumSalle}', ${idDate})
//                                 `;
//                                 db.query(insertEmpQuery, (err) => {
//                                     if (err) throw err;
//                                 });
//                             });

//                             empCounter++;
//                         }
//                     });
//                     date.setDate(date.getDate() + 1); 
//                     Passer au jour suivant
//                 }

//                 res.status(200).json({ message: 'Emploi du temps généré avec succès' });
//             });
//         });
//     });
// });







                        // METY TSARA





                        // app.post('/generate-timetable', (req, res) => {
                        //     const { startDate } = req.body;
                        //     const times = [
                        //         { heuredeb: '07:30', heureFin: '09:00' },
                        //         { heuredeb: '09:00', heureFin: '10:30' },
                        //         { heuredeb: '10:30', heureFin: '12:00' },
                        //         { heuredeb: '13:00', heureFin: '14:30' },
                        //         { heuredeb: '14:30', heureFin: '16:00' },
                        //         { heuredeb: '16:00', heureFin: '17:30' }
                        //     ];
                        //     const days = 5;
                        

                            


                        //     Définir les disponibilités des enseignants dans le code
                        //     const disponibilitesEnseignants = {
                        //         "Christian": [
                        //             { jour: 'lundi', heuredeb: '07:30', heureFin: '09:00' },
                        //             { jour: 'mercredi', heuredeb: '09:00', heureFin: '10:30' }
                        //         ],
                        //         "Siaka": [
                        //             { jour: 'lundi', heuredeb: '09:00', heureFin: '12:00' },
                        //             { jour: 'jeudi', heuredeb: '14:30', heureFin: '17:30' }
                        //         ],
                        //         "Michel": [
                        //             { jour: 'lundi', heuredeb: '13:00', heureFin: '14:30' },
                        //             { jour: 'vendredi', heuredeb: '09:00', heureFin: '16:00' }
                        //         ],
                        //         "Andry": [
                        //             { jour: 'vendredi', heuredeb: '10:30', heureFin: '12:00' },
                        //             { jour: 'jeudi', heuredeb: '09:00', heureFin: '10:30' }
                        //         ],
                        //         "Haja": [
                        //             { jour: 'vendredi', heuredeb: '07:30', heureFin: '10:30' },
                        //             { jour: 'jeudi', heuredeb: '10:30', heureFin: '12:00' }
                        //         ],
                                
     
                                
                        //     };
                        
                        //     db.query('SELECT * FROM cours', (err, cours) => {
                        //         if (err) {
                        //             console.error("Erreur lors de la récupération des cours:", err);
                        //             return res.status(500).json({ message: 'Erreur lors de la récupération des cours' });
                        //         }
                        
                        //         db.query('SELECT * FROM enseignant', (err, enseignants) => {
                        //             if (err) {
                        //                 console.error("Erreur lors de la récupération des enseignants:", err);
                        //                 return res.status(500).json({ message: 'Erreur lors de la récupération des enseignants' });
                        //             }
                        
                        //             db.query('SELECT * FROM salle', (err, salles) => {
                        //                 if (err) {
                        //                     console.error("Erreur lors de la récupération des salles:", err);
                        //                     return res.status(500).json({ message: 'Erreur lors de la récupération des salles' });
                        //                 }
                        
                        //                 let date = new Date(startDate);
                        //                 let empCounter = 0;
                        
                        //                 for (let i = 0; i < days; i++) {
                        //                     const dayName = date.toLocaleString('fr-FR', { weekday: 'long' });
                        
                        //                     times.forEach(time => {
                        //                         let enseignantDispo = null;
                        
                        //                         for (const enseignant of enseignants) {
                        //                             const dispo = disponibilitesEnseignants[enseignant.Prenom];
                        
                        //                             if (dispo) {
                        //                                 const enseignantEstDispo = dispo.some(d =>
                        //                                     d.jour === dayName &&
                        //                                     time.heuredeb >= d.heuredeb && time.heureFin <= d.heureFin
                        //                                 );
                        
                        //                                 if (enseignantEstDispo) {
                        //                                     enseignantDispo = enseignant;
                        //                                     break;
                        //                                 }
                        //                             }
                        //                         }
                        
                        //                         if (enseignantDispo) {
                        //                             const coursIdx = empCounter % cours.length;
                        //                             const salleIdx = empCounter % salles.length;
                        
                        //                             const insertDateQuery = `INSERT INTO Date (heuredeb, heureFin, Date) VALUES ('${time.heuredeb}', '${time.heureFin}', '${date.toISOString().split('T')[0]}')`;
                        //                             console.log("Requête d'insertion dans Date:", insertDateQuery);
                        
                        //                             db.query(insertDateQuery, (err, result) => {
                        //                                 if (err) {
                        //                                     console.error("Erreur lors de l'insertion dans Date:", err);
                        //                                     return;
                        //                                 }
                        
                        //                                 const idDate = result.insertId;
                        //                                 const insertEmpQuery = `
                        //                                     INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
                        //                                     VALUES (${cours[coursIdx].idCours}, ${enseignantDispo.idEns}, '${salles[salleIdx].NumSalle}', ${idDate})
                        //                                 `;
                        //                                 console.log("Requête d'insertion dans emploidutemps:", insertEmpQuery);
                        
                        //                                 db.query(insertEmpQuery, (err) => {
                        //                                     if (err) {
                        //                                         console.error("Erreur lors de l'insertion dans emploidutemps:", err);
                        //                                     } else {
                        //                                         console.log("Insertion réussie dans emploidutemps");
                        //                                     }
                        //                                 });
                        //                             });
                                                        
                        //                             empCounter++;
                        //                         } else {
                        //                             console.log(`Aucun enseignant disponible pour ${dayName} de ${time.heuredeb} à ${time.heureFin}`);
                        //                         }
                        //                     });
                        //                     date.setDate(date.getDate() + 1);
                        //                 }
                        
                        //                 res.status(200).json({ message: 'Emploi du temps généré avec succès' });
                        //             });
                        //         });
                        //     });
                        // });
                        







                        // METY TSARA 2


// app.post('/generate-timetable', (req, res) => {
//     const { startDate } = req.body;
//     const times = [
//         { heuredeb: '07:30', heureFin: '09:00' },
//         { heuredeb: '09:00', heureFin: '10:30' },
//         { heuredeb: '10:30', heureFin: '12:00' },
//         { heuredeb: '13:00', heureFin: '14:30' },
//         { heuredeb: '14:30', heureFin: '16:00' },
//         { heuredeb: '16:00', heureFin: '17:30' }
//     ];
//     const days = 5;

//     Définir les disponibilités des enseignants
//     const disponibilitesEnseignants = {
//         "Christian": [
//             { jour: 'lundi', heuredeb: '07:30', heureFin: '09:00' },
//             { jour: 'mercredi', heuredeb: '09:00', heureFin: '10:30' }
//         ],
//         "Siaka": [
//             { jour: 'lundi', heuredeb: '09:00', heureFin: '12:00' },
//             { jour: 'jeudi', heuredeb: '14:30', heureFin: '17:30' }
//         ],
//         "Michel": [
//             { jour: 'lundi', heuredeb: '13:00', heureFin: '14:30' },
//             { jour: 'vendredi', heuredeb: '09:00', heureFin: '16:00' }
//         ],
//         "Andry": [
//             { jour: 'vendredi', heuredeb: '10:30', heureFin: '12:00' },
//             { jour: 'jeudi', heuredeb: '09:00', heureFin: '10:30' }
//         ],
//         "Haja": [
//             { jour: 'vendredi', heuredeb: '07:30', heureFin: '10:30' },
//             { jour: 'jeudi', heuredeb: '10:30', heureFin: '12:00' }
//         ],
//     };

//     Définir les matières enseignées par chaque enseignant

//     const matieresEnseignees = {
//         "Christian": ["3", "19","18"],
//         "Siaka": ["12"],
//         "Michel": ["15", "16"],
//         "Andry": ["21"],
//         "Haja": ["13", "4","Analyse"]
//         "Andry": [{ idCours: 3, nom: "Probabilite et Statistique" }, { idCours: 19, nom: "Géographie" }],
//     };


//     db.query('SELECT * FROM cours', (err, cours) => {
//         if (err) {
//             console.error("Erreur lors de la récupération des cours:", err);
//             return res.status(500).json({ message: 'Erreur lors de la récupération des cours' });
//         }

//         db.query('SELECT * FROM enseignant', (err, enseignants) => {
//             if (err) {
//                 console.error("Erreur lors de la récupération des enseignants:", err);
//                 return res.status(500).json({ message: 'Erreur lors de la récupération des enseignants' });
//             }

//             db.query('SELECT * FROM salle', (err, salles) => {
//                 if (err) {
//                     console.error("Erreur lors de la récupération des salles:", err);
//                     return res.status(500).json({ message: 'Erreur lors de la récupération des salles' });
//                 }

//                 let date = new Date(startDate);
//                 let empCounter = 0;

//                 for (let i = 0; i < days; i++) {
//                     const dayName = date.toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase(); 
//                     Assurer la correspondance des jours

//                     times.forEach(time => {
//                         let enseignantDispo = null;
    
//                         for (const enseignant of enseignants) {
//                             const dispo = disponibilitesEnseignants[enseignant.Prenom];
    
//                             if (dispo) {
//                                 const enseignantEstDispo = dispo.some(d =>
//                                     d.jour === dayName &&
//                                     time.heuredeb >= d.heuredeb && time.heureFin <= d.heureFin
//                                 );
    
//                                 if (enseignantEstDispo) {
//                                     enseignantDispo = enseignant;
//                                     break;
//                                 }
//                             }
//                         }
    
//                         if (enseignantDispo) {
//                             Récupérer les matières enseignées par l'enseignant disponible
//                             const matieres = matieresEnseignees[enseignantDispo.Prenom];
    
//                             if (matieres && matieres.length > 0) {
//                                 const salleIdx = empCounter % salles.length;
    
//                                 Insertion de la matière de l'enseignant dans l'emploi du temps
//                                 const insertDateQuery = `INSERT INTO Date (heuredeb, heureFin, Date) VALUES ('${time.heuredeb}', '${time.heureFin}', '${date.toISOString().split('T')[0]}')`;
    
//                                 db.query(insertDateQuery, (err, result) => {
//                                     if (err) throw err;
    
//                                     const idDate = result.insertId;
//                                     const coursNom = matieres[0]; 
//                                     La première matière de l'enseignant
//                                     const insertEmpQuery = `
//                                         INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
//                                         VALUES ('${coursNom}', ${enseignantDispo.idEns}, '${salles[salleIdx].NumSalle}', ${idDate})
//                                     `;
//                                     db.query(insertEmpQuery, (err) => {
//                                         if (err) throw err;
//                                     });
//                                 });
    
//                                 empCounter++;
//                             } else {
//                                 console.log(`L'enseignant ${enseignantDispo.Prenom} n'a pas de matières définies.`);
//                             }
//                         } else {
//                             console.log(`Aucun enseignant disponible pour ${dayName} de ${time.heuredeb} à ${time.heureFin}`);
//                         }
//                     });
                    
//                     date.setDate(date.getDate() + 1);
//                 }

//                 res.status(200).json({ message: 'Emploi du temps généré avec succès' });
//             });
//         });
//     });
// });



                        // METY TSR HAMPIASAINA AMIN'IZAO


                        // app.post('/generate-timetable', (req, res) => {
                        //     const { startDate } = req.body;
                        //     const times = [
                        //         { heuredeb: '07:30', heureFin: '09:00' },
                        //         { heuredeb: '09:00', heureFin: '10:30' },
                        //         { heuredeb: '10:30', heureFin: '12:00' },
                        //         { heuredeb: '13:00', heureFin: '14:30' },
                        //         { heuredeb: '14:30', heureFin: '16:00' },
                        //         { heuredeb: '16:00', heureFin: '17:30' }
                        //     ];
                        //     const days = 5;
                        
                        //     const disponibilitesEnseignants = {
                        //         "Christian": [
                        //             { jour: 'lundi', heuredeb: '07:30', heureFin: '09:00' },
                        //             { jour: 'mercredi', heuredeb: '09:00', heureFin: '10:30' }
                        //         ],
                        //         "Siaka": [
                        //             { jour: 'lundi', heuredeb: '09:00', heureFin: '12:00' },
                        //             { jour: 'jeudi', heuredeb: '14:30', heureFin: '17:30' }
                        //         ],
                        //         "Michel": [
                        //             { jour: 'lundi', heuredeb: '13:00', heureFin: '14:30' },
                        //             { jour: 'vendredi', heuredeb: '09:00', heureFin: '16:00' }
                        //         ],
                        //         "Andry": [
                        //             { jour: 'vendredi', heuredeb: '10:30', heureFin: '12:00' },
                        //             { jour: 'jeudi', heuredeb: '09:00', heureFin: '10:30' }
                        //         ],
                        //         "Haja": [
                        //             { jour: 'vendredi', heuredeb: '07:30', heureFin: '10:30' },
                        //             { jour: 'jeudi', heuredeb: '10:30', heureFin: '12:00' }
                        //         ],
                        //     };
                        
                        //     const matieresEnseignees = {
                        //         "Christian": ["3", "19", "18"],
                        //         "Siaka": ["12"],
                        //         "Michel": ["15", "16"],
                        //         "Andry": ["21"],
                        //         "Haja": ["13", "4"]
                        //     };
                        
                        //     db.query('SELECT * FROM cours', (err, cours) => {
                        //         if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des cours' });
                        
                        //         db.query('SELECT * FROM enseignant', (err, enseignants) => {
                        //             if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des enseignants' });
                        
                        //             db.query('SELECT * FROM salle', (err, salles) => {
                        //                 if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des salles' });
                        
                        //                 let date = new Date(startDate);
                        //                 let salleIdx = 0; 
                        //                 Index de salle initialisé à 0
                        
                        //                 Boucle sur les jours et les créneaux horaires
                        //                 for (let i = 0; i < days; i++) {
                        //                     const dayName = date.toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase();
                        
                        //                     times.forEach(time => {
                        //                         Trouver un enseignant disponible pour le jour et l'heure
                        //                         let enseignantDispo = enseignants.find(enseignant => {
                        //                             const dispo = disponibilitesEnseignants[enseignant.Prenom];
                        //                             return dispo && dispo.some(d => d.jour === dayName && time.heuredeb >= d.heuredeb && time.heureFin <= d.heureFin);
                        //                         });
                        
                        //                         if (enseignantDispo) {
                        //                             const matieres = matieresEnseignees[enseignantDispo.Prenom];
                        
                        //                             if (matieres && matieres.length > 0) {
                        //                                 Sélectionner la salle courante
                        //                                 const salle = salles[salleIdx];
                                                        
                        //                                 Insérer dans la table Date
                        //                                 const insertDateQuery = `INSERT INTO Date (heuredeb, heureFin, Date) VALUES ('${time.heuredeb}', '${time.heureFin}', '${date.toISOString().split('T')[0]}')`;
                        //                                 db.query(insertDateQuery, (err, result) => {
                        //                                     if (err) throw err;
                        
                        //                                     const idDate = result.insertId;
                        //                                     const coursNom = matieres[0]; 
                        //                                     Première matière
                        
                        //                                     Insérer dans l'emploi du temps
                        //                                     const insertEmpQuery = `
                        //                                         INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
                        //                                         VALUES ('${coursNom}', ${enseignantDispo.idEns}, '${salle.NumSalle}', ${idDate})
                        //                                     `;
                        //                                     db.query(insertEmpQuery, (err) => {
                        //                                         if (err) throw err;
                        //                                     });
                        //                                 });
                        
                        //                                 Passer à la salle suivante
                        //                                 salleIdx++;
                        //                                 if (salleIdx >= salles.length) {
                        //                                     salleIdx = 0; 
                        //                                     Revenir à la première salle si on dépasse le nombre total
                        //                                 }
                        //                             }
                        //                         }
                        //                     });
                        
                        //                     date.setDate(date.getDate() + 1); 
                        //                     Passer au jour suivant
                        //                 }
                        
                        //                 res.status(200).json({ message: 'Emploi du temps généré avec succès' });
                        //             });
                        //         });
                        //     });
                        // });
                        


                        // METY TSR HAMPIASAINA AMIN'IZAO ITENENANA IZAO



// app.post('/generate-timetable', (req, res) => {
//     const { startDate } = req.body;
//     const times = [
//         { heuredeb: '07:30', heureFin: '09:00' },
//         { heuredeb: '09:00', heureFin: '10:30' },
//         { heuredeb: '10:30', heureFin: '12:00' },
//         { heuredeb: '13:00', heureFin: '14:30' },
//         { heuredeb: '14:30', heureFin: '16:00' },
//         { heuredeb: '16:00', heureFin: '17:30' }
//     ];
//     const days = 5;

//     const disponibilitesEnseignants = {
//         "Christian": [
//             { jour: 'lundi', heuredeb: '07:30', heureFin: '09:00' },
//             { jour: 'mardi', heuredeb: '07:30', heureFin: '09:00' },
//             { jour: 'mardi', heuredeb: '09:00', heureFin: '10:30' },
//             { jour: 'mardi', heuredeb: '10:30', heureFin: '12:00' },
//             { jour: 'mardi', heuredeb: '13:00', heureFin: '14:30' },
//             { jour: 'mardi', heuredeb: '14:30', heureFin: '16:00' },
//             { jour: 'mercredi', heuredeb: '09:00', heureFin: '10:30' },
//             { jour: 'mercredi', heuredeb: '13:00', heureFin: '16:00' }
//         ],
//         "Siaka": [
//             { jour: 'lundi', heuredeb: '09:00', heureFin: '12:00' },
//             { jour: 'jeudi', heuredeb: '14:30', heureFin: '17:30' }
//         ],
//         "Michel": [
//             { jour: 'lundi', heuredeb: '13:00', heureFin: '14:30' },
//             { jour: 'vendredi', heuredeb: '09:00', heureFin: '16:00' }
//         ],
//         "Andry": [
//             { jour: 'vendredi', heuredeb: '10:30', heureFin: '12:00' },
//             { jour: 'jeudi', heuredeb: '09:00', heureFin: '10:30' }
//         ],
//         "Haja": [
//             { jour: 'vendredi', heuredeb: '07:30', heureFin: '10:30' },
//             { jour: 'jeudi', heuredeb: '10:30', heureFin: '12:00' }
//         ],
//     };

//     const matieresEnseignees = {
//         "Christian": [{ id: "3", volumeHoraire: 4 }, { id: "19", volumeHoraire: 4 }, { id: "18", volumeHoraire: 4 }],
//         "Siaka": [{ id: "12", volumeHoraire: 4 }],
//         "Michel": [{ id: "15", volumeHoraire: 4 }, { id: "16", volumeHoraire: 4 }],
//         "Andry": [{ id: "21", volumeHoraire: 4 }],
//         "Haja": [{ id: "13", volumeHoraire: 4 }, { id: "4", volumeHoraire: 4 }]
//     };

//     Initialiser un objet pour suivre le volume horaire attribué
//     const volumeHoraireAttribue = {};
//     for (const enseignant in matieresEnseignees) {
//         volumeHoraireAttribue[enseignant] = matieresEnseignees[enseignant].map(m => ({ ...m, heuresAttribuees: 0 }));
//     }

//     db.query('SELECT * FROM cours', (err, cours) => {
//         if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des cours' });

//         db.query('SELECT * FROM enseignant', (err, enseignants) => {
//             if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des enseignants' });

//             db.query('SELECT * FROM salle', (err, salles) => {
//                 if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des salles' });

//                 let date = new Date(startDate);
//                 let salleIdx = 0;

//                 for (let i = 0; i < days; i++) {
//                     const dayName = date.toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase();

//                     times.forEach(time => {
//                         Trouver un enseignant disponible
//                         let enseignantDispo = enseignants.find(enseignant => {
//                             const dispo = disponibilitesEnseignants[enseignant.Prenom];
//                             return dispo && dispo.some(d => d.jour === dayName && time.heuredeb >= d.heuredeb && time.heureFin <= d.heureFin);
//                         });

//                         if (enseignantDispo) {
//                             const matieres = volumeHoraireAttribue[enseignantDispo.Prenom];
//                             let coursNom = null;

//                             Trouver une matière qui n'a pas atteint son volume horaire
//                             for (const matiere of matieres) {
//                                 if (matiere.heuresAttribuees < matiere.volumeHoraire) {
//                                     coursNom = matiere.id;
//                                     matiere.heuresAttribuees += 1.5; 
//                                     Incrémenter les heures attribuées (1h30)
//                                     break;
//                                 }
//                             }

//                             if (coursNom) {
//                                 Sélectionner la salle courante
//                                 const salle = salles[salleIdx];

//                                 Insérer dans la table Date
//                                 const insertDateQuery = `INSERT INTO Date (heuredeb, heureFin, Date) VALUES ('${time.heuredeb}', '${time.heureFin}', '${date.toISOString().split('T')[0]}')`;
//                                 db.query(insertDateQuery, (err, result) => {
//                                     if (err) throw err;

//                                     const idDate = result.insertId;

//                                     Insérer dans l'emploi du temps
//                                     const insertEmpQuery = `
//                                         INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
//                                         VALUES ('${coursNom}', ${enseignantDispo.idEns}, '${salle.NumSalle}', ${idDate})
//                                     `;
//                                     db.query(insertEmpQuery, (err) => {
//                                         if (err) throw err;
//                                     });
//                                 });

//                                 Passer à la salle suivante
//                                 salleIdx++;
//                                 if (salleIdx >= salles.length) {
//                                     salleIdx = 0;
//                                 }
//                             }
//                         }
//                     });

//                     date.setDate(date.getDate() + 1); 
//                     Passer au jour suivant
//                 }

//                 res.status(200).json({ message: 'Emploi du temps généré avec succès' });
//             });
//         });
//     });
// });
                        





                    // TEST NATAOKO FARANY 1


// app.post('/generate-timetable', (req, res) => {
//     const { startDate } = req.body;
//     const times = [
//         { heuredeb: '07:30', heureFin: '09:00' },
//         { heuredeb: '09:00', heureFin: '10:30' },
//         { heuredeb: '10:30', heureFin: '12:00' },
//         { heuredeb: '13:00', heureFin: '14:30' },
//         { heuredeb: '14:30', heureFin: '16:00' },
//         { heuredeb: '16:00', heureFin: '17:30' }
//     ];
//     const days = 5;

//     const disponibilitesEnseignants = {
//         "Christian": [
//             { jour: 'lundi', heuredeb: '07:30', heureFin: '09:00' },
//             { jour: 'mardi', heuredeb: '09:00', heureFin: '10:30' },
//             { jour: 'mardi', heuredeb: '10:30', heureFin: '12:00' },
//             { jour: 'mardi', heuredeb: '13:00', heureFin: '14:30' },
//             { jour: 'mardi', heuredeb: '14:30', heureFin: '16:00' },
//             { jour: 'mercredi', heuredeb: '09:00', heureFin: '10:30' },
//             { jour: 'mercredi', heuredeb: '10:30', heureFin: '12:00' },
//         ],
//         "Siaka": [
//             { jour: 'lundi', heuredeb: '09:00', heureFin: '12:00' },
//             { jour: 'jeudi', heuredeb: '14:30', heureFin: '17:30' }
//         ],
//         "Michel": [
//             { jour: 'lundi', heuredeb: '13:00', heureFin: '14:30' },
//             { jour: 'vendredi', heuredeb: '09:00', heureFin: '16:00' }
//         ],
//         "Andry": [
//             { jour: 'vendredi', heuredeb: '10:30', heureFin: '12:00' },
//             { jour: 'jeudi', heuredeb: '09:00', heureFin: '10:30' }
//         ],
//         "Haja": [
//             { jour: 'vendredi', heuredeb: '07:30', heureFin: '10:30' },
//             { jour: 'jeudi', heuredeb: '10:30', heureFin: '12:00' }
//         ],
//     };

//     Définition des matières enseignées par chaque enseignant
//     const matieresEnseignees = {
//         "Christian": ["3", "19", "18"],
//         "Siaka": ["12"],
//         "Michel": ["15", "16"],
//         "Andry": ["21"],
//         "Haja": ["13", "4"]
//     };

//     db.query('SELECT * FROM cours', (err, cours) => {
//         if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des cours' });

//         Créer un mappage des volumes horaires des cours
//         const volumeHoraireMap = {};
//         cours.forEach(c => {
//             volumeHoraireMap[c.idCours] = c.volumeHoraire;
//         });

//         db.query('SELECT * FROM enseignant', (err, enseignants) => {
//             if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des enseignants' });

//             db.query('SELECT * FROM salle', (err, salles) => {
//                 if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des salles' });

//                 Initialiser un objet pour suivre le volume horaire attribué
//                 const volumeHoraireAttribue = {};
//                 enseignants.forEach(enseignant => {
//                     const matieres = matieresEnseignees[enseignant.Prenom] || [];
//                     volumeHoraireAttribue[enseignant.Prenom] = matieres.map(idMatiere => ({
//                         id: idMatiere,
//                         volumeHoraire: volumeHoraireMap[idMatiere] || 0,
//                         heuresAttribuees: 0
//                     }));
//                 });

//                 let date = new Date(startDate);
//                 let salleIdx = 0;

//                 for (let i = 0; i < days; i++) {
//                     const dayName = date.toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase();

//                     times.forEach(time => {
//                         let enseignantDispo = enseignants.find(enseignant => {
//                             const dispo = disponibilitesEnseignants[enseignant.Prenom];
//                             return dispo && dispo.some(d => d.jour === dayName && time.heuredeb >= d.heuredeb && time.heureFin <= d.heureFin);
//                         });

//                         if (enseignantDispo) {
//                             const matieres = volumeHoraireAttribue[enseignantDispo.Prenom];
//                             let coursNom = null;

//                             for (const matiere of matieres) {
//                                 if (matiere.heuresAttribuees < matiere.volumeHoraire) {
//                                     coursNom = matiere.id;
//                                     matiere.heuresAttribuees += 1.5; 
//                                     Incrémenter les heures attribuées (1h30)
//                                     break;
//                                 }
//                             }

//                             if (coursNom) {
//                                 const salle = salles[salleIdx];

//                                 const insertDateQuery = `INSERT INTO Date (heuredeb, heureFin, Date) VALUES ('${time.heuredeb}', '${time.heureFin}', '${date.toISOString().split('T')[0]}')`;
//                                 db.query(insertDateQuery, (err, result) => {
//                                     if (err) throw err;

//                                     const idDate = result.insertId;

//                                     const insertEmpQuery = `
//                                         INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
//                                         VALUES ('${coursNom}', ${enseignantDispo.idEns}, '${salle.NumSalle}', ${idDate})
//                                     `;
//                                     db.query(insertEmpQuery, (err) => {
//                                         if (err) throw err;
//                                     });
//                                 });

//                                 salleIdx++;
//                                 if (salleIdx >= salles.length) {
//                                     salleIdx = 0;
//                                 }
//                             }
//                         }
//                     });

//                     date.setDate(date.getDate() + 1);
//                 }

//                 res.status(200).json({ message: 'Emploi du temps généré avec succès' });
//             });
//         });
//     });
// });




                            
                    
                    







                                    // TEST FARANY 3

                                    


// app.post('/generate-timetable', (req, res) => {
//     const { startDate } = req.body;  
//     Niveau L1 ou L2 passé dans la requête
//     const niveau = "L1";
//     const times = [
//         { heuredeb: '07:30', heureFin: '09:00' },
//         { heuredeb: '09:00', heureFin: '10:30' },
//         { heuredeb: '10:30', heureFin: '12:00' },
//         { heuredeb: '13:30', heureFin: '15:00' },
//         { heuredeb: '15:00', heureFin: '16:30' },
//         { heuredeb: '16:30', heureFin: '18:00' }
//     ];
//     const days = 5;

//     Disponibilités des enseignants
//     const disponibilitesEnseignants = {
//         "Christian": [
//             { jour: 'lundi', heuredeb: '13:30', heureFin: '15:00' },
//             { jour: 'lundi', heuredeb: '15:00', heureFin: '16:30' },
//             { jour: 'mardi', heuredeb: '15:00', heureFin: '16:30' },
//             { jour: 'mardi', heuredeb: '16:30', heureFin: '18:00' },
//         ],
//         "Siaka": [
//             { jour: 'lundi', heuredeb: '07:30', heureFin: '09:00' },
            
//         ],
//         "Michel": [
//             { jour: 'mardi', heuredeb: '07:30', heureFin: '09:00' },
//             { jour: 'mardi', heuredeb: '09:00', heureFin: '10:30' },
//             { jour: 'mardi', heuredeb: '10:30', heureFin: '12:00' },
//             { jour: 'vendredi', heuredeb: '07:30', heureFin: '09:00' },
//             { jour: 'vendredi', heuredeb: '09:00', heureFin: '10:30' },
//             { jour: 'vendredi', heuredeb: '10:30', heureFin: '12:00' },
//             { jour: 'vendredi', heuredeb: '13:30', heureFin: '15:00' },
            
//         ],
//         "Andry": [
//             { jour: 'lundi', heuredeb: '07:30', heureFin: '09:00' },
//         ],
//         "Haja": [
//             { jour: 'lundi', heuredeb: '13:30', heureFin: '15:00' },
//             { jour: 'lundi', heuredeb: '15:00', heureFin: '16:30' },
//             { jour: 'mardi', heuredeb: '15:00', heureFin: '16:30' },
//             { jour: 'mardi', heuredeb: '16:30', heureFin: '18:00' },
//             { jour: 'mercredi', heuredeb: '10:30', heureFin: '12:00' },
//             { jour: 'mercredi', heuredeb: '13:30', heureFin: '15:00' },
//             { jour: 'jeudi', heuredeb: '10:30', heureFin: '12:00' },
//             { jour: 'jeudi', heuredeb: '13:30', heureFin: '15:00' },
            
//         ],
//     };

//     const matieresEnseignees = {
//         "Christian": ["3", "19", "18"],
//         "Siaka": ["12"],
//         "Michel": ["15", "16"],
//         "Andry": ["21"],
//         "Haja": ["13", "4"]
//     };

//     const nombreEleves = {
//         "L1": 60,  
//         50 élèves en L1
//         "L2": 40,  
//         40 élèves en L2
//     };

//     db.query('SELECT * FROM cours WHERE Semestre = "S1"', (err, cours) => {
//         if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des cours' });

//         const volumeHoraireMap = {};
//         cours.forEach(c => {
//             volumeHoraireMap[c.idCours] = c.volumeHoraire;
//         });

//         db.query('SELECT * FROM enseignant', (err, enseignants) => {
//             if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des enseignants' });

//             db.query('SELECT * FROM salle', (err, salles) => {
//                 if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des salles' });

//                 const volumeHoraireAttribue = {};
//                 enseignants.forEach(enseignant => {
//                     const matieres = matieresEnseignees[enseignant.Prenom] || [];
//                     volumeHoraireAttribue[enseignant.Prenom] = matieres.map(idMatiere => ({
//                         id: idMatiere,
//                         volumeHoraire: volumeHoraireMap[idMatiere] || 0,
//                         heuresAttribuees: 0
//                     }));
//                 });

//                 let date = new Date(startDate);

//                 Suivi des salles utilisées par créneau
//                 const sallesUtilisees = {};

//                 for (let i = 0; i < days; i++) {
//                     const dayName = date.toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase();

//                     times.forEach(time => {
//                         let enseignantsDispos = enseignants.filter(enseignant => {
//                             const dispo = disponibilitesEnseignants[enseignant.Prenom];
//                             return dispo && dispo.some(d => d.jour === dayName && time.heuredeb >= d.heuredeb && time.heureFin <= d.heureFin);
//                         });

//                         if (enseignantsDispos.length > 0) {
//                             enseignantsDispos.forEach(enseignantDispo => {
//                                 const matieres = volumeHoraireAttribue[enseignantDispo.Prenom];
//                                 let coursNom = null;

//                                 for (const matiere of matieres) {
//                                     if (matiere.heuresAttribuees < matiere.volumeHoraire) {
//                                         coursNom = matiere.id;
//                                         matiere.heuresAttribuees += 1.5; 
//                                         Attribuer 1h30
//                                         break;
//                                     }
//                                 }

//                                 if (coursNom) {
//                                     Trouver une salle non utilisée pour ce créneau
//                                     let salleTrouvee = salles.find(salle => 
//                                         salle.Capacite >= nombreEleves[niveau] && 
//                                         !(sallesUtilisees[dayName]?.[time.heuredeb]?.includes(salle.NumSalle))
//                                     );

//                                     if (salleTrouvee) {
//                                         Suivi de la salle utilisée pour ce créneau
//                                         sallesUtilisees[dayName] = sallesUtilisees[dayName] || {};
//                                         sallesUtilisees[dayName][time.heuredeb] = sallesUtilisees[dayName][time.heuredeb] || [];
//                                         sallesUtilisees[dayName][time.heuredeb].push(salleTrouvee.NumSalle);

//                                         Insertion de la date
//                                         const insertDateQuery = `INSERT INTO Date (heuredeb, heureFin, Date) VALUES ('${time.heuredeb}', '${time.heureFin}', '${date.toISOString().split('T')[0]}')`;
//                                         db.query(insertDateQuery, (err, result) => {
//                                             if (err) throw err;

//                                             const idDate = result.insertId;

//                                             Insertion dans l'emploi du temps
//                                             const insertEmpQuery = `
//                                                 INSERT INTO emploidutemps (idCours, idEns, NumSalle, idDate)
//                                                 VALUES ('${coursNom}', ${enseignantDispo.idEns}, '${salleTrouvee.NumSalle}', ${idDate})
//                                             `;
//                                             db.query(insertEmpQuery, (err) => {
//                                                 if (err) throw err;
//                                             });
//                                         });
//                                     } else {
//                                         console.log("Pas de salle disponible avec une capacité suffisante pour", nombreEleves[niveau], "élèves");
//                                     }
//                                 }
//                             });
//                         }
//                     });

//                     Passer au jour suivant
//                     date.setDate(date.getDate() + 1);
//                 }

//                 res.status(200).json({ message: 'Emploi du temps généré avec succès' });
//             });
//         });
//     });
// });

                    



                            // DEBUT FONCTION CHAT

// Route pour récupérer les messages
// app.get('/messages', (req, res) => {
//     const sql = 'SELECT * FROM messages ORDER BY timestamp DESC';
//     db.query(sql, (err, result) => {
//       if (err) {
//         res.status(500).send('Erreur lors de la récupération des messages');
//       } else {
//         res.json(result);
//       }
//     });
//   });
  
  // Route pour envoyer un message
//   app.post('/messageChat', (req, res) => {
//     const {user_id, content } = req.body;
//     const sql = 'INSERT INTO messages (user_id, content) VALUES (?, ?)';
//     db.query(sql, [user_id, content], (err, result) => {
//       if (err) {
//         res.status(500).send('Erreur lors de l\'envoi du message');
//       } else {
//         res.status(201).send('Message envoyé avec succès');
//         console.log("reussie");
//       }
//     });
//   });



                                // FIN FONCTION CHAT













// MODIFICATION 

















// Fonction pour vérifier les conflits de salles et d'enseignants


// Fonction pour obtenir une salle disponible












function getAvailableRoom() {
    // Implémenter la logique pour récupérer une salle disponible
    return 101;  // Exemple de numéro de salle, il faut implémenter une vraie logique
}

// Fonction pour insérer la date et l'heure dans la table Date
function insertDate(date, time) {
    const insertDateQuery = `INSERT INTO date (jour, HEUREDEBUT, HEUREFIN) VALUES (?, ?, ?)`;
    const queryValues = [date.toISOString().split('T')[0], time.heuredeb, time.heureFin];
    db.query(insertDateQuery, queryValues, (err, result) => {
        if (err) {
            console.error("Erreur lors de l'insertion dans la table Date", err);
        }
        return result.insertId;
    });
}

// Fonction pour vérifier la disponibilité d'un enseignant
function checkAvailability(idEnseignant, callback) {
    // Implémenter la logique pour vérifier les disponibilités de l'enseignant
    callback(true);  // Retourne true si disponible, c'est un exemple
}



























app.put("/fanovana/:daty/:ora",(req,res)=>{
    const{daty,ora}=req.params;
    const{anarana1,anarana2}=req.body;
    const requeteEditer="update anjara set anarana1=?,anarana2=? where daty=? and ora=?"
    db.query(requeteEditer,[anarana1,anarana2,daty,ora],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
            console.log("Modification avec succès!");
        }
    });
});


// LISTE TYPE EN SELECTIONNANT L'IDENTIFIANT
app.get("/idOvana/:Daty/:Ora",(req,res)=>{
    const{Daty,Ora} = req.params;
    var requeteIdOvana = "SELECT *FROM anjara where daty=? and ora=?";
    db.query(requeteIdOvana,[Daty,Ora],(err,resultat)=>{
        if(err) throw err;
        else{
            res.send(resultat);                
        }
    });
    
});

app.get("/listaMpiaramanompo",(req,res)=>{
    var req = "select *from mpiaramanompo";
    db.query(req,(err,resultat)=>{
        if(err) throw err;
        else{
            
            res.send(resultat);
        
        }
    });
})

app.get("/listaAnjaraFampirantiana",(req,res)=>{
    var req = "select daty,ora,anarana1,anarana2 from anjara order by daty asc,idAnjara asc";
    db.query(req,(err,resultat)=>{
        if(err) throw err;
        else{    
            res.send(resultat);
        }
    });
})


app.get("/listaOraHanompoana",(req,res)=>{
    var req = "select OraFampiratiana from Ora";
    db.query(req,(err,resultat)=>{
        if(err) throw err;
        else{
            
            res.send(resultat);
        
        }
    });
})






// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.send({ filePath: `/uploads/${req.file.filename}` });
});



// Route pour ajouter les dates d'une semaine
app.post('/add-week-dates', (req, res) => {
    const { year, month, weekNumber } = req.body;

    const startDate = getStartDateOfWeek(year, month, weekNumber);
    const weekDates = generateWeekDates(startDate);

    const query = 'INSERT INTO week_dates (date) VALUES ?';
    const values = weekDates.map(date => [date]);

    db.query(query, [values], (err, result) => {
        if (err) throw err;
        res.send('Dates added');
    });
});

function getStartDateOfWeek(year, month, weekNumber) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const startDay = (weekNumber - 1) * 7 - firstDayOfWeek + 1;
    return new Date(year, month - 1, startDay);
}

function generateWeekDates(startDate) {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}

// Route pour obtenir les dates d'une semaine spécifique
app.get('/week-dates/:year/:month/:weekNumber', (req, res) => {
    const { year, month, weekNumber } = req.params;

    const startDate = getStartDateOfWeek(year, month, weekNumber);
    const weekDates = generateWeekDates(startDate);

    res.json(weekDates);
});







// Fonction pour obtenir les dates de la première semaine du mois et et la premiere date est toujours commencant le jour lundi dans nodejs expressjs
// Fonction pour obtenir les dates de la première semaine du mois


// Fonction pour obtenir les dates de la première semaine du mois
function getFirstWeekDates(year, month) {
    const start = startOfMonth(new Date(year, month - 1));
    const startDayOfWeek = getDay(start);
  
    // Trouver le premier lundi du mois
    const firstMonday = startDayOfWeek === 1 ? start : addDays(start, (8 - startDayOfWeek) % 7);
  
    // Obtenir les dates de la première semaine à partir du premier lundi
    const firstWeekDates = eachDayOfInterval({
      start: firstMonday,
      end: addDays(firstMonday, 6)
    });
  
    return firstWeekDates;
  }
  
  app.get('/first-week/:year/:month', (req, res) => {
    const { year, month } = req.params;
    const dates = getFirstWeekDates(parseInt(year), parseInt(month));
    res.json(dates.map(date => date.toISOString().split('T')[0]));
  });
  








// app.post("/Rahalahy/HampiditraAnjara",(req,res)=>{
//     const{Daty}=req.body;
// // Fonction pour récupérer un nom aléatoire de la table rahalahy
// function getRandomName(callback) {
//   db.query('SELECT Anarana FROM rahalahy ORDER BY RAND() LIMIT 1', (error, results) => {
//     if (error) throw error;
//     callback(results[0].nom);
//   });
// }

// // Fonction pour insérer une paire de noms dans la table anjara
// function insertPairIntoAnjara(nom1, nom2, date) {
//     db.query('INSERT INTO anjara (Anarana1, Anarana2,Anarana3,Anarana4,Daty) VALUES (?, ?, ?, ?, ?)', [nom1,nom2,nom1,nom2,date], (error, results) => {
//     if (error) throw error;
//     console.log('Paire insérée avec succès');
//   });
// }

// // Fonction pour générer toutes les dates jusqu'à la fin du mois
// function generateDates(startDate) {
//   const dates = [];
//   let currentDate = new Date(startDate);

//   while (currentDate.getMonth() === startDate.getMonth()) {
//     dates.push(new Date(currentDate));
//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   return dates;
// }

// // Fonction principale pour traiter la saisie de l'utilisateur
// function processUserInput(startDate) {
//   const dates = generateDates(startDate);
  
//   dates.forEach(date => {
//     getRandomName(nom1 => {
//       getRandomName(nom2 => {
//         insertPairIntoAnjara(nom1, nom2, date);
//       });
//     });
//   });
// }

// // Exemple d'utilisation
// const userInputDate = new Date("2024-05-01"); // Remplacez ceci par la date saisie par l'utilisateur
// processUserInput(userInputDate);

// });


// app.post("/HampiditraAnjaraFampiratiana", (req, res) => {
//     const { daty,ora,anarana } = req.body;

    
//     db.query('INSERT INTO fampirantiana (daty,ora,anarana) VALUES (?, ?,?)', [daty,ora,anarana], (error, results, fields) => {
//         if (error) throw error;
//         console.log("tafiditra");
//         console.log(`Ligne insérée pour ${Anarana} et ${AnaranaMiaraka} avec la date ${selectedDate}`);
//     });       

// });



                                        // HAMPIDITRA ANJARA VERSION FARANY


app.post("/HampiditraAnjaraFampiratiana", (req, res) => {
    const data = req.body;

    // Étape 1: Identifier le dimanche de la semaine la plus ancienne
    db.query(`
        SELECT DATE_SUB(daty, INTERVAL WEEKDAY(daty) DAY) AS oldestSunday
        FROM anjara
        GROUP BY WEEK(daty)
        ORDER BY oldestSunday ASC
        LIMIT 1
    `, (error, results, fields) => {
        if (error) {
            console.error("Erreur lors de la récupération du dimanche de la semaine la plus ancienne:", error);
            return res.status(500).send({ error: 'Erreur lors de la récupération des données de la base de données' });
        }

        const oldestSunday = results[0]?.oldestSunday;

        if (oldestSunday !== null && oldestSunday !== undefined) {
            // Étape 2: Supprimer les données de la semaine la plus ancienne
            db.query('DELETE FROM anjara WHERE DATE_SUB(daty, INTERVAL WEEKDAY(daty) DAY) = ?', [oldestSunday], (error, results, fields) => {
                if (error) {
                    console.error("Erreur lors de la suppression de la semaine la plus ancienne:", error);
                    return res.status(500).send({ error: 'Erreur lors de la suppression des données dans la base de données' });
                }

                console.log(`Suppression réussie des données de la semaine se terminant le ${oldestSunday}`);

                // Étape 3: Ajouter les nouvelles données
                data.forEach(entry => {
                    const { daty, ora, anarana1, anarana2 } = entry;
                    db.query('INSERT INTO anjara (daty, ora, anarana1, anarana2) VALUES (?, ?, ?, ?)', [daty, ora, anarana1, anarana2], (error, results, fields) => {
                        if (error) {
                            console.error("Erreur lors de l'insertion:", error);
                            return res.status(500).send({ error: 'Erreur lors de l\'insertion dans la base de données' });
                        }
                        console.log(`Insertion réussie pour ${anarana1} et ${anarana2} à ${daty} ${ora}`);
                    });
                });

                res.status(200).send({ message: 'Toutes les données ont été insérées avec succès' });
            });
        } else {
            // Si aucune semaine n'est trouvée, ajoutez simplement les nouvelles données
            data.forEach(entry => {
                const { daty, ora, anarana1, anarana2 } = entry;
                db.query('INSERT INTO anjara (daty, ora, anarana1, anarana2) VALUES (?, ?, ?, ?)', [daty, ora, anarana1, anarana2], (error, results, fields) => {
                    if (error) {
                        console.error("Erreur lors de l'insertion:", error);
                        return res.status(500).send({ error: 'Erreur lors de l\'insertion dans la base de données' });
                    }
                    console.log(`Insertion réussie pour ${anarana1} et ${anarana2} à ${daty} ${ora}`);
                });
            });

            res.status(200).send({ message: 'Toutes les données ont été insérées avec succès' });
        }
    });
});

















                                            // AJOUT AVEC SUPPRESSION SANS DIMANCHE


// app.post("/HampiditraAnjaraFampiratiana", (req, res) => {
//     Le tableau d'objets envoyé depuis le frontend
//     const data = req.body;

//     Étape 1: Identifier la semaine la plus ancienne
//     db.query('SELECT MIN(WEEK(daty)) AS oldestWeek FROM anjara', (error, results, fields) => {
//         if (error) {
//             console.error("Erreur lors de la récupération de la semaine la plus ancienne:", error);
//             return res.status(500).send({ error: 'Erreur lors de la récupération des données de la base de données' });
//         }

//         const oldestWeek = results[0].oldestWeek;

//         if (oldestWeek !== null) {
//             Étape 2: Supprimer les données de la semaine la plus ancienne
//             db.query('DELETE FROM anjara WHERE WEEK(daty) = ?', [oldestWeek], (error, results, fields) => {
//                 if (error) {
//                     console.error("Erreur lors de la suppression de la semaine la plus ancienne:", error);
//                     return res.status(500).send({ error: 'Erreur lors de la suppression des données dans la base de données' });
//                 }

//                 console.log(`Suppression réussie des données de la semaine ${oldestWeek}`);

//                 Étape 3: Ajouter les nouvelles données
//                 data.forEach(entry => {
//                     const { daty, ora, anarana1, anarana2 } = entry;
//                     db.query('INSERT INTO anjara (daty, ora, anarana1, anarana2) VALUES (?, ?, ?, ?)', [daty, ora, anarana1, anarana2], (error, results, fields) => {
//                         if (error) {
//                             console.error("Erreur lors de l'insertion:", error);
//                             return res.status(500).send({ error: 'Erreur lors de l\'insertion dans la base de données' });
//                         }
//                         console.log(`Insertion réussie pour ${anarana1} et ${anarana2} à ${daty} ${ora}`);
//                     });
//                 });

//                 Réponse au client après avoir traité toutes les insertions
//                 res.status(200).send({ message: 'Toutes les données ont été insérées avec succès' });
//             });
//         } else {
//             Si aucune semaine n'est trouvée, ajoutez simplement les nouvelles données
//             data.forEach(entry => {
//                 const { daty, ora, anarana1, anarana2 } = entry;
//                 db.query('INSERT INTO anjara (daty, ora, anarana1, anarana2) VALUES (?, ?, ?, ?)', [daty, ora, anarana1, anarana2], (error, results, fields) => {
//                     if (error) {
//                         console.error("Erreur lors de l'insertion:", error);
//                         return res.status(500).send({ error: 'Erreur lors de l\'insertion dans la base de données' });
//                     }
//                     console.log(`Insertion réussie pour ${anarana1} et ${anarana2} à ${daty} ${ora}`);
//                 });
//             });

//             Réponse au client après avoir traité toutes les insertions
//             res.status(200).send({ message: 'Toutes les données ont été insérées avec succès' });
//         }
//     });
// });











//                 ORIGINAL


// app.post("/HampiditraAnjaraFampiratiana", (req, res) => {
//     Le tableau d'objets envoyé depuis le frontend
//     const data = req.body; 

    
//     Parcourir chaque objet et insérer dans la base de données
//     data.forEach(entry => {
//         const { daty, ora, anarana1,anarana2 } = entry;
//         db.query('INSERT INTO anjara (daty, ora, anarana1,anarana2) VALUES (?, ?, ?, ?)', [daty, ora, anarana1,anarana2], (error, results, fields) => {
//             if (error) {
//                 console.error("Erreur lors de l'insertion:", error);
//                 return res.status(500).send({ error: 'Erreur lors de l\'insertion dans la base de données' });
//             }
//             console.log(`Insertion réussie pour ${anarana1} et ${anarana2}  à ${daty} ${ora}`);
//         });
//     });

//     Réponse au client après avoir traité toutes les insertions
//     res.status(200).send({ message: 'Toutes les données ont été insérées avec succès' });
// });


                                            //  AJOUT TABLEAU FAMPIRANTIANA ORIGINAL VUEJS FICHIER TableauCopy(Original)


    // app.post("/HampiditraAnjaraFampiratiana", (req, res) => {
        
    //     const data = req.body; 
    
      
    //     data.forEach(entry => {
    //         const { daty, ora, anarana } = entry;
    //         db.query('INSERT INTO fampirantiana (daty, ora, anarana) VALUES (?, ?, ?)', [daty, ora, anarana], (error, results, fields) => {
    //             if (error) {
    //                 console.error("Erreur lors de l'insertion:", error);
    //                 return res.status(500).send({ error: 'Erreur lors de l\'insertion dans la base de données' });
    //             }
    //             console.log(`Insertion réussie pour ${anarana} à ${daty} ${ora}`);
    //         });
    //     });
    
     
    //     res.status(200).send({ message: 'Toutes les données ont été insérées avec succès' });
    // });









// Fonction pour générer toutes les dates jusqu'à la fin du mois
function generateDates(startDate) {
    const dates = [];
    let currentDate = new Date(startDate);
  
    while (currentDate.getMonth() === startDate.getMonth()) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }

  function getRandomDate(startDate, endDate) {
    // Calculer la différence entre les deux dates en millisecondes
    const difference = endDate.getTime() - startDate.getTime();
    // Générer un nombre aléatoire entre 0 et la différence
    const randomDifference = Math.random() * difference;
    // Ajouter ce nombre aléatoire à la date de départ
    const randomDate = new Date(startDate.getTime() + randomDifference);
    return randomDate;
}



app.post("/Rahalahy/HampiditraAnjara", (req, res) => {
    const { Daty } = req.body;
    // Convertir la date saisie en objet Date JavaScript
    const dateSaisie = new Date(Daty);

    // Obtenir la dernière date du mois correspondant à la date saisie
    const dernierJourDuMois = new Date(dateSaisie.getFullYear(), dateSaisie.getMonth() + 2, 0);

    // Stocker les dates déjà utilisées
    const datesUtilisees = new Set();

    // Créer un tableau de dates disponibles
    const datesDisponibles = [];
    let currentDate = new Date(dateSaisie);
    currentDate.setDate(1); // Début du mois
     while (currentDate <= dernierJourDuMois) {
        if (currentDate.getDay() === 5 || currentDate.getDay() === 0) { // 5 pour vendredi, 0 pour dimanche
            datesDisponibles.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1); // Passer à la prochaine date
    }

    db.query('SELECT Anarana FROM Rahalahy', (error, results, fields) => {
        if (error) throw error;

        const noms = results.map(row => row.Anarana);
        let indexNom = 0; // Index pour parcourir les noms

        // Tant qu'il reste des dates disponibles
        while (datesDisponibles.length > 0) {
            const Anarana = noms[indexNom];
            const selectedDate = datesDisponibles.shift();
            // Choisir aléatoirement un accompagnant qui n'est pas déjà associé à ce nom
            let AnaranaMiaraka,Anarana2,AnaranaMiaraka2;

           do {
                AnaranaMiaraka = noms[Math.floor(Math.random() * noms.length)];
            } while (AnaranaMiaraka === Anarana || AnaranaMiaraka === Anarana2 || AnaranaMiaraka === AnaranaMiaraka2 || Anarana === "Jaffrelot" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jaffrelot" && AnaranaMiaraka === "Jeremy" || Anarana === "Jeremy" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jeremy" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jeremy" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jaffrelot" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Jaffrelot");

            do {
                Anarana2 = noms[Math.floor(Math.random() * noms.length)];
            } while (Anarana2 === Anarana || Anarana2 === AnaranaMiaraka || Anarana2 === AnaranaMiaraka2 || Anarana === "Jaffrelot" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jaffrelot" && AnaranaMiaraka === "Jeremy" || Anarana === "Jeremy" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jeremy" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jeremy" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jaffrelot" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Jaffrelot");
            do {
                AnaranaMiaraka2 = noms[Math.floor(Math.random() * noms.length)];
            } while (AnaranaMiaraka2 === Anarana || AnaranaMiaraka2 === AnaranaMiaraka || AnaranaMiaraka2 === Anarana2 || Anarana === "Jaffrelot" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jaffrelot" && AnaranaMiaraka === "Jeremy" || Anarana === "Jeremy" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jeremy" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jeremy" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jaffrelot" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Jaffrelot");



            // Insérer une nouvelle ligne dans la table Anjara avec le nom, l'accompagnant et la date
            db.query('INSERT INTO Anjara (Anarana1, Anarana2, Anarana3, Anarana4, Daty) VALUES (?, ?, ?, ?, ?)', [Anarana, AnaranaMiaraka, Anarana2, AnaranaMiaraka2, selectedDate], (error, results, fields) => {
                if (error) throw error;
                console.log(`Ligne insérée pour ${Anarana} et ${AnaranaMiaraka} avec la date ${selectedDate}`);
            });

            // Passer au prochain nom
            indexNom = (indexNom + 1) % noms.length;
        }
    });
});

app.delete("/HamafaAnjara",(req,res)=>{

    const hamafa="DELETE FROM anjara";
    db.query(hamafa,(error,result)=>{
        if(error){
            console.log(error);
        }
        res.send(result);
    });
    
});





app.post("/Rahalahy/HampiditraAnjara_BACKUP", (req, res) => {
    const { Daty } = req.body;
    // Convertir la date saisie en objet Date JavaScript
    const dateSaisie = new Date(Daty);

    // Obtenir la dernière date du mois correspondant à la date saisie
    const dernierJourDuMois = new Date(dateSaisie.getFullYear(), dateSaisie.getMonth() + 2, 0);

    // Stocker les dates déjà utilisées
    const datesUtilisees = new Set();

    // Créer un tableau de dates disponibles
    const datesDisponibles = [];
    let currentDate = new Date(dateSaisie);
    currentDate.setDate(1); // Début du mois
     while (currentDate <= dernierJourDuMois) {
        if (currentDate.getDay() === 5 || currentDate.getDay() === 0) { // 5 pour vendredi, 0 pour dimanche
            datesDisponibles.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1); // Passer à la prochaine date
    }

    db.query('SELECT Anarana FROM Rahalahy', (error, results, fields) => {
        if (error) throw error;

        const noms = results.map(row => row.Anarana);
        let indexNom = 0; // Index pour parcourir les noms

        // Tant qu'il reste des dates disponibles
        while (datesDisponibles.length > 0) {
            
            const selectedDate = datesDisponibles.shift();
            // Choisir aléatoirement un accompagnant qui n'est pas déjà associé à ce nom
            let Anarana,AnaranaMiaraka,Anarana2,AnaranaMiaraka2;
            do {
                Anarana = noms[Math.floor(Math.random() * noms.length)];
    
            } while (Anarana === AnaranaMiaraka || Anarana === AnaranaMiaraka2 || Anarana === Anarana2 || Anarana === "Jaffrelot" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jaffrelot" && AnaranaMiaraka === "Jeremy" || Anarana === "Jeremy" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jeremy" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jeremy" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jaffrelot" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Jaffrelot");

            do {
                AnaranaMiaraka = noms[Math.floor(Math.random() * noms.length)];
            } while (AnaranaMiaraka === Anarana || AnaranaMiaraka === Anarana2 || AnaranaMiaraka === AnaranaMiaraka2 || Anarana === "Jaffrelot" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jaffrelot" && AnaranaMiaraka === "Jeremy" || Anarana === "Jeremy" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jeremy" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jeremy" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jaffrelot" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Jaffrelot");

            do {
                Anarana2 = noms[Math.floor(Math.random() * noms.length)];
            } while (Anarana2 === Anarana || Anarana2 === AnaranaMiaraka || Anarana2 === AnaranaMiaraka2 || Anarana === "Jaffrelot" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jaffrelot" && AnaranaMiaraka === "Jeremy" || Anarana === "Jeremy" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jeremy" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jeremy" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jaffrelot" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Jaffrelot");
            do {
                AnaranaMiaraka2 = noms[Math.floor(Math.random() * noms.length)];
            } while (AnaranaMiaraka2 === Anarana || AnaranaMiaraka2 === AnaranaMiaraka || AnaranaMiaraka2 === Anarana2 || Anarana === "Jaffrelot" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jaffrelot" && AnaranaMiaraka === "Jeremy" || Anarana === "Jeremy" && AnaranaMiaraka === "Jaffrelot" || Anarana === "Jeremy" && AnaranaMiaraka === "Bezalila" || Anarana === "Bezalila" && AnaranaMiaraka === "Jeremy" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jaffrelot" || Anarana2 === "Bezalila" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Bezalila" || Anarana2 === "Jaffrelot" && AnaranaMiaraka2 === "Jeremy" || Anarana2 === "Jeremy" && AnaranaMiaraka2 === "Jaffrelot");


            // Insérer une nouvelle ligne dans la table Anjara avec le nom, l'accompagnant et la date
            db.query('INSERT INTO Anjara (Anarana1, Anarana2, Anarana3, Anarana4, Daty) VALUES (?, ?, ?, ?, ?)', [Anarana, AnaranaMiaraka, Anarana2, AnaranaMiaraka2, selectedDate], (error, results, fields) => {
                if (error) throw error;
                console.log(`Ligne insérée pour ${Anarana} et ${AnaranaMiaraka} avec la date ${selectedDate}`);
            });

            // Passer au prochain nom
            
        }
    });
});









                                // METY BE IO METHODE IO

// app.post("/Rahalahy/HampiditraAnjara", (req, res) => {
//     const { Daty } = req.body;
//     // Convertir la date saisie en objet Date JavaScript
//     const dateSaisie = new Date(Daty);

//     // Obtenir la dernière date du mois correspondant à la date saisie
//     const dernierJourDuMois = new Date(dateSaisie.getFullYear(), dateSaisie.getMonth() + 1, 0);

//     // Stocker les dates déjà utilisées
//     const datesUtilisees = new Set();

//     // Créer un tableau de dates disponibles
//     const datesDisponibles = [];
//     let currentDate = new Date(dateSaisie);
//     while (currentDate <= dernierJourDuMois) {
//         datesDisponibles.push(new Date(currentDate));
//         currentDate.setDate(currentDate.getDate() + 1); // Passer à la prochaine date
//     }

//     db.query('SELECT Anarana FROM Rahalahy', (error, results, fields) => {
//         if (error) throw error;

//         const noms = results.map(row => row.Anarana);

//         // Pour chaque nom
//         noms.forEach(Anarana => {
//             const selectedDate = datesDisponibles.shift();
//             // Choisir aléatoirement un accompagnant qui n'est pas déjà associé à ce nom
//             let AnaranaMiaraka;
//             do {
//                 AnaranaMiaraka = noms[Math.floor(Math.random() * noms.length)];
//             } while (AnaranaMiaraka === Anarana);

//             // Insérer une nouvelle ligne dans la table Anjara avec le nom, l'accompagnant et la date
//             db.query('INSERT INTO Anjara (Anarana1, Anarana2, Anarana3, Anarana4, Daty) VALUES (?, ?, ?, ?, ?)', [Anarana, AnaranaMiaraka, AnaranaMiaraka, AnaranaMiaraka, selectedDate], (error, results, fields) => {
//                 if (error) throw error;
//                 console.log(`Ligne insérée pour ${Anarana} et ${AnaranaMiaraka} avec la date ${selectedDate}`);
//             });
//         });
//     });
// });


                    // FIN METY BE IO METHODE















// app.post("/Rahalahy/HampiditraAnjara", (req, res) => {
//     const { Daty } = req.body;
//     // Convertir la date saisie en objet Date JavaScript
//     const dateSaisie = new Date(Daty);

//     // Obtenir la dernière date du mois correspondant à la date saisie
//     const dernierJourDuMois = new Date(dateSaisie.getFullYear(), dateSaisie.getMonth() + 1, 0);

//     // Stocker les dates déjà utilisées
//     const datesUtilisees = new Set();

//     db.query('SELECT Anarana FROM Rahalahy', (error, results, fields) => {
//         if (error) throw error;

//         const noms = results.map(row => row.Anarana);

//         // Pour chaque jour du mois
//         let currentDate = new Date(dateSaisie);
//         while (currentDate <= dernierJourDuMois) {
//             // Vérifier si la date a déjà été utilisée
//             if (!datesUtilisees.has(currentDate.toDateString())) {
//                 datesUtilisees.add(currentDate.toDateString());
//                 // Pour chaque nom
//                 noms.forEach(Anarana => {
                    
//                     // Choisir aléatoirement un accompagnant qui n'est pas déjà associé à ce nom
//                     let AnaranaMiaraka;
//                     do {
//                         AnaranaMiaraka = noms[Math.floor(Math.random() * noms.length)];
//                     } while (AnaranaMiaraka === Anarana);

//                     // Insérer une nouvelle ligne dans la table Anjara avec le nom et l'accompagnant pour cette date
//                     db.query('INSERT INTO Anjara (Anarana1, Anarana2, Anarana3, Anarana4, Daty) VALUES (?, ?, ?, ?, ?)', [Anarana, AnaranaMiaraka, AnaranaMiaraka, AnaranaMiaraka, currentDate], (error, results, fields) => {
//                         if (error) throw error;
//                         console.log(`Ligne insérée pour ${Anarana} et ${AnaranaMiaraka} avec la date ${currentDate}`);
//                     });
//                 });
//                 // Ajouter la date à la liste des dates utilisées
               
//             }

//             // Passer à la prochaine date
//             currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
//         }
//     });
// });



// app.post("/Rahalahy/HampiditraAnjara", (req, res) => {
//     const { Daty } = req.body;
  
//     // Convertir la date saisie en objet Date JavaScript
//     const dateSaisie = new Date(Daty);
  
//     // Obtenir la dernière date du mois correspondant à la date saisie
//     const dernierJourDuMois = new Date(dateSaisie.getFullYear(), dateSaisie.getMonth() + 1, 0);
    
//     // Sélectionnez tous les noms de la table
//     db.query('SELECT Anarana FROM Rahalahy', (error, results, fields) => {
//       if (error) throw error;
//       const noms = results.map(row => row.Anarana);
//       // Associez chaque nom à un autre nom et générez une date pour chaque nom
//       noms.forEach(Anarana => {
//         let autreNom;
//         do {
//           autreNom = noms[Math.floor(Math.random() * noms.length)];
//         } while (autreNom === Anarana);
//         // Générez une date aléatoire entre la date saisie et la fin du mois correspondant
//         const dateAleatoire = faker.date.between(dateSaisie, dernierJourDuMois);
//         // Insérez les associations dans la table Anjara avec les dates correspondantes
//         db.query('INSERT INTO Anjara (Anarana1, Anarana2, Daty) VALUES (?, ?, ?)', [Anarana, autreNom, dateAleatoire], (error, results, fields) => {
//           if (error) throw error;
//           console.log(`Ligne insérée pour ${Anarana} et ${autreNom} avec la date ${dateAleatoire}`);
//         });
//       });
//       res.send('Associations générées avec succès !');
//     });
//   });
  

// Hampiditra Anjara
// app.post("/Rahalahy/HampiditraAnjara",(req,res)=>{
//     const{Rahalahy1,Rahalahy2,Rahalahy3,Rahalahy4,Daty}=req.body;
//     var Req = "INSERT INTO Anjara(Anarana1,Anarana2,Anarana3,Anarana4,Daty) VALUES (?,?,?,?,?)";
//     db.query(Req,[Rahalahy1,Rahalahy2,Rahalahy3,Rahalahy4,Daty],(err,resultat)=>{
//         if(err){
//             console.log("erreur");
//         }else{
//             res.send(resultat);
//         }
//     });
// });



        // IREO RAHALAHY
        app.get("/Rahalahy",(req,res)=>{
            var req = "SELECT Anarana FROM Rahalahy";
            db.query(req,(err,resultat)=>{
                if(err) throw err;
                else{
                    
                    res.send(resultat);
                
                }
            });
            
        });


        // IREO RAHALAHY MANANA ANJARA
        app.get("/Anjara",(req,res)=>{
            var req = "SELECT *FROM Anjara";
            db.query(req,(err,resultat)=>{
                if(err) throw err;
                else{
                    
                
                    res.send(resultat);
                
                }
            });
            
        });



    
        app.get("/hash",(req,res)=>{
            bcrypt.hash("manantena", 10, (err,hash)=>{
                return res.json({result: hash});
            })
        })

        // SE CONNECTER
        app.post("/SeConnecter", (req,res)=>{
            const {NIF,MotDePasse} = req.body;
            const requeteConnexion = 'SELECT * FROM contribuables where NIF=?';
            db.query(requeteConnexion, NIF, (err,results)=>{
                if(err){
                    console.log("Problème de connexion");
                }
                if(results.length > 0){
                    bcrypt.compare(MotDePasse, results[0].MotDePasse, (error,response)=>{
                    if(response){
                        const utilisateur = {
                            NIF: results[0].NIF,
                            Nom: results[0].Nom
                        }

                        let token = jwt.sign({userId: utilisateur.NIF}, 'my_secret_key');
                        return res.json({
                        title: 'connexion avec succès',
                        token: token,
                        })
                    }
                        else{
                            
                            return  res.status(401).json({
                                title:"Erreur de NIF ou mot de passe"
                            })         
                        }

                    })    
                }
                else{
                    return  res.status(401).json({
                        title:"Le contribuable n'existe pas"
                    })
                }
            })
        
        });


        // RECUPERATION UTILISATEUR

        function ensureToken(req,res,next){
            const bearerHeader = req.headers["authorization"];
            if(typeof bearerHeader !== 'undefined'){
                const bearer = bearerHeader.split(" ");
                const bearerToken = bearer[1];
                req.token = bearerToken;
                next();
            }
            else{
                res.sendStatus(403);
            }
        }


        app.get('/proteger', ensureToken, (req, res) => {
            jwt.verify(req.token, 'my_secret_key', (err, decoded) => {
              if (err) {
                res.sendStatus(403);
              } else {
                const userId = decoded.userId;
                db.query('SELECT * FROM contribuables WHERE NIF = ?', [userId], (err, results) => {
                  if (err) {
                    res.sendStatus(500); // Gestion de l'erreur de la requête SQL
                  } else {
                    if (results.length > 0) {
                      const Nom = results[0].Nom;
                      const Prenom = results[0].Prenom;
                      res.json({
                        userId: userId,
                        Nom: Nom,
                        Prenom: Prenom
                      });
                    } else {
                      res.sendStatus(404); // Aucun résultat trouvé
                    }
                  }
                });
              }
            });
          });          


        // AFFICHE DATE ET HEURE AUJOURDH'HUI 
        app.get("/AfficheDateHeure",(req,res)=>{
            var requeteAfficheDateHeure = "SELECT now() as dateHeure";
            db.query(requeteAfficheDateHeure,(err,resultat)=>{
                if(err) throw err;
                res.send(resultat);
            });
            
        });

        // LISTE DECLARATION
        app.get("/listeDeclaration/:NIF",(req,res)=>{
            const{NIF} = req.params;
            var requeteListeDeclaration = "SELECT *FROM Declaration,Type where(Declaration.idType = Type.idType) and NIF=?";
            db.query(requeteListeDeclaration,NIF,(err,resultat)=>{
                if(err) throw err;
                else{
                    if(resultat.length > 0){
                    res.send(resultat);
                }
                    else{
                        return  res.status(401).json({
                            title:"Aucune déclaration trouvée"
                        })
                    }
                }
            });
            
        });



        // LISTE TYPE EN SELECTIONNANT L'IDENTIFIANT
        app.get("/TypeSelectionner/:idType",(req,res)=>{
            const{idType} = req.params;
            var requeteListeType = "SELECT *FROM Type where idType=?";
            db.query(requeteListeType,idType,(err,resultat)=>{
                if(err) throw err;
                else{
                    res.send(resultat);                
                }
            });
            
        });

        // LISTE ID DECLARATION
        app.get("/listeIdDeclaration/:NIF",(req,res)=>{
            const{NIF} = req.params;
            var requeteListeIdDeclaration = "SELECT idDeclaration FROM declaration where statut='En cours' and NIF=?";
            db.query(requeteListeIdDeclaration,NIF,(err,resultat)=>{
                if(err) throw err;
                res.send(resultat);
            });
            
        });

        // AFFICHE DATE FIN PAIEMENT SELECTIONNANT LE ID DECLARATION

        app.get("/selectionIdDeclaration/:id",(req,res)=>{
            const{id} = req.params
            var requeteSelectionId = "SELECT DateFinPaiement FROM declaration where IdDeclaration=?";
            db.query(requeteSelectionId,id,(err,resultat)=>{
                if(err) throw err;
                res.send(resultat);
            });
            
        });





        // SELECTION DE ID DECLARATION ET AFFICHAGE IMPOTS A PAYER
        app.get("/afficheImpot/:id",(req,res)=>{
            const{id} = req.params
            var requeteListeIdDeclaration = "SELECT MontantDu FROM declaration where idDeclaration=?";
            db.query(requeteListeIdDeclaration,id,(err,resultat)=>{
                if(err) throw err;
                res.send(resultat);
            });
            
        });

        // RECUPERATION INFORMATION DECLARATION
        app.get("/FicheDeclaration/:id",(req,res)=>{ 
            const{id}= req.params;
            var requete = "SELECT Declaration.NIF,Declaration.BaseImposable,Type.NomType,contribuables.Nom,contribuables.Prenom,contribuables.NumTelephone,contribuables.Adresse,contribuables.Email,declaration.NIF,Taux,Activite,DateDeclaration,Nature FROM Declaration,contribuables,Type WHERE(contribuables.NIF=Declaration.NIF) and (Declaration.idType=Type.idType) and idDeclaration=?";
            db.query(requete,id,(err,resultat)=>{
                if(err) throw err;
                res.send(resultat);
            });
            
        });

        // RECUPERATION INFORMATION DECLARATION
        app.get("/AffichageRecepisser/:id",(req,res)=>{ 
            const{id}= req.params;
            var requete = "select *from contribuables,paiement,declaration,Type where(contribuables.NIF=paiement.NIF) and (declaration.idDeclaration=paiement.idDeclaration) and (declaration.idType=Type.idType) and paiement.RefPaiement=? and statut='Paye'";
            db.query(requete,id,(err,resultat)=>{
                if(err) throw err;
                res.send(resultat);
            });
            
        });

        // RECUPERATION MONTANT A PAYER
        app.get("/MontantAPayer/:id",(req,res)=>{ 
            const{id}= req.params;
            var requete = "SELECT sum(BaseImposable*(5/100)) as MontantApayer from declaration where idDeclaration=?";
            db.query(requete,id,(err,resultats)=>{
                if(err) throw err;
                res.send(resultats);
            });
            
        });

        // RECUPERATION INFORMATION DECLARATION
        app.get("/NomBeneficiaire/:id/:NomBanque",(req,res)=>{ 
            const{id,NomBanque}= req.params;
            var requete = "select NomTitulaire from banque where NumCompte=? and NomBanque=?";
            db2.query(requete,[id,NomBanque],(err,resultats)=>{
                if(err) throw err;
                if(resultats.length > 0){
                    res.send(resultats);
                }
                else{
                    res.status(401).json({
                        NomTitulaire:""
                    }) 
                }
                
                
            });
            
        });

// MODIFICATION DE DECLARATION

app.put("/EditerDeclaration/:id",(req,res)=>{
    const{id}=req.params;
    const{NIF,DateDeclaration,DateTransaction,BaseImposable,idType,NomCom,Taux,Nature,Detail,Activite,MontantDu,Statut,DateFinPaiement,Periode,Annee}=req.body;
    const requeteEditer="UPDATE declaration SET NIF=?,DateDeclaration=?,DateTransaction=?,BaseImposable=?,idType=?,NomCom=?,Taux=?,Nature=?,Detail=?,Activite=?,MontantDu=?,Statut=?,DateFinPaiement=?,Periode=?,Annee=? Where idDeclaration=?";
    db.query(requeteEditer,[NIF,DateDeclaration,DateTransaction,BaseImposable,idType,NomCom,Taux,Nature,Detail,Activite,MontantDu,Statut,DateFinPaiement,Periode,Annee,id],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
        }
    });
});

function convertToWords(number) {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

  let words = '';

  if (number >= 1000000) {
    const millions = Math.floor(number / 1000000);
    words += convertToWords(millions) + ' million ';
    number %= 1000000;
  }

  if (number >= 1000) {
    const thousands = Math.floor(number / 1000);
    words += convertToWords(thousands) + ' mille ';
    number %= 1000;
  }

  if (number >= 100) {
    const hundreds = Math.floor(number / 100);
    words += units[hundreds] + ' cent ';
    number %= 100;
  }

  if (number >= 20) {
    const tensDigit = Math.floor(number / 10);
    words += tens[tensDigit];
    const unitsDigit = number % 10;
    if (unitsDigit !== 0) {
      words += '-' + units[unitsDigit];
    }
  } else if (number >= 10) {
    words += teens[number - 10];
  } else if (number > 0) {
    words += units[number];
  }

  return words.trim();
}

  
  app.get('/conversion/:nombre', (req, res) => {
    const { nombre } = req.params;
    const num = parseInt(nombre);
    const lettre = convertToWords(num);
    res.send({lettre: lettre});
  });



// RECUPERATION DE DECLARATION A MODIFIER
app.get("/RecupererDeclaration/:idDeclaration",(req,res)=>{
    const{idDeclaration} = req.params
    var requeteAfficheDeclaration = "SELECT *FROM declaration,Type where(declaration.idType=Type.idType) and idDeclaration=?";
    db.query(requeteAfficheDeclaration,idDeclaration,(err,resultat)=>{
        if(err) throw err;
        res.send(resultat);
    });
    
});

// SUPPRESSION DECLARATION

app.delete("/SuppressionDeclaration/:id",(req,res)=>{
    const{id}= req.params;
    const requeteSuppression="DELETE FROM declaration WHERE idDeclaration=?";
    db.query(requeteSuppression,id,(error,result)=>{
        if(error){
            console.log(error);
        }
        res.send(result);
    });
});


        // INSCRIPTION EN TANT QUE CLIENT DU BANQUE
        app.post("/AjoutCompteBancaire", (req,res)=>{
            const {NumCompte,NomTitulaire,NomBanque,Solde,dateOuverture,Email,MotDePasse,ConfirmMotDePasse} = req.body;
            const requeteAjout="INSERT INTO banque (NumCompte,NomTitulaire,NomBanque,Solde,dateOuverture,Email,MotDePasse) VALUES (?,?,?,?,?,?,?)";
            if(MotDePasse !== ConfirmMotDePasse){
                console.log("Erreur de mot de passe!");
                res.status(500).json({erreur:'Mot de passe incorrect'});
            }            
            else{
                bcrypt.hash(MotDePasse,10, (err,crypterMotDePasse)=>{
                    if(err) return res.json({Error:"erreur cryptage mot de passe"});
                    db2.query(requeteAjout,[NumCompte,NomTitulaire,NomBanque,Solde,dateOuverture,Email,crypterMotDePasse],(error,result)=>{
                        if(error){
                            res.send(error);
                        }else{
                            res.send(result);
                            console.log(result); 
                        }
                
                    });
                });
                    
            }    
        });


        // SE CONNECTER AU COMPTE BANCAIRE
        app.post("/SeConnecterCompteBancaire", (req,res)=>{
            const {NumCompte,MotDePasse} = req.body;
            const requeteConnexion = 'SELECT * FROM banque where NumCompte=?';
            db2.query(requeteConnexion, NumCompte, (err,results)=>{
                if(err){
                    console.log("Problème de connexion");
                }
                if(results.length > 0){
                    const NumCompteBanque = results[0].NumCompte;
                    bcrypt.compare(MotDePasse, results[0].MotDePasse, (error,response)=>{
                    if(response){
                        return res.json({
                        title: 'connexion avec succès',
                        NumCompte: NumCompteBanque
                        })
                    }
                        else{
                            
                            return  res.status(401).json({
                                title:"Erreur de Numéro de compte ou mot de passe"
                            })         
                        }

                    })    
                }
                else{
                    return  res.status(401).json({
                        title:"Le client n'existe pas"
                    })
                }
            })
        
        });

         // EFFECTUER PAIEMENT
        app.post("/contribuable/effectuerPaiement/:soldeParam",(req,res)=>{
            const {soldeParam} = req.params;
            const{NIF,idDeclaration,DatePaiement,Montant,ModePaiement,dateHeure}=req.body;
            const{Numcompte}=req.body;
            const{NumcompteBancaire}=req.body;
            const{DateFinPaiement}=req.body;
            const{CleRib}=req.body;

            if(soldeParam == Montant){
                var RequeteEffectuerPaiement = "INSERT INTO Paiement(NIF,idDeclaration,DatePaiement,Montant,ModePaiement) VALUES (?,?,?,?,?)";
                var RequeteAjoutJournalisation = "INSERT INTO JournalisationActivites(NIF,Tache,DateActivite) VALUES (?,?,?)";
                if(DateFinPaiement > DatePaiement){
                db.query(RequeteEffectuerPaiement,[NIF,idDeclaration,DatePaiement,Montant,ModePaiement],(err,resultat)=>{
                if(err){
                    console.log("erreur RequeteEffectuerPaiement");
                }else{

                    if(ModePaiement == "Virement bancaire"){
                    // PAR VIREMENT BANCAIRE
                    
                    var RequeteModification = "UPDATE banque SET solde=solde - "+Montant+" WHERE NumCompte=?";
                    var RequeteModification2 = "UPDATE banque SET solde=solde + "+Montant+" WHERE NumCompte=? and Cle_Rib="+CleRib+"";
                    var RequeteStatut = "UPDATE declaration SET statut='En attente' WHERE idDeclaration="+idDeclaration+"";
                    

                    // JOURNALISATION DES ACTIVITES DU PAIEMENT
            const Tache = "Enregistrement du paiement par virement bancaire";
            db.query(RequeteAjoutJournalisation,[NIF,Tache,dateHeure],(err,resultat)=>{
            if(err){
                console.log("erreur");
            }else{
                console.log("enregisrement de journalisation");
            }
        })// FIN COMMENTAIRE DE JOURNALISATION

                    // MODIFICATION STATUT
                    db.query(RequeteStatut,idDeclaration,(error,result)=>{
                        if(error){
                        console.log(error);
                        }else{
                            console.log("Modification avec succes");
                        }
                });

                    // MODIFICATION 1
                    db2.query(RequeteModification,Numcompte,(error,result)=>{
                        if(error){
                        console.log(error);
                        }else{
                            console.log("Modification avec succes");
                        }
                });

                // MODIFICATION 2
                db2.query(RequeteModification2,NumcompteBancaire,(error,result)=>{
                    if(error){
                    console.log(error);
                    }else{
                        console.log("Modification avec succes");
                    }
            });
                    res.status(200).send("solde egale");
                    console.log("Vous pouvez transferer l'argent");
        }
                // FIN VIREMENT BANCAIRE

        else if(ModePaiement == "Carte bancaire"){

            // PAR CARTE BANCAIRE

                    var RequeteModification = "UPDATE banque SET solde=solde - "+Montant+" WHERE NumCompte=?";
                    var RequeteModification2 = "UPDATE banque SET solde=solde + "+Montant+" WHERE NumCompte=? and Cle_Rib="+CleRib+"";
                    var RequeteStatut = "UPDATE declaration SET statut='En attente' WHERE idDeclaration="+idDeclaration+"";
                
                     // JOURNALISATION DES ACTIVITES DU PAIEMENT
            const Tache = "Enregistrement du paiement par carte bancaire";
            db.query(RequeteAjoutJournalisation,[NIF,Tache,dateHeure],(err,resultat)=>{
            if(err){
                console.log("erreur");
            }else{
                console.log("enregisrement de journalisation");
            }
        })// FIN COMMENTAIRE DE JOURNALISATION




                    // MODIFICATION STATUT
                    db.query(RequeteStatut,idDeclaration,(error,result)=>{
                        if(error){
                        console.log(error);
                        }else{
                            console.log("Modification avec succes");
                        }
                });

                    // MODIFICATION 1
                    db2.query(RequeteModification,Numcompte,(error,result)=>{
                        if(error){
                        console.log(error);
                        }else{
                            console.log("Modification avec succes");
                        }
                });

                // MODIFICATION 2
                const NumcompteBancaire = "21310100176";
                db2.query(RequeteModification2,NumcompteBancaire,(error,result)=>{
                    if(error){
                    console.log(error);
                    }else{
                        console.log("Modification avec succes");
                    }
            });
                    res.status(200).send("solde egale");
                    console.log("Vous pouvez transferer l'argent");

        }// FIN CARTE BANCAIRE

                }
            })

        } // FIN DATEFINPAIEMENT
        else{

            res.status(200).send("Retard paiement");
            console.log("Retard de paiement");
        }

            }
            else if(soldeParam > Montant){
                
                var RequeteEffectuerPaiement = "INSERT INTO Paiement(NIF,idDeclaration,DatePaiement,Montant,ModePaiement) VALUES (?,?,?,?,?)";
                var RequeteAjoutJournalisation = "INSERT INTO JournalisationActivites(NIF,Tache,DateActivite) VALUES (?,?,?)";
                if(DateFinPaiement > DatePaiement){
                db.query(RequeteEffectuerPaiement,[NIF,idDeclaration,DatePaiement,Montant,ModePaiement],(err,resultat)=>{
                if(err){
                    console.log("erreur RequeteEffectuerPaiement solde>montant");
                }else{

                    if(ModePaiement == "Virement bancaire"){

                    // PAR VIREMENT BANCAIRE


                    var RequeteModification = "UPDATE banque SET solde=solde - "+Montant+" WHERE NumCompte=?";
                    var RequeteModification2 = "UPDATE banque SET solde=solde + "+Montant+" WHERE NumCompte=? and Cle_Rib="+CleRib+"";
                    var RequeteStatut = "UPDATE declaration SET statut='En attente' WHERE idDeclaration="+idDeclaration+"";

                     // JOURNALISATION DES ACTIVITES DU PAIEMENT
            const Tache = "Enregistrement du paiement par virement bancaire";
            db.query(RequeteAjoutJournalisation,[NIF,Tache,dateHeure],(err,resultat)=>{
            if(err){
                console.log("erreur");
            }else{
                console.log("enregisrement de journalisation");
            }
        })// FIN COMMENTAIRE DE JOURNALISATION




                    // MODIFICATION STATUT
                    db.query(RequeteStatut,idDeclaration,(error,result)=>{
                        if(error){
                        console.log(error);
                        }else{
                            console.log("Modification avec succes");
                        }
                });
                    // MODIFICATION 1
                    db2.query(RequeteModification,Numcompte,(error,result)=>{
                        if(error){
                        console.log(error);
                        }else{
                            console.log("Modification avec succes");
                        }
                });


                // MODIFICATION 2
                db2.query(RequeteModification2,NumcompteBancaire,(error,result)=>{
                    if(error){
                    console.log(error);
                    }else{
                        console.log("Modification avec succes");
                    }
            });
                    res.status(200).send("solde superieur");
                    console.log("solde superieur");
                
                }// FIN VIREMENT BANCAIRE 

                else if(ModePaiement == "Carte bancaire"){
                    // PAR CARTE BANCAIRE

                    var RequeteModification = "UPDATE banque SET solde=solde - "+Montant+" WHERE NumCompte=?";
                    var RequeteModification2 = "UPDATE banque SET solde=solde + "+Montant+" WHERE NumCompte=? and Cle_Rib="+CleRib+"";
                    var RequeteStatut = "UPDATE declaration SET statut='En attente' WHERE idDeclaration="+idDeclaration+"";
                    

                     // JOURNALISATION DES ACTIVITES DU PAIEMENT
            const Tache = "Enregistrement du paiement par carte bancaire";
            db.query(RequeteAjoutJournalisation,[NIF,Tache,dateHeure],(err,resultat)=>{
            if(err){
                console.log("erreur");
            }else{
                console.log("enregisrement de journalisation");
            }
        })// FIN COMMENTAIRE DE JOURNALISATION




                    // MODIFICATION STATUT
                    db.query(RequeteStatut,idDeclaration,(error,result)=>{
                        if(error){
                        console.log(error);
                        }else{
                            console.log("Modification avec succes");
                        }
                });

                    // MODIFICATION 1
                    db2.query(RequeteModification,Numcompte,(error,result)=>{
                        if(error){
                        console.log(error);
                        }else{
                            console.log("Modification avec succes");
                        }
                });

                // MODIFICATION 2
                const NumcompteBancaire = "21310100176";
                db2.query(RequeteModification2,NumcompteBancaire,(error,result)=>{
                    if(error){
                    console.log(error);
                    }else{
                        console.log("Modification avec succes");
                    }
            });
                    res.status(200).send("solde superieur");
                    console.log("solde superieur");
                
                }   //FIN CARTE BANCAIRE    
            
            }
            
            
            
            })


        } // FIN DE DATE FIN PAIEMENT

        else{
            res.status(200).send("Retard paiement");
            console.log("Retard de paiement");
        }

            }
            else{
                
                res.status(200).send("solde inferieur");
                console.log("solde inferieur");

            }

    
        });


        // LISTE PAIEMENT
        app.get("/listePaiement/:NIF",(req,res)=>{
            const{NIF} = req.params;
            var requeteListePaiement = "SELECT *FROM Paiement,declaration WHERE(Paiement.idDeclaration=declaration.idDeclaration) and Paiement.NIF=?";
            db.query(requeteListePaiement,NIF,(err,resultat)=>{
                if(err) throw err;
                else{
                    if(resultat.length > 0){
                    res.send(resultat);
                }
                    else{
                        return  res.status(401).json({
                            title:"Aucun paiement trouvé"
                        })
                    }
                }
                
            });
            
        });

        // AFFICHAGE SOLDE
        app.get("/afficheSolde/:NumCompte",(req,res)=>{
            const{NumCompte} = req.params
            var requeteSolde = "SELECT solde FROM banque WHERE NumCompte=?";
            db2.query(requeteSolde,NumCompte,(err,resultat)=>{
                if(err) throw err;
                res.send(resultat);
            });
            
        });

        // AFFICHAGE ADRESSE EMAIL
        app.get("/afficheAdresseEmail/:NumCompte",(req,res)=>{
            const{NumCompte} = req.params
            var requeteAfficheEmail = "SELECT Email FROM banque WHERE NumCompte=?";
            db2.query(requeteAfficheEmail,NumCompte,(err,resultat)=>{
                if(err) throw err;
                res.send(resultat);
            });
            
        });

        // INSERTION PAS ENCORE FINI
        app.get("/insertion/:NumCompte/:Montant",(req,res)=>{
            const {NumCompte,Montant} = req.params
            var requeteSolde = "SELECT solde FROM banque WHERE NumCompte=?";
            db2.query(requeteSolde,NumCompte,(err,resultat)=>{
                if(err) throw err;
                if(resultat[0].solde == Montant){
                    console.log("Vous pouvez transferer l'argent votre solde est de "+resultat[0].solde+"");
                }
                else if(resultat[0].solde > Montant){
                    console.log("solde superieur "+resultat[0].solde+" au montant ");
                }
                else{
                    console.log("solde inferieur au montant");
                }
                
            });
            
        });

        // LISTE DES ANNEXES
        app.get("/listeAnnexe/:NIF",(req,res)=>{
            const{NIF} = req.params;
            var requeteListeAnnexe = "SELECT declaration.NIF,contribuables.Nom,contribuables.Prenom,contribuables.NumCIN,paiement.DatePaiement,declaration.DateTransaction,declaration.Nature,declaration.Detail,paiement.ModePaiement,declaration.BaseImposable,declaration.MontantDu,contribuables.Adresse from declaration,paiement,contribuables where(declaration.idDeclaration=paiement.idDeclaration) and (contribuables.NIF=declaration.NIF) and declaration.NIF=?";
            db.query(requeteListeAnnexe,NIF,(err,resultat)=>{
                if(err) throw err;
                else{
                    if(resultat.length > 0){
                    res.send(resultat);
                }
                    else{
                        return  res.status(401).json({
                            title:"Aucune annexe trouvée"
                        })
                    }
                }
            });
            
        });


// Redirection
app.get('/rediriger/:idDeclaration', async (req, res) => {

    const idDeclaration = req.params.idDeclaration;
    var RequeteStatut = "UPDATE declaration SET statut='Paye' WHERE idDeclaration=?";

    // MODIFICATION STATUT
    db.query(RequeteStatut,idDeclaration,(error,result)=>{
        if(error){
        console.log(error);
        }else{
            console.log("Modification avec succes");
            // Notification validation
            notifier.notify({
                sound: true,
                title:'Validation de paiement',
                message:'Validation est avec succès',
                icon: path.join(__dirname + "./validation paiement.png")
            });
            res.redirect("http://localhost:5173/Paiement");
        }
        
});

});


  
        // INFORMATION DU CONTRIBUABLE

        app.get("/infoContribuable/:id",(req,res)=>{ 
            const{id}= req.params;
            var requete = "SELECT NIF,Nom,Prenom FROM contribuables WHERE NIF=?"
            db.query(requete,id,(err,resultat)=>{
                if(err) throw err;
                res.send(resultat);
            });
            
        });

        app.get("/NIFContribuable",(req,res)=>{ 
            const{id}= req.params;
            var requete = "SELECT NIF FROM contribuables";
            db.query(requete,id,(err,resultat)=>{
                if(err) throw err;
                res.send(resultat);
            });
            
        });


        // MODIFICATION CONTRIBUABLE
        app.post("/modifier/:id",(req,res)=>{ 
            const{id}=req.params;
            const{design,pu,stock}=req.body;
            const requeteModif="UPDATE produit SET design=? ,pu=?,stock=? Where numproduit=? ";
            db.query(requeteModif,[design,pu,stock,id],(error,result)=>{
            if(error){
            console.log(error);
            }else{
            res.send(result);
            }
    });
            
        });

        //create produit

// app.post("/produit/create",(req,res)=>{
//     const {numproduit,design,pu,stock} = req.body;
    
//     const sqlCreate="INSERT INTO produit (numproduit,design,pu,stock) VALUES (?,?,?,?)";
//     db.query(sqlCreate,[numproduit,design,pu,stock],(error,result)=>{
//         if(error){
//             console.log(error.sqlMessage);
//             res.send(error.sqlMessage);
//         }else{
//             res.send(result);
//             console.log(design); 
//         }

//     });
// });


        
        
        
        // Obtenir information du contribuable
        // app.get("/contribuable/AvoirInformation/:id",(req,res)=>{
        //     const{id}=req.params;
        //     var obtenirInformation = "SELECT * from contribuable where NIF = ? OR prenom LIKE '%"+id+"%'";
        //     db.query(obtenirInformation,id,(err,resultat)=>{
        //         if(err){
        //             console.log("erreur");
        //         }else{
        //             res.send(resultat);
        //         }
        //     })

        // });

        //S'authentifier
        // app.get("/contribuable/Authentification",(req,res)=>{
        //     const{NIF,MotDePasse}= req.body;
        //     var Authentification = "SELECT * from contribuable where NIF = ? AND MotDePasse = ?";
        //     db.query(Authentification,[NIF,MotDePasse],(err,resultat)=>{
        //         if(err){
        //             console.log("erreur");
        //         }else{
        //             res.send(resultat);
        //         }
        //     })

        // });





        
    
app.listen(port,function(){
    console.log("Le serveur fonctionne sur le port "+port+":"+" http://127.0.0.1:"+port);
});