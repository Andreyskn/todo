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
if (isset($_SESSION['memberID'])) {
	try
	{
		$stmt = $pdo->prepare('SELECT tasktext, checkbox, tabid, tabname, refreshtime, liststyle, listsort
		FROM tasks 
		INNER JOIN tabs ON tabid = tabnumber
		WHERE tasks.userid = :userid
		AND tabs.userid = :userid');
		$stmt->bindValue(':userid', $_SESSION['memberID']);
		$stmt->execute();
		$result = $stmt->fetchAll();
	}
	catch (PDOException $e)
	{
		$output = 'Ошибка при извлечении: ' . $e->getMessage();
		include 'output.html.php';
		exit();
	}
	foreach ($result as $row)
	{
		$tasks[] = array(
		  'tasktext' => $row['tasktext'],
		  'checkbox' => $row['checkbox'],
		  'tabid' => $row['tabid'],
		  'tabname' => $row['tabname'],
		  'refreshtime' => $row['refreshtime'],
      'liststyle' => $row['liststyle'],
      'listsort' => $row['listsort']
		);
	}
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>TODO list</title>
	<link rel="stylesheet" href="bootstrap/css/bootstrap.css">
  <link rel="stylesheet" href="css/dragula.css">
</head>
<body>
	<!-- Modal 1-->
	<div id="loginModal" class="modal fade" role="dialog">
	  <div class="modal-dialog">

	    <!-- Modal content-->
	    <div class="modal-content">
	      <div class="modal-body">
	        <form action="login.php" method="post" id="loginForm">
	        	<div class="form-group">
				    <label for="login-name">Username:</label>
				    <input type="text" class="form-control" id="login-name" name="username">
				</div>
				<div class="form-group">
				    <label for="login-pwd">Password:</label>
				    <input type="password" class="form-control" id="login-pwd" name="password">
				</div>
	        </form>
	      </div>
	      <div class="modal-footer">
	      	<button type="submit" class="btn btn-success" form="loginForm">Submit</button>
	        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
	      </div>
	    </div>

	  </div>
	</div>

	<!-- Modal 2-->
	<div id="regModal" class="modal fade" role="dialog">
	  <div class="modal-dialog">

	    <!-- Modal content-->
	    <div class="modal-content">
	      <div class="modal-body">
	        <form action="register.php" method="post" id="regForm"  autocomplete="off">
	        	<div class="form-group">
				    <label for="reg-name">Username:</label>
				    <input type="text" class="form-control" id="reg-name" name="username">
				</div>
				<div class="form-group">
				    <label for="reg-pwd">Password:</label>
				    <input type="password" class="form-control" id="reg-pwd" name="password">
				</div>
				<div class="form-group">
				    <label for="reg-pwd-conf">Confirm password:</label>
				    <input type="password" class="form-control" id="reg-pwd-conf" name="passwordConfirm">
				</div>
	        </form>
	      </div>
	      <div class="modal-footer">
	      	<button type="submit" class="btn btn-success" form="regForm">Submit</button>
	        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
	      </div>
	    </div>

	  </div>
	</div>

	<?php
		include 'header.php';
	?>

	<div class="container" id="container">
		<form id="form" name="form" autocomplete="off" action="save.php" method="post">
			<ul id="Tabs" class="nav nav-tabs">
			<?php if (isset($_SESSION['memberID']) && !empty($tasks)): ?>
				<?php for ($i=0; $i < count($tasks); $i++): ?>
					<?php
						if (isset($tasks[$i - 1]) && $tasks[$i]['tabid'] == $tasks[$i - 1]['tabid']) {
							continue;
						}
					?>

					<li <?php if ($i == 0) {echo 'class="active"';}?> id="Tab[<?php echo $tasks[$i]['tabid']; ?>]">
						<a href="#" class="tab-link nodrag">
							<input type="text" class="noclick tabName" name="Tab[]" value="<?php echo $tasks[$i]['tabname']; ?>">
							<span class="closeTab">&times;</span>
						</a>
					</li>

				<?php endfor; ?>

					<li id="addTab">
						<a href="#" class="nodrag">+</a>
					</li>
				</ul>

				<?php for ($i=0; $i < count($tasks); $i++): 
						if ($i == 0 || $tasks[$i]['tabid'] != $tasks[$i - 1]['tabid']): ?>
							<div class="<?php if ($i == 0) {echo 'show ';}?>tabContent">
              <button type="button" class="list-styler icon-list"><input type="hidden" name="list-styler[]" value="<?php echo $tasks[$i]['liststyle']; ?>"></button>
              <button type="button" class="list-sorter icon-down-outline"><input type="hidden" name="list-sorter[]" value="<?php echo $tasks[$i]['listsort']; ?>"></button>
							<?php
							echo "<ol class='list-unstyled'>";
							$currentElmt = $i;
							for ($j=$i; $j < count($tasks); $j++):
								while (isset($tasks[$j]) && $tasks[$j]['tabid'] == $tasks[$currentElmt]['tabid']): ?>
										<li>
                        <input type='hidden' value='0' name='checkbox[<?php echo $tasks[$j]['tabid'];?>][]'>
                        <input type="checkbox" value="1" name="checkbox[<?php echo $tasks[$j]['tabid'];?>][]" <?php if ($tasks[$j]['checkbox'] == 1 && $tasks[$currentElmt]['refreshtime'] == NULL || $tasks[$j]['checkbox'] == 1 && time() < $tasks[$currentElmt]['refreshtime']) {echo 'checked="checked"';}?>>
							    			<textarea class="form-control" spellcheck="false" cols="50" rows="1" name="Task[<?php echo $tasks[$j]['tabid'];?>][]"><?php echo htmlspecialchars($tasks[$j]['tasktext'], ENT_QUOTES, 'UTF-8'); ?></textarea>
							    			<a href="#" class="close nodrag">&times;</a>
                        <span class="drag icon-hand-paper-o"></span>
							    		</li>
							<?php $j++;
								endwhile;
							endfor;
							echo "</ol>";
							echo '<a href="#" class="btn btn-success addTask nodrag">New task</a>';?>
							<div class="input-group-sm">
					    		<label for="daily[<?php echo $tasks[$currentElmt]['tabid'];?>]">Refresh daily:</label>
								<input class="refresh" type="checkbox" name="daily[<?php echo $tasks[$currentElmt]['tabid'];?>]" id="daily[<?php echo $tasks[$currentElmt]['tabid'];?>]"
								<?php if ($tasks[$currentElmt]['refreshtime'] != NULL) {echo 'checked="checked"';}?>>
								<input type="time" name="time[<?php echo $tasks[$currentElmt]['tabid'];?>]" <?php if ($tasks[$currentElmt]['refreshtime'] == NULL) {
									echo 'value="03:00" class="form-control" disabled="disabled"';
								} else {echo 'class="form-control" value="' . date("h:i", $tasks[$currentElmt]['refreshtime']) . '"';} ?>>
					    	</div>
							</div>							
						<?php endif;
				endfor; ?>
			<?php else: ?>	
				<li class="active" id="Tab[1]">
					<a href="#" class="tab-link nodrag">
						<input type="text" placeholder="Today" class="noclick tabName" name="Tab[]">
						<span class="closeTab">&times;</span>
					</a>
				</li>
				<li id="Tab[2]">
					<a href="#" class="tab-link nodrag">
						<input type="text" placeholder="Tomorrow" class="noclick tabName" name="Tab[]">
						<span class="closeTab">&times;</span>
					</a>
				</li>
				<li id="Tab[3]">
					<a href="#" class="tab-link nodrag">
						<input type="text" placeholder="This week" class="noclick tabName" name="Tab[]">
						<span class="closeTab">&times;</span>
					</a>
				</li>
				<li id="addTab">
					<a href="#" class="nodrag">+</a>
				</li>
			</ul>
			
		    <div class="show tabContent">
          <button type="button" class="list-styler icon-list"><input type="hidden" name="list-styler[]" value="0"></button>
          <button type="button" class="list-sorter icon-down-outline"><input type="hidden" name="list-sorter[]" value="0"></button>
		    	<ol class='list-unstyled'>
		    		<li>
              <input type='hidden' value='0' name='checkbox[1][]'>
              <input type="checkbox" value="1" name="checkbox[1][]">
		    			<textarea class="form-control" spellcheck="false" name="Task[1][]" cols="50" rows="1" autofocus></textarea>
		    			<a href="#" class="close nodrag">&times;</a>
              <span class="drag icon-hand-paper-o"></span>
		    		</li>
		    	</ol>
		    	<a href="#" class="btn btn-success addTask nodrag">New task</a>
		    	<div class="input-group-sm">
		    		<label for="daily[1]">Refresh daily:</label>
  					<input class="refresh" type="checkbox" name="daily[1]" id="daily[1]">
  					<input type="time" class="form-control" value="03:00" name="time[1]" disabled="disabled">
		    	</div>
		    </div>
		
			<div class="tabContent">
        <button type="button" class="list-styler icon-list"><input type="hidden" name="list-styler[]" value="0"></button>
        <button type="button" class="list-sorter icon-down-outline"><input type="hidden" name="list-sorter[]" value="0"></button>
				<ol class='list-unstyled'>
					<li>
            <input type='hidden' value='0' name='checkbox[2][]'>
            <input type="checkbox" value="1" name="checkbox[2][]">          
						<textarea class="form-control" spellcheck="false" name="Task[2][]" cols="50" rows="1"></textarea>
						<a href="#" class="close nodrag">&times;</a>
            <span class="drag icon-hand-paper-o"></span>
					</li>
				</ol>
				<a href="#" class="btn btn-success addTask nodrag">New task</a>
				<div class="input-group-sm">
		    	<label for="daily[2]">Refresh daily:</label>
					<input class="refresh" type="checkbox" name="daily[2]" id="daily[2]">
					<input type="time" class="form-control" value="03:00" name="time[2]" disabled="disabled">
		    </div>
			</div>
			
			<div class="tabContent">
        <button type="button" class="list-styler icon-list"><input type="hidden" name="list-styler[]" value="0"></button>
        <button type="button" class="list-sorter icon-down-outline"><input type="hidden" name="list-sorter[]" value="0"></button>
				<ol class='list-unstyled'>
					<li>
            <input type='hidden' value='0' name='checkbox[3][]'>
            <input type="checkbox" value="1" name="checkbox[3][]">          
						<textarea class="form-control" spellcheck="false" name="Task[3][]" cols="50" rows="1"></textarea>
						<a href="#" class="close nodrag">&times;</a>
            <span class="drag icon-hand-paper-o"></span>
					</li>
				</ol>
				<a href="#" class="btn btn-success addTask nodrag">New task</a>
				<div class="input-group-sm">
		    	<label for="daily[3]">Refresh daily:</label>
					<input class="refresh" type="checkbox" name="daily[3]" id="daily[3]">
					<input type="time" class="form-control" value="03:00" name="time[3]" disabled="disabled">
		    </div>
			</div>
			<?php endif; ?>
		</form>
	</div>
</body>
</html>

<script src='js/slip.js'></script>
<script src='js/dragula.js'></script>
<script src="js/jquery-3.2.1.js"></script>
<script src="js/main.js"></script>
<script src="js/ajax.js"></script>
<script src="js/bootstrap.js"></script>
<script src="js/resize.js"></script>