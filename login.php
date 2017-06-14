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

try 
{
	$stmt = $pdo->prepare('SELECT password, username, id FROM users WHERE username = :username');
	$stmt->execute(array('username' => $_POST['username']));
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	if ($row['username'] == $_POST['username'])
	{
		if(password_verify($_POST['password'], $row['password']))
		{
		    session_start();
		    $_SESSION['login'] = $row['username'];
		    $_SESSION['memberID'] = $row['id'];
		    header('Location: index.php');
		}
		else {
			echo "Wrong password";
			echo '<br>' . '<a href="index.php">Back</a>';
		}
	}
	else {
		echo "Wrong username or password";
		echo '<br>' . '<a href="index.php">Back</a>';
	}
		

} 
catch(PDOException $e) 
{
    echo $e->getMessage();
}