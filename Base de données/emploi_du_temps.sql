-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 09 oct. 2024 à 12:38
-- Version du serveur : 10.4.24-MariaDB
-- Version de PHP : 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `emploi_du_temps`
--

-- --------------------------------------------------------

--
-- Structure de la table `cours`
--

CREATE TABLE `cours` (
  `idCours` int(11) NOT NULL,
  `Libelle` varchar(30) DEFAULT NULL,
  `Semestre` char(7) DEFAULT NULL,
  `NomSemestre` char(7) NOT NULL DEFAULT 'impair'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `cours`
--

INSERT INTO `cours` (`idCours`, `Libelle`, `Semestre`, `NomSemestre`) VALUES
(1, 'Algebre', 'S1', 'impair'),
(2, 'Analyse', 'S1', 'impair'),
(3, 'Probabilite et Statistique', 'S2', 'pair'),
(4, 'Mathematique discretes', 'S2', 'pair'),
(5, 'Algorithme', 'S1', 'impair'),
(6, 'Langage C', 'S2', 'pair'),
(7, 'POO', 'S2', 'pair'),
(8, 'HTML et CSS', 'S1', 'impair'),
(9, 'XML et DHTML', 'S2', 'pair'),
(10, 'Unix', 'S1', 'impair'),
(11, 'Windows', 'S1', 'impair'),
(12, 'Theorie de reseaux', 'S1', 'impair'),
(13, 'Architecture des ordinateurs', 'S1', 'impair'),
(14, 'Technologie des reseaux', 'S2', 'pair'),
(15, 'EA', 'S1', 'impair'),
(16, 'EN', 'S2', 'pair'),
(17, 'Systeme embarques', 'S2', 'pair'),
(18, 'Bases de l\'informatique', 'S1', 'impair'),
(19, 'Introduction aux methodes', 'S2', 'pair'),
(20, 'Comptabilite generale', 'S2', 'pair'),
(21, 'Anglais', 'S2', 'pair'),
(22, 'Francais', 'S1', 'impair'),
(23, 'Analyse 2', 'S1', 'impair'),
(24, 'Algebre 2', 'S1', 'impair'),
(25, 'Merise 1', 'S1', 'impair'),
(26, 'Technologie PHP', 'S1', 'impair'),
(27, 'UML', 'S5', 'impair'),
(28, 'Analyse numerique', 'S7', 'impair'),
(29, 'Analyse des donnees', 'S7', 'impair'),
(30, 'Methodes Agile', 'S9', 'impair');

-- --------------------------------------------------------

--
-- Structure de la table `date`
--

CREATE TABLE `date` (
  `idDate` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `HeureDeb` time DEFAULT NULL,
  `HeureFin` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `date`
--

INSERT INTO `date` (`idDate`, `date`, `HeureDeb`, `HeureFin`) VALUES
(6810, '2024-10-07', '07:00:00', '09:00:00'),
(6811, '2024-10-07', '09:00:00', '10:00:00'),
(6812, '2024-10-07', '10:00:00', '12:00:00'),
(6813, '2024-10-07', '13:00:00', '14:00:00'),
(6814, '2024-10-07', '14:00:00', '16:00:00'),
(6815, '2024-10-07', '16:00:00', '17:00:00'),
(6816, '2024-10-08', '07:00:00', '09:00:00'),
(6817, '2024-10-08', '09:00:00', '10:00:00'),
(6818, '2024-10-08', '10:00:00', '12:00:00'),
(6819, '2024-10-08', '13:00:00', '14:00:00'),
(6820, '2024-10-08', '14:00:00', '16:00:00'),
(6821, '2024-10-08', '16:00:00', '17:00:00'),
(6822, '2024-10-09', '07:00:00', '09:00:00'),
(6823, '2024-10-09', '09:00:00', '10:00:00'),
(6824, '2024-10-09', '10:00:00', '12:00:00'),
(6825, '2024-10-09', '13:00:00', '14:00:00'),
(6826, '2024-10-09', '14:00:00', '16:00:00'),
(6827, '2024-10-09', '16:00:00', '17:00:00'),
(6828, '2024-10-10', '07:00:00', '09:00:00'),
(6829, '2024-10-10', '09:00:00', '10:00:00'),
(6830, '2024-10-10', '10:00:00', '12:00:00'),
(6831, '2024-10-10', '13:00:00', '14:00:00'),
(6832, '2024-10-10', '14:00:00', '16:00:00'),
(6833, '2024-10-10', '16:00:00', '17:00:00'),
(6834, '2024-10-11', '07:00:00', '09:00:00'),
(6835, '2024-10-11', '09:00:00', '10:00:00'),
(6836, '2024-10-11', '10:00:00', '12:00:00'),
(6837, '2024-10-11', '13:00:00', '14:00:00'),
(6838, '2024-10-11', '14:00:00', '16:00:00'),
(6839, '2024-10-11', '16:00:00', '17:00:00'),
(6840, '2024-10-07', '09:00:00', '10:00:00'),
(6841, '2024-10-07', '09:00:00', '10:00:00'),
(6842, '2024-10-07', '10:00:00', '12:00:00'),
(6843, '2024-10-07', '10:00:00', '12:00:00'),
(6844, '2024-10-07', '14:00:00', '16:00:00'),
(6845, '2024-10-07', '16:00:00', '17:00:00'),
(6846, '2024-10-08', '09:00:00', '10:00:00'),
(6847, '2024-10-08', '09:00:00', '10:00:00'),
(6848, '2024-10-08', '10:00:00', '12:00:00'),
(6849, '2024-10-08', '13:00:00', '14:00:00'),
(6850, '2024-10-08', '14:00:00', '16:00:00'),
(6851, '2024-10-08', '16:00:00', '17:00:00'),
(6852, '2024-10-09', '07:00:00', '09:00:00'),
(6853, '2024-10-09', '09:00:00', '10:00:00'),
(6854, '2024-10-09', '10:00:00', '12:00:00'),
(6855, '2024-10-09', '13:00:00', '14:00:00'),
(6856, '2024-10-09', '14:00:00', '16:00:00'),
(6857, '2024-10-09', '16:00:00', '17:00:00'),
(6858, '2024-10-10', '07:00:00', '09:00:00'),
(6859, '2024-10-10', '09:00:00', '10:00:00'),
(6860, '2024-10-10', '10:00:00', '12:00:00'),
(6861, '2024-10-10', '13:00:00', '14:00:00'),
(6862, '2024-10-10', '14:00:00', '16:00:00'),
(6863, '2024-10-10', '16:00:00', '17:00:00'),
(6864, '2024-10-11', '07:00:00', '09:00:00'),
(6865, '2024-10-11', '09:00:00', '10:00:00'),
(6866, '2024-10-11', '10:00:00', '12:00:00'),
(6867, '2024-10-11', '13:00:00', '14:00:00'),
(6868, '2024-10-11', '14:00:00', '16:00:00'),
(6869, '2024-10-11', '16:00:00', '17:00:00'),
(6870, '2024-10-07', '07:00:00', '09:00:00'),
(6871, '2024-10-07', '09:00:00', '10:00:00'),
(6872, '2024-10-07', '10:00:00', '12:00:00'),
(6873, '2024-10-07', '13:00:00', '14:00:00'),
(6874, '2024-10-07', '14:00:00', '16:00:00'),
(6875, '2024-10-07', '16:00:00', '17:00:00'),
(6876, '2024-10-08', '07:00:00', '09:00:00'),
(6877, '2024-10-08', '09:00:00', '10:00:00'),
(6878, '2024-10-08', '10:00:00', '12:00:00'),
(6879, '2024-10-08', '13:00:00', '14:00:00'),
(6880, '2024-10-08', '14:00:00', '16:00:00'),
(6881, '2024-10-08', '16:00:00', '17:00:00'),
(6882, '2024-10-09', '07:00:00', '09:00:00'),
(6883, '2024-10-09', '09:00:00', '10:00:00'),
(6884, '2024-10-09', '10:00:00', '12:00:00'),
(6885, '2024-10-09', '13:00:00', '14:00:00'),
(6886, '2024-10-09', '14:00:00', '16:00:00'),
(6887, '2024-10-09', '16:00:00', '17:00:00'),
(6888, '2024-10-10', '07:00:00', '09:00:00'),
(6889, '2024-10-10', '09:00:00', '10:00:00'),
(6890, '2024-10-10', '10:00:00', '12:00:00'),
(6891, '2024-10-10', '13:00:00', '14:00:00'),
(6892, '2024-10-10', '14:00:00', '16:00:00'),
(6893, '2024-10-10', '16:00:00', '17:00:00'),
(6894, '2024-10-11', '07:00:00', '09:00:00'),
(6895, '2024-10-11', '09:00:00', '10:00:00'),
(6896, '2024-10-11', '10:00:00', '12:00:00'),
(6897, '2024-10-11', '13:00:00', '14:00:00'),
(6898, '2024-10-11', '14:00:00', '16:00:00'),
(6899, '2024-10-11', '16:00:00', '17:00:00'),
(6900, '2024-10-07', '07:00:00', '09:00:00'),
(6901, '2024-10-07', '09:00:00', '10:00:00'),
(6902, '2024-10-07', '10:00:00', '12:00:00'),
(6903, '2024-10-07', '13:00:00', '14:00:00'),
(6904, '2024-10-07', '14:00:00', '16:00:00'),
(6905, '2024-10-07', '16:00:00', '17:00:00'),
(6906, '2024-10-08', '07:00:00', '09:00:00'),
(6907, '2024-10-08', '09:00:00', '10:00:00'),
(6908, '2024-10-08', '10:00:00', '12:00:00'),
(6909, '2024-10-08', '13:00:00', '14:00:00'),
(6910, '2024-10-08', '14:00:00', '16:00:00'),
(6911, '2024-10-08', '16:00:00', '17:00:00'),
(6912, '2024-10-09', '07:00:00', '09:00:00'),
(6913, '2024-10-09', '09:00:00', '10:00:00'),
(6914, '2024-10-09', '10:00:00', '12:00:00'),
(6915, '2024-10-09', '13:00:00', '14:00:00'),
(6916, '2024-10-09', '14:00:00', '16:00:00'),
(6917, '2024-10-09', '16:00:00', '17:00:00'),
(6918, '2024-10-10', '07:00:00', '09:00:00'),
(6919, '2024-10-10', '09:00:00', '10:00:00'),
(6920, '2024-10-10', '10:00:00', '12:00:00'),
(6921, '2024-10-10', '13:00:00', '14:00:00'),
(6922, '2024-10-10', '14:00:00', '16:00:00'),
(6923, '2024-10-10', '16:00:00', '17:00:00'),
(6924, '2024-10-11', '07:00:00', '09:00:00'),
(6925, '2024-10-11', '09:00:00', '10:00:00'),
(6926, '2024-10-11', '10:00:00', '12:00:00'),
(6927, '2024-10-11', '13:00:00', '14:00:00'),
(6928, '2024-10-11', '14:00:00', '16:00:00'),
(6929, '2024-10-11', '16:00:00', '17:00:00'),
(6930, '2024-10-07', '07:00:00', '09:00:00'),
(6931, '2024-10-07', '09:00:00', '10:00:00'),
(6932, '2024-10-07', '10:00:00', '12:00:00'),
(6933, '2024-10-07', '13:00:00', '14:00:00'),
(6934, '2024-10-07', '14:00:00', '16:00:00'),
(6935, '2024-10-07', '16:00:00', '17:00:00'),
(6936, '2024-10-08', '07:00:00', '09:00:00'),
(6937, '2024-10-08', '09:00:00', '10:00:00'),
(6938, '2024-10-08', '10:00:00', '12:00:00'),
(6939, '2024-10-08', '13:00:00', '14:00:00'),
(6940, '2024-10-08', '14:00:00', '16:00:00'),
(6941, '2024-10-08', '16:00:00', '17:00:00'),
(6942, '2024-10-09', '07:00:00', '09:00:00'),
(6943, '2024-10-09', '09:00:00', '10:00:00'),
(6944, '2024-10-09', '10:00:00', '12:00:00'),
(6945, '2024-10-09', '13:00:00', '14:00:00'),
(6946, '2024-10-09', '14:00:00', '16:00:00'),
(6947, '2024-10-09', '16:00:00', '17:00:00'),
(6948, '2024-10-10', '07:00:00', '09:00:00'),
(6949, '2024-10-10', '09:00:00', '10:00:00'),
(6950, '2024-10-10', '10:00:00', '12:00:00'),
(6951, '2024-10-10', '13:00:00', '14:00:00'),
(6952, '2024-10-10', '14:00:00', '16:00:00'),
(6953, '2024-10-10', '16:00:00', '17:00:00'),
(6954, '2024-10-11', '07:00:00', '09:00:00'),
(6955, '2024-10-11', '09:00:00', '10:00:00'),
(6956, '2024-10-11', '10:00:00', '12:00:00'),
(6957, '2024-10-11', '13:00:00', '14:00:00'),
(6958, '2024-10-11', '14:00:00', '16:00:00'),
(6959, '2024-10-11', '16:00:00', '17:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `emploidutemps`
--

CREATE TABLE `emploidutemps` (
  `idEmp` int(11) NOT NULL,
  `idCours` int(11) DEFAULT NULL,
  `idEns` int(11) DEFAULT NULL,
  `NumSalle` int(11) DEFAULT NULL,
  `idDate` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `emploidutemps`
--

INSERT INTO `emploidutemps` (`idEmp`, `idCours`, `idEns`, `NumSalle`, `idDate`) VALUES
(6629, 18, 1, 7, 6810),
(6630, NULL, NULL, NULL, 6811),
(6631, NULL, NULL, NULL, 6812),
(6632, 18, 1, 8, 6813),
(6633, 12, 2, 102, 6814),
(6634, 12, 2, 106, 6815),
(6635, 18, 1, 7, 6816),
(6636, 12, 2, 8, 6817),
(6637, NULL, NULL, NULL, 6818),
(6638, NULL, NULL, NULL, 6819),
(6639, NULL, NULL, NULL, 6820),
(6640, NULL, NULL, NULL, 6821),
(6641, NULL, NULL, NULL, 6822),
(6642, NULL, NULL, NULL, 6823),
(6643, NULL, NULL, NULL, 6824),
(6644, NULL, NULL, NULL, 6825),
(6645, NULL, NULL, NULL, 6826),
(6646, NULL, NULL, NULL, 6827),
(6647, NULL, NULL, NULL, 6828),
(6648, NULL, NULL, NULL, 6829),
(6649, NULL, NULL, NULL, 6830),
(6650, NULL, NULL, NULL, 6831),
(6651, NULL, NULL, NULL, 6832),
(6652, NULL, NULL, NULL, 6833),
(6653, NULL, NULL, NULL, 6834),
(6654, NULL, NULL, NULL, 6835),
(6655, NULL, NULL, NULL, 6836),
(6656, NULL, NULL, NULL, 6837),
(6657, NULL, NULL, NULL, 6838),
(6658, NULL, NULL, NULL, 6839),
(6659, 25, 1, 7, 6840),
(6660, NULL, NULL, NULL, 6841),
(6661, NULL, NULL, NULL, 6842),
(6662, 25, 1, 8, 6843),
(6663, NULL, NULL, NULL, 6844),
(6664, NULL, NULL, NULL, 6845),
(6665, 25, 1, 102, 6846),
(6666, NULL, NULL, NULL, 6847),
(6667, NULL, NULL, NULL, 6848),
(6668, NULL, NULL, NULL, 6849),
(6669, NULL, NULL, NULL, 6850),
(6670, NULL, NULL, NULL, 6851),
(6671, NULL, NULL, NULL, 6852),
(6672, NULL, NULL, NULL, 6853),
(6673, NULL, NULL, NULL, 6854),
(6674, NULL, NULL, NULL, 6855),
(6675, NULL, NULL, NULL, 6856),
(6676, NULL, NULL, NULL, 6857),
(6677, NULL, NULL, NULL, 6858),
(6678, NULL, NULL, NULL, 6859),
(6679, NULL, NULL, NULL, 6860),
(6680, NULL, NULL, NULL, 6861),
(6681, NULL, NULL, NULL, 6862),
(6682, NULL, NULL, NULL, 6863),
(6683, NULL, NULL, NULL, 6864),
(6684, NULL, NULL, NULL, 6865),
(6685, NULL, NULL, NULL, 6866),
(6686, NULL, NULL, NULL, 6867),
(6687, NULL, NULL, NULL, 6868),
(6688, NULL, NULL, NULL, 6869),
(6689, NULL, NULL, NULL, 6870),
(6690, NULL, NULL, NULL, 6871),
(6691, NULL, NULL, NULL, 6872),
(6692, NULL, NULL, NULL, 6873),
(6693, NULL, NULL, NULL, 6874),
(6694, NULL, NULL, NULL, 6875),
(6695, NULL, NULL, NULL, 6876),
(6696, NULL, NULL, NULL, 6877),
(6697, NULL, NULL, NULL, 6878),
(6698, NULL, NULL, NULL, 6879),
(6699, NULL, NULL, NULL, 6880),
(6700, NULL, NULL, NULL, 6881),
(6701, NULL, NULL, NULL, 6882),
(6702, NULL, NULL, NULL, 6883),
(6703, 27, 22, 7, 6884),
(6704, NULL, NULL, NULL, 6885),
(6705, NULL, NULL, NULL, 6886),
(6706, 27, 22, 8, 6887),
(6707, NULL, NULL, NULL, 6888),
(6708, NULL, NULL, NULL, 6889),
(6709, NULL, NULL, NULL, 6890),
(6710, NULL, NULL, NULL, 6891),
(6711, NULL, NULL, NULL, 6892),
(6712, NULL, NULL, NULL, 6893),
(6713, 27, 22, 102, 6894),
(6714, NULL, NULL, NULL, 6895),
(6715, NULL, NULL, NULL, 6896),
(6716, NULL, NULL, NULL, 6897),
(6717, NULL, NULL, NULL, 6898),
(6718, NULL, NULL, NULL, 6899),
(6719, NULL, NULL, NULL, 6900),
(6720, NULL, NULL, NULL, 6901),
(6721, NULL, NULL, NULL, 6902),
(6722, NULL, NULL, NULL, 6903),
(6723, NULL, NULL, NULL, 6904),
(6724, NULL, NULL, NULL, 6905),
(6725, NULL, NULL, NULL, 6906),
(6726, NULL, NULL, NULL, 6907),
(6727, NULL, NULL, NULL, 6908),
(6728, NULL, NULL, NULL, 6909),
(6729, NULL, NULL, NULL, 6910),
(6730, NULL, NULL, NULL, 6911),
(6731, 28, 16, 7, 6912),
(6732, NULL, NULL, NULL, 6913),
(6733, NULL, NULL, NULL, 6914),
(6734, NULL, NULL, NULL, 6915),
(6735, NULL, NULL, NULL, 6916),
(6736, NULL, NULL, NULL, 6917),
(6737, NULL, NULL, NULL, 6918),
(6738, NULL, NULL, NULL, 6919),
(6739, NULL, NULL, NULL, 6920),
(6740, NULL, NULL, NULL, 6921),
(6741, NULL, NULL, NULL, 6922),
(6742, NULL, NULL, NULL, 6923),
(6743, 28, 16, 8, 6924),
(6744, NULL, NULL, NULL, 6925),
(6745, NULL, NULL, NULL, 6926),
(6746, NULL, NULL, NULL, 6927),
(6747, NULL, NULL, NULL, 6928),
(6748, NULL, NULL, NULL, 6929),
(6749, NULL, NULL, NULL, 6930),
(6750, NULL, NULL, NULL, 6931),
(6751, NULL, NULL, NULL, 6932),
(6752, NULL, NULL, NULL, 6933),
(6753, NULL, NULL, NULL, 6934),
(6754, NULL, NULL, NULL, 6935),
(6755, NULL, NULL, NULL, 6936),
(6756, NULL, NULL, NULL, 6937),
(6757, NULL, NULL, NULL, 6938),
(6758, NULL, NULL, NULL, 6939),
(6759, NULL, NULL, NULL, 6940),
(6760, NULL, NULL, NULL, 6941),
(6761, 30, 11, 7, 6942),
(6762, NULL, NULL, NULL, 6943),
(6763, NULL, NULL, NULL, 6944),
(6764, NULL, NULL, NULL, 6945),
(6765, NULL, NULL, NULL, 6946),
(6766, NULL, NULL, NULL, 6947),
(6767, NULL, NULL, NULL, 6948),
(6768, NULL, NULL, NULL, 6949),
(6769, NULL, NULL, NULL, 6950),
(6770, NULL, NULL, NULL, 6951),
(6771, NULL, NULL, NULL, 6952),
(6772, NULL, NULL, NULL, 6953),
(6773, 30, 11, 8, 6954),
(6774, NULL, NULL, NULL, 6955),
(6775, NULL, NULL, NULL, 6956),
(6776, NULL, NULL, NULL, 6957),
(6777, NULL, NULL, NULL, 6958),
(6778, NULL, NULL, NULL, 6959);

-- --------------------------------------------------------

--
-- Structure de la table `enseignant`
--

CREATE TABLE `enseignant` (
  `idEns` int(11) NOT NULL,
  `Nom` varchar(80) DEFAULT NULL,
  `Prenom` varchar(50) DEFAULT NULL,
  `Grade` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `enseignant`
--

INSERT INTO `enseignant` (`idEns`, `Nom`, `Prenom`, `Grade`) VALUES
(1, 'R', 'Christian', 'D'),
(2, 'R', 'Siaka', 'D'),
(3, 'R', 'Michel', 'D'),
(4, 'R', 'Andry', 'D'),
(5, 'R', 'Haja', 'D'),
(6, 'R', 'Ferdinand', 'D'),
(7, 'R', 'Roger', 'D'),
(8, 'R', 'Lira', 'D'),
(9, 'R', 'Madison', 'D'),
(10, 'R', 'Benedicte', 'D'),
(11, 'R', 'Cyprien', 'D'),
(12, 'R', 'Antsa', 'D'),
(13, 'R', 'Gilante', 'D'),
(14, 'R', 'Venot', 'D'),
(15, 'R', 'Fontaine', 'D'),
(16, 'R', 'Bertin', 'D'),
(17, 'R', 'Volatiana', 'D'),
(18, 'R', 'Lea', 'D'),
(19, 'R', 'Hanta', 'D'),
(20, 'R', 'Herijaona', 'D'),
(21, 'R', 'Victor', 'D'),
(22, 'R', 'Hajarisena', 'D');

-- --------------------------------------------------------

--
-- Structure de la table `enseigner`
--

CREATE TABLE `enseigner` (
  `id_enseigner` int(11) DEFAULT NULL,
  `idEns` int(11) DEFAULT NULL,
  `idCours` int(11) DEFAULT NULL,
  `id_niveau` int(11) DEFAULT NULL,
  `id_parcour` int(11) DEFAULT NULL,
  `volumeHoraire` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `enseigner`
--

INSERT INTO `enseigner` (`id_enseigner`, `idEns`, `idCours`, `id_niveau`, `id_parcour`, `volumeHoraire`) VALUES
(1, 1, 18, 10, 5, 4),
(2, 1, 18, 10, 6, 4),
(3, 1, 18, 10, 7, 4),
(7, 1, 25, 20, 5, 4),
(8, 1, 25, 20, 7, 4),
(9, 2, 12, 10, 5, 4),
(10, 2, 12, 10, 6, 4),
(11, 2, 12, 10, 7, 4),
(12, 22, 27, 30, 5, 4),
(13, 22, 27, 30, 7, 4),
(14, 16, 28, 40, 5, 4),
(15, 16, 28, 40, 6, 4),
(16, 16, 28, 40, 7, 4),
(NULL, NULL, NULL, NULL, NULL, NULL),
(17, 11, 30, 50, 5, 4),
(18, 11, 30, 50, 7, 4);

-- --------------------------------------------------------

--
-- Structure de la table `niveau`
--

CREATE TABLE `niveau` (
  `id_niveau` int(11) NOT NULL,
  `NomNiveau` char(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `niveau`
--

INSERT INTO `niveau` (`id_niveau`, `NomNiveau`) VALUES
(10, 'L1'),
(20, 'L2'),
(30, 'L3'),
(40, 'M1'),
(50, 'M2');

-- --------------------------------------------------------

--
-- Structure de la table `parcour`
--

CREATE TABLE `parcour` (
  `id_parcour` int(11) NOT NULL,
  `NomParcour` char(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `parcour`
--

INSERT INTO `parcour` (`id_parcour`, `NomParcour`) VALUES
(5, 'GB'),
(6, 'SR'),
(7, 'IG');

-- --------------------------------------------------------

--
-- Structure de la table `salle`
--

CREATE TABLE `salle` (
  `NumSalle` int(11) NOT NULL,
  `Occupation` char(6) DEFAULT NULL,
  `Capacite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `salle`
--

INSERT INTO `salle` (`NumSalle`, `Occupation`, `Capacite`) VALUES
(7, 'Libre', 200),
(8, 'Libre', 200),
(102, 'Libre', 95),
(106, 'Libre', 95);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cours`
--
ALTER TABLE `cours`
  ADD PRIMARY KEY (`idCours`);

--
-- Index pour la table `date`
--
ALTER TABLE `date`
  ADD PRIMARY KEY (`idDate`);

--
-- Index pour la table `emploidutemps`
--
ALTER TABLE `emploidutemps`
  ADD PRIMARY KEY (`idEmp`),
  ADD KEY `fk_cours` (`idCours`),
  ADD KEY `fk_enseignant` (`idEns`),
  ADD KEY `fk_salle` (`NumSalle`),
  ADD KEY `fk_date` (`idDate`);

--
-- Index pour la table `enseignant`
--
ALTER TABLE `enseignant`
  ADD PRIMARY KEY (`idEns`);

--
-- Index pour la table `enseigner`
--
ALTER TABLE `enseigner`
  ADD KEY `idEns` (`idEns`),
  ADD KEY `idCours` (`idCours`),
  ADD KEY `id_niveau` (`id_niveau`),
  ADD KEY `id_parcour` (`id_parcour`);

--
-- Index pour la table `niveau`
--
ALTER TABLE `niveau`
  ADD PRIMARY KEY (`id_niveau`);

--
-- Index pour la table `parcour`
--
ALTER TABLE `parcour`
  ADD PRIMARY KEY (`id_parcour`);

--
-- Index pour la table `salle`
--
ALTER TABLE `salle`
  ADD PRIMARY KEY (`NumSalle`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cours`
--
ALTER TABLE `cours`
  MODIFY `idCours` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `date`
--
ALTER TABLE `date`
  MODIFY `idDate` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6960;

--
-- AUTO_INCREMENT pour la table `emploidutemps`
--
ALTER TABLE `emploidutemps`
  MODIFY `idEmp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6779;

--
-- AUTO_INCREMENT pour la table `enseignant`
--
ALTER TABLE `enseignant`
  MODIFY `idEns` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `emploidutemps`
--
ALTER TABLE `emploidutemps`
  ADD CONSTRAINT `fk_cours` FOREIGN KEY (`idCours`) REFERENCES `cours` (`idCours`),
  ADD CONSTRAINT `fk_date` FOREIGN KEY (`idDate`) REFERENCES `date` (`idDate`),
  ADD CONSTRAINT `fk_enseignant` FOREIGN KEY (`idEns`) REFERENCES `enseignant` (`idEns`),
  ADD CONSTRAINT `fk_salle` FOREIGN KEY (`NumSalle`) REFERENCES `salle` (`NumSalle`);

--
-- Contraintes pour la table `enseigner`
--
ALTER TABLE `enseigner`
  ADD CONSTRAINT `enseigner_ibfk_1` FOREIGN KEY (`idEns`) REFERENCES `enseignant` (`idEns`),
  ADD CONSTRAINT `enseigner_ibfk_2` FOREIGN KEY (`idCours`) REFERENCES `cours` (`idCours`),
  ADD CONSTRAINT `enseigner_ibfk_3` FOREIGN KEY (`id_niveau`) REFERENCES `niveau` (`id_niveau`),
  ADD CONSTRAINT `enseigner_ibfk_4` FOREIGN KEY (`id_parcour`) REFERENCES `parcour` (`id_parcour`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
