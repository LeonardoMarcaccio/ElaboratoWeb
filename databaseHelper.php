<?php
    class DatabaseHelper{
        private $db;
        
        public function __construct($servername, $username, $password, $dbname, $port) {
            $this->db = new mysqli($servername, $username, $password, $dbname, $port);
            if ($this->db->connect_error) {
                die("Connection failed: " . $this->db->connect_error);
            }
        }

        public function validateSingIn($email, $password) {
            $email = $_GET['emailSignIn'];
            $password = $$_GET['passwordSignIn'];

            if ($email != null && $password != null) {
                $query = "SELECT * FROM account WHERE email=$email AND password=$password";
                $stmt = $this->db->prepare($query);
                $stmt->execute();
                $account = mysqli_fetch_assoc($stmt->get_result());
                if(!empty($account)) {
                    #TODO : Vai al sito
                } else {
                    echo "Invalid Email or Password";
                }
            } else {
                echo "Error empty elements detected";
            }
        }
        

    }
?>