	<nav class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid" id="containerFluid">		
			<?php if (isset($_SESSION['login'])): ?>
				<button class="btn btn-danger navbar-btn" id="save" form="form">Save</button>
				<ul class="nav navbar-nav navbar-right">
					<li>
						<div class="navbar-header">
	      					<span class="navbar-brand"><?php echo "User: " . htmlspecialchars($_SESSION['login']); ?></span>
	    				</div>
					</li>
					<li>
						<form action="logout.php">
    						<button type="submit" class="btn btn-info navbar-btn">Log out</button>
						</form>
					</li>
				</ul>
			<?php else: ?>	
				<ul class="nav navbar-nav navbar-right">
					<li>
						<div class="navbar-header">
	      					<span class="navbar-brand">For save option:</span>
	    				</div>
					</li>
					<li>
						<button class="btn btn-info navbar-btn" data-toggle="modal" data-target="#loginModal">Sign in</button>
					</li>
					<li>
						<button class="btn btn-info navbar-btn" data-toggle="modal" data-target="#regModal">Register</button>
					</li>
				</ul>
			<?php endif; ?>
		</div>
	</nav>