--
-- Database: `portfolio_local`
--

--
-- Table structure for table `datatable_left`
--

DROP TABLE IF EXISTS `datatable_left`;
CREATE TABLE IF NOT EXISTS `datatable_left` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255),
  `status` int(11),
  `date_created` varchar(255),
  `date_updated` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM;

--
-- Table structure for table `datatable_right`
--

DROP TABLE IF EXISTS `datatable_right`;
CREATE TABLE IF NOT EXISTS `datatable_right` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255),
  `status` int(11),
  `date_created` varchar(255),
  `date_updated` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM;

--
-- Dumping data for table `datatable_left/right`
--

INSERT INTO `datatable_right` (`id`, `name`, `status`, `date_created`, `date_updated`) VALUES
(1, 'Andrew Hunt', 1, '2018-08-14', '2018-08-14'),
(2, 'David Thomas', 1, '2018-08-14', '2018-08-14'),
(3, 'V. Anton Spraul', 1, '2018-08-14', '2018-08-14'),
(4, 'Neal Ford', 1, '2018-08-14', '2018-08-14'),
(5, 'Rosemary Wallner', 1, '2018-08-14', '2018-08-14'),
(6, 'Shelly Nielsen', 1, '2018-08-14', '2018-08-14'),
(7, 'Bruce Jackson', 1, '2018-08-14', '2018-08-14'),
(8, 'Paul Vickers', 1, '2018-08-14', '2018-08-14'),
(9, 'Sorin Cerin', 1, '2018-08-14', '2018-08-14'),
(10, 'Person 1', 1, '2018-08-14', '2018-08-14'),
(11, 'Person 2', 1, '2018-08-14', '2018-08-14'),
(12, 'Person 3', 1, '2018-08-14', '2018-08-14'),
(13, 'Person 4', 1, '2018-08-14', '2018-08-14'),
(14, 'Person 5', 1, '2018-08-14', '2018-08-14'),
(15, 'Person 6', 1, '2018-08-14', '2018-08-14'),
(16, 'Person 7', 1, '2018-08-14', '2018-08-14'),
(17, 'Person 8', 1, '2018-08-14', '2018-08-14'),
(18, 'Person 9', 1, '2018-08-14', '2018-08-14'),
(19, 'Person 10', 1, '2018-08-14', '2018-08-14'),
(20, 'Sayed Tayeb Jawad', 1, '2018-08-14', '2018-08-14'),
(21, 'Bahaudin Ghulam Mujtaba', 1, '2018-08-14', '2018-08-14');

-- --------------------------------------------------------

INSERT INTO `datatable_left` (`id`, `name`, `status`, `date_created`, `date_updated`) VALUES
(1, 'Erinn Banting', 1, '2018-08-14', '2018-08-14'),
(2, 'Meredith L. Runion', 1, '2018-08-14', '2018-08-14'),
(3, 'Moira Weigel', 1, '2018-08-14', '2018-08-14');


COMMIT;
