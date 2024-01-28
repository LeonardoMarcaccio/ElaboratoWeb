<?php
require_once $_SERVER["DOCUMENT_ROOT"]."/Elab/api/utility/genericutils.php"; //NOSONAR

function grab($fileName) {
    $con = new mysqli('localhost', 'root', '', 'immagini', 3306);
    if ($con->connect_error) {
        die("Connection failed: " . $con->connect_error);
    }

    $target_Path = "Images/";
    $target_Path = $target_Path.basename($fileName);
    echo $target_Path;
    move_uploaded_file($_FILES['userFile']['tmp_name'], $target_Path);

    $query=$con->prepare("SELECT path from img where path=?");
    $query->bind_param("s", $target_Path);
    $query->execute();
    $path = mysqli_fetch_assoc($query->get_result());

    echo "
    <p>Pisnelo<\p>
    <img src='$path'>
    ";
}

?>