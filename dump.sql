
-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Апр 03 2020 г., 10:44
-- Версия сервера: 10.4.11-MariaDB
-- Версия PHP: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `test`
--

-- --------------------------------------------------------

--
-- Структура таблицы `files`
--

CREATE TABLE `files` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(250) NOT NULL,
  `ext` varchar(50) NOT NULL,
  `mime` varchar(250) NOT NULL,
  `size` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `files`
--

INSERT INTO `files` (`id`, `name`, `ext`, `mime`, `size`, `user_id`, `created_at`, `updated_at`) VALUES
(19, 'dasdsadas6_2411466589152509_7449722829dsadsad327246503_n.jpg', 'jpg', 'image/jp1eg', 102335, 9, '2020-04-03 10:08:33', '2020-04-03 10:08:33'),
(20, '90094736_2411466589152509_7449722829327246503_n.jpg', 'jpg', 'image/jpeg', 102334, 9, '2020-04-03 10:09:26', '2020-04-03 10:09:26'),
(21, '90094736_2411466589152509_7449722829327246503_n.jpg', 'jpg', 'image/jpeg', 102334, 9, '2020-04-03 10:36:30', '2020-04-03 10:36:30'),
(22, '90094736_2411466589152509_7449722829327246503_n.jpg', 'jpg', 'image/jpeg', 102334, 9, '2020-04-03 10:36:31', '2020-04-03 10:36:31'),
(27, '90094736_2411466589152509_7449722829327246503_n.jpg', 'jpg', 'image/jpeg', 102334, 9, '2020-04-03 10:36:37', '2020-04-03 10:36:37'),
(28, '18646088_141961899682166_4324651305336307712_n.jpg', 'jpg', 'image/jpeg', 108325, 9, '2020-04-03 10:36:38', '2020-04-03 11:23:02'),
(29, '90094736_2411466589152509_7449722829327246503_n.jpg', 'jpg', 'image/jpeg', 102334, 9, '2020-04-03 10:36:39', '2020-04-03 10:36:39'),
(30, '90094736_2411466589152509_7449722829327246503_n.jpg', 'jpg', 'image/jpeg', 102334, 9, '2020-04-03 10:36:40', '2020-04-03 10:36:40'),
(31, '90094736_2411466589152509_7449722829327246503_n.jpg', 'jpg', 'image/jpeg', 102334, 9, '2020-04-03 10:36:41', '2020-04-03 10:36:41'),
(32, '90094736_2411466589152509_7449722829327246503_n.jpg', 'jpg', 'image/jpeg', 102334, 9, '2020-04-03 10:36:41', '2020-04-03 10:36:41'),
(33, '90094736_2411466589152509_7449722829327246503_n.jpg', 'jpg', 'image/jpeg', 102334, 9, '2020-04-03 10:36:43', '2020-04-03 10:36:43');

-- --------------------------------------------------------

--
-- Структура таблицы `tokens`
--

CREATE TABLE `tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `access` varchar(200) NOT NULL,
  `refresh` varchar(200) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `access_exp` int(10) UNSIGNED NOT NULL,
  `refresh_exp` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `tokens`
--

INSERT INTO `tokens` (`id`, `access`, `refresh`, `user_id`, `access_exp`, `refresh_exp`) VALUES
(8, '7660e85586e3f60b07d5c957f0898317', 'd1fb19efe934e64f0c2fc7a8697c75c0', 6, 1585879570, 1585965370),
(10, 'f4f49a8660e74f20d09430a5b0b82896', '0673646c9bfc76b3eac05d9cc99a8e75', 8, 1585882435, 1585968235),
(17, '6b292c65c080e0caef4927951c7594b5', 'd2d6123ed64e0ecb8d8dd52953ef8288', 10, 1585889335, 1585975135),
(26, '636d2659f2bbc651c795ef6fd0a1795f', '87f4cca4c64257d0726ddf836a78b85b', 9, 1585903030, 1585988830);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `login` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `login`, `password`) VALUES
(5, 'test@test.ru', 'd8578edf8458ce06fbc5bb76a58c5ca4'),
(6, 'test1@test.ru', 'd8578edf8458ce06fbc5bb76a58c5ca4'),
(7, 'test2@test.ru', 'd8578edf8458ce06fbc5bb76a58c5ca4'),
(8, 'test3@test.ru', 'd8578edf8458ce06fbc5bb76a58c5ca4'),
(9, 'test4@test.ru', 'd8578edf8458ce06fbc5bb76a58c5ca4'),
(10, 'sdsad@wda.ru', '202cb962ac59075b964b07152d234b70');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `files`
--
ALTER TABLE `files`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT для таблицы `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
