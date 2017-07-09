<?php
try
{
	$pdo = new PDO('mysql:host=localhost;dbname=todo', 'todouser', 'password');
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->exec('SET NAMES "utf8"');
}
catch (PDOException $e)
{
	$output = 'Unable to connect to the database server.';
	include 'output.html.php';
	exit();
}
session_start();
if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
	try
	{
		$s1 = $pdo->prepare('DELETE FROM tasks WHERE userid = :userid');
		$s1->bindValue(':userid', $_SESSION['memberID']);
		$s1->execute();

		$s2 = $pdo->prepare('DELETE FROM tabs WHERE userid = :userid');
		$s2->bindValue(':userid', $_SESSION['memberID']);
		$s2->execute();
	}
	catch (PDOException $e)
	{
		$output = 'Ошибка при добавлении в базу: ' . $e->getMessage();
		include 'output.html.php';
		exit();
	}
	 	for ($tabNumber=1; $tabNumber <= count($_POST['Tab']); $tabNumber++) {

	 		if (isset($_POST['time'][$tabNumber])) {
	 			if (strtotime($_POST['time'][$tabNumber]) <= time()) {
	 				$time = strtotime($_POST['time'][$tabNumber] . "+1 day");
	 			} else {
	 				$time = strtotime($_POST['time'][$tabNumber]);
	 			}
			} else {
				$time = NULL;
			}

			print_r($_POST);

	 		$sql = "INSERT INTO tabs (tabnumber, tabname, userid, refreshtime, liststyle, listsort)
	 		VALUES (:tabnumber, :tabname, :userid, :refreshtime, :liststyle, :listsort)";
	 		$stmt = $pdo->prepare($sql);
	 		$stmt->bindValue(':tabnumber', $tabNumber);
	 		$stmt->bindValue(':tabname', $_POST['Tab'][$tabNumber-1]);
	 		$stmt->bindValue(':userid', $_SESSION['memberID']);
	 		$stmt->bindValue(':refreshtime', $time);
	 		$stmt->bindValue(':liststyle', $_POST['list-styler'][$tabNumber-1]);
	 		$stmt->bindValue(':listsort', $_POST['list-sorter'][$tabNumber-1]);
	 		$stmt->execute();

	 		for ($i=0; $i < count($_POST['Task'][$tabNumber]); $i++) {
	 			$initial = implode('', $_POST['checkbox'][$tabNumber]);
				$edited = str_replace('01', '1', $initial);
				$checkBoxArray = str_split($edited);
	 			$sql = "INSERT INTO tasks (tasktext, checkbox, tabid, userid)
		 		VALUES (:tasktext, :checkbox, :tabid, :userid)";
		 		$s3 = $pdo->prepare($sql);
		 		$s3->bindValue(':tasktext', $_POST['Task'][$tabNumber][$i]);
		 		$s3->bindValue(':checkbox', $checkBoxArray[$i]);
		 		$s3->bindValue(':tabid', $tabNumber);
		 		$s3->bindValue(':userid', $_SESSION['memberID']);
		 		$s3->execute();
	 		}	 		
	 	}

	}
	header('Location: index.php');
	exit();