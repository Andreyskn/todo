-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Июл 01 2017 г., 18:06
-- Версия сервера: 10.1.21-MariaDB
-- Версия PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `todo`
--

-- --------------------------------------------------------

--
-- Структура таблицы `tabs`
--

CREATE TABLE `tabs` (
  `id` int(11) NOT NULL,
  `tabnumber` tinyint(3) UNSIGNED NOT NULL,
  `tabname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userid` int(11) NOT NULL,
  `refreshtime` int(10) UNSIGNED DEFAULT NULL,
  `liststyle` tinyint(1) UNSIGNED NOT NULL,
  `listsort` tinyint(1) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `tabs`
--

INSERT INTO `tabs` (`id`, `tabnumber`, `tabname`, `userid`, `refreshtime`, `liststyle`, `listsort`) VALUES
(7, 1, 'Today', 5, NULL, 0, 0),
(8, 2, 'never', 5, NULL, 0, 0),
(15, 1, 'Today', 6, NULL, 0, 0),
(16, 2, 'Tomorrow', 6, NULL, 0, 0),
(17, 3, 'This week', 6, NULL, 0, 0),
(20, 1, 'Tasks', 1, NULL, 0, 0),
(106, 1, 'Задачи Project Bus', 10, NULL, 0, 0),
(375, 1, 'Today', 4, NULL, 0, 1),
(376, 2, 'Tomorrow', 4, NULL, 1, 0),
(377, 3, 'This week', 4, NULL, 0, 1),
(383, 1, 'Ежедневные задачи', 8, 1498860000, 0, 1),
(384, 2, 'Задачи js', 8, NULL, 0, 1),
(385, 3, 'Переезд', 8, NULL, 0, 0),
(386, 4, 'Суббота', 8, NULL, 0, 0),
(387, 5, 'Воскресенье', 8, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `tasktext` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `checkbox` tinyint(1) UNSIGNED NOT NULL,
  `tabid` tinyint(3) UNSIGNED NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `tasks`
--

INSERT INTO `tasks` (`id`, `tasktext`, `checkbox`, `tabid`, `userid`) VALUES
(331, 'bar today task done', 1, 1, 5),
(332, 'bar today task', 0, 1, 5),
(333, 'bar never task 1 ', 0, 2, 5),
(334, 'bar never task 2', 0, 2, 5),
(335, 'bar never task 3 done', 1, 2, 5),
(386, '', 0, 1, 6),
(387, 'ssssssssssss', 0, 1, 6),
(388, 'vvvvvvvvvvv', 0, 1, 6),
(389, 'qqqqqqqqqqqq', 0, 2, 6),
(390, 'w', 0, 2, 6),
(391, 'we', 0, 2, 6),
(392, 'w', 1, 2, 6),
(393, 'ew', 1, 2, 6),
(394, 'e', 1, 2, 6),
(395, 'we', 1, 2, 6),
(396, '', 0, 2, 6),
(397, '', 0, 2, 6),
(398, 'qwqw', 0, 2, 6),
(399, 'cvvvvvvvvv', 0, 3, 6),
(400, '', 0, 3, 6),
(401, '', 0, 3, 6),
(402, 'bcvbcvbcvb', 0, 3, 6),
(409, 'all done', 0, 1, 1),
(835, 'пропарсить заново все маршруты в выходные', 0, 1, 10),
(836, 'проверить результаты парсинга на пустые массивы и ошибки каспера', 0, 1, 10),
(2697, '', 0, 1, 4),
(2698, '', 0, 2, 4),
(2699, '', 0, 3, 4),
(2735, 'Завтрак', 1, 1, 8),
(2736, 'Витамины', 1, 1, 8),
(2737, 'Обед', 1, 1, 8),
(2738, 'Тренировка', 1, 1, 8),
(2739, 'Протеин', 1, 1, 8),
(2740, 'Ужин', 0, 1, 8),
(2741, 'Прочитать статью, мануал или документацию', 0, 1, 8),
(2742, 'Потренировать печать на клавиатуре', 0, 1, 8),
(2743, 'Прочитать главу из книги', 0, 1, 8),
(2744, 'Написать несколько строк кода', 1, 1, 8),
(2745, 'Прогулка', 0, 1, 8),
(2746, 'добавить возможность переносить выполненные задачи в низ списка, при этом новые задачи должны появляться перед выполненными', 1, 2, 8),
(2747, 'нажатие Enter в поле ввода названя вкладки должно перемещать фокус на поле первой задачи если она пустая', 1, 2, 8),
(2748, 'нумерация списка задач должна быть опциональной ( .list-unstyled )', 1, 2, 8),
(2749, 'убарть инлайновые стили', 1, 2, 8),
(2750, 'отметка о выполнении задачи должна располагаться слева от текста задачи', 1, 2, 8),
(2751, 'удаление всего текста в последней задаче не должно приводить к удалению поля ввода этой задачи', 1, 2, 8),
(2752, 'возможность менять местами вкладки и задачи при помощи переноса', 1, 2, 8),
(2753, 'пофиксить ошибки dragula и slip', 1, 2, 8),
(2754, 'купить билет', 1, 3, 8),
(2755, 'составить список вещей, которые нужно купить перед поездкой', 0, 3, 8),
(2756, 'составить список вещей, которые нужно купить по приезду', 0, 3, 8),
(2757, 'выбрать сим-карту', 1, 3, 8),
(2758, 'разблокировать телефон', 1, 3, 8),
(2759, 'закрыть счета в ВТБ и сбере', 1, 3, 8),
(2760, 'изучить инфу по транспорту в спб', 0, 3, 8),
(2761, 'найти варианты доступа в интернет вне дома', 0, 3, 8),
(2762, 'найти вариаты недорогого питания в спб', 0, 3, 8),
(2763, 'скачать карту 2гис спб на телефон', 1, 3, 8),
(2764, 'перед отъездом составить список вакансий', 0, 3, 8),
(2765, 'прокатать паспорт', 0, 4, 8),
(2766, 'установить все нужные программы на ноутбук', 0, 4, 8),
(2767, 'отфарматировать жесткий диск на пк, откатить систему', 0, 5, 8),
(2768, 'определиться с вещами в дорогу', 0, 5, 8),
(2769, 'постирать нужные вещи', 0, 5, 8);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'andrey', '$2y$10$3MiC8BLet3OK1Nu4S6IUEubw3NI7YIphGjfdiG.7wqjoneI2.alhW'),
(2, 'user', '$2y$10$FJQ3KfhFTTWWTx9D1zE.9ePAMFIgR.PpCoQKb5AMl.GuTINmdMPYi'),
(3, 'biggy', '$2y$10$vcyAl4EO/yrps0W9qbLvvenRB/my/bxlHVa8dd5x245MfBOKKeRim'),
(4, 'foo', '$2y$10$pKpaAwsc256barGSeuIqzurFE9sKCL/ROdhNKtDSNxMCCKOoRokau'),
(5, 'bar', '$2y$10$pyhF4/SOEi/.yK8dr9Qxm.73Dpd4S9A/wnXZRIklITc.2l/OHtUn2'),
(6, 'baz', '$2y$10$kKymFy8jimkIg.L6ecIxcOJmXGbahluukaYBTtr7L5bxsJCFjWERG'),
(7, 'qux', '$2y$10$nypr371H9yW.EyVZDPHiTO7SpKNVwiCY8SXHdh.Xna0/hj7n5yPLG'),
(8, 'Developer', '$2y$10$g32SSrfIbcG962GykBjF8e1dnLfBpXnNeSWZJD42N5BpfvV45/58q'),
(9, 'test', '$2y$10$US4mcheilYMSHiNJoNVBTuBLyONtn3/76L1v.2I7lQVnr8yI3yFoy'),
(10, 'Bus', '$2y$10$UIjoI/7R96mjYMuwUzDXee3LfgKDbzlVyfhSHAUv7CJuU.VEIJQ2S');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `tabs`
--
ALTER TABLE `tabs`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `tasks`
--
ALTER TABLE `tasks`
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
-- AUTO_INCREMENT для таблицы `tabs`
--
ALTER TABLE `tabs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=388;
--
-- AUTO_INCREMENT для таблицы `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2770;
--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
