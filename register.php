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

// Validation

if(strlen($_POST['username']) < 3){
    $error[] = 'Username is too short.';
} else {
    $stmt = $pdo->prepare('SELECT username FROM users WHERE username = :username');
    $stmt->execute(array(':username' => $_POST['username']));
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!empty($row['username'])){
        $error[] = 'Username provided is already in use.';
    }
}

if(strlen($_POST['password']) < 3){
    $error[] = 'Password is too short.';
}
if($_POST['password'] != $_POST['passwordConfirm']){
    $error[] = 'Passwords do not match.';
}

if(isset($error)){
  foreach($error as $error){
    echo $error . "<br>";
  }
  echo '<br>' . '<a href="index.php">Back</a>';
}

//if no errors have been created carry on
if(!isset($error)){
    $hashedpassword = password_hash($_POST['password'], PASSWORD_BCRYPT);
	$stmt = $pdo->prepare('INSERT INTO users (username, password) VALUES (:username, :password)');
	$stmt->execute(array(
	    ':username' => $_POST['username'],
	    ':password' => $hashedpassword,
	));
    $lastID = $pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT username FROM users WHERE id = :lastID');
    $stmt->bindValue(':lastID', $lastID);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    session_start();
    $_SESSION['login'] = $row['username'];
    $_SESSION['memberID'] = $row['id'];
    header('Location: index.php');
}