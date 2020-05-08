<?php

/**
 *
 * This file is part of mvc-rest-api for PHP.
 *
 */
namespace Database\DB\SQLite;

/**
 *  Global Class SQLITE
 */
final class SQLITE {

    /**
     * @var
     */
    private $sqlite = null;

    /**
     * @var
     */
    private $statement = null;

    /**
     *  Construct, create opject of PDO class
     */
    public function __construct($hostname, $username, $password, $database, $port) {
        try {

            $this->sqlite = new JDBC("sqlite:" . JSONDB . "mydatabase.sqlite");
//             $this->sqlite = new \SQLITE("mysql:host=" . $hostname . ";port=" . $port . ";dbname=" . $database, $username, $password, array(\SQLITE::ATTR_PERSISTENT => true));
        } catch(\PDOException $e) {
            trigger_error('Error: Could not make a database link ( ' . $e->getMessage() . '). Error Code : ' . $e->getCode() . ' <br />');
            exit();
        }

        // set default setting database
        $this->sqlite->exec("SET NAMES 'utf8'");
        $this->sqlite->exec("SET CHARACTER SET utf8");
        $this->sqlite->exec("SET CHARACTER_SET_CONNECTION=utf8");
        $this->sqlite->exec("SET SQL_MODE = ''");

    }

    /**
     * exec query statement
     */
    public function query($sql) {
        $this->statement = $this->sqlite->prepare($sql);
        $result = false;

        try {
            if ($this->statement && $this->statement->execute()) {
                $data = array();

                while ($row = $this->statement->fetch(\SQLITE::FETCH_ASSOC)) {
                    $data[] = $row;
                }

                // create std class
                $result = new \stdClass();
                $result->row = (isset($data[0]) ? $data[0] : array());
                $result->rows = $data;
                $result->num_rows = $this->statement->rowCount();
            }
        } catch (\SQLITEException $e) {
            trigger_error('Error: ' . $e->getMessage() . ' Error Code : ' . $e->getCode() . ' <br />' . $sql);
            exit();
        }

        if ($result) {
            return $result;
        } else {
            $result = new \stdClass();
            $result->row = array();
            $result->rows = array();
            $result->num_rows = 0;
            return $result;
        }
    }

    /**
     *  claen data
     */
    public function escape($value) {
        $search = array("\\", "\0", "\n", "\r", "\x1a", "'", '"');
        $replace = array("\\\\", "\\0", "\\n", "\\r", "\Z", "\'", '\"');
        return str_replace($search, $replace, $value);
    }

    /**
     *  return last id insert
     */
    public function getLastId() {
        return $this->sqlite->lastInsertId();
    }

    public function __destruct() {
        $this->sqlite = null;
    }
}
