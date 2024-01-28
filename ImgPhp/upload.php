<?php
require_once $_SERVER["DOCUMENT_ROOT"]."/Elab/api/utility/genericutils.php"; //NOSONAR

$con = new mysqli('localhost', 'root', '', 'immagini', 3306);
if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}

$target_Path = "Images/";
$target_Path = $target_Path.basename($_FILES['userFile']['name']);
echo $target_Path;
move_uploaded_file($_FILES['userFile']['tmp_name'], $target_Path);

$query=$con->prepare("INSERT INTO img SET path=?");
$query->bind_param("s", $target_Path);
$query->execute();

header("Location: http://localhost/img.php");
die();

?>