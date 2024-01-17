<!DOCTYPE html>
<html lang="en">
<meta charset="UTF-8">
<title>Page Title</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="login.css">

<style>

</style>

<script src=""></script>

<body>
    <div class="InteractionPane">
        <form name="SignInForm" action="" method="get">
            <h1>PlayPal</h1>
            
            <label for="emailSingIn">Email:</label><br>
            <input type="text" id="emailSingIn" name="emailSingIn" value=""><br>
            <input type="checkbox" id="remember" name="remember" value="">
            <label for="remember">Remember my Email</label><br>
            <label for="passwordSingIn">Password:</label><br>
            <input type="text" id="passwordSingIn" name="passwordSingIn" value=""><br>
            
            <button class="singIn">Sing in</button><br>
            <button class="createAccount">Create an Account</button>
        </form>
    </div>
    
</body>

</html>

<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $db_name = ""; //TODO: Inserisci il DB del progetto 
    $port = 3306;

    $dbh = new DatabaseHelper($servername, $username, $password, $db_name, $port);
?>