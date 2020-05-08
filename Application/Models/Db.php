<?php 

use MVC\Model;

class ModelsDb extends Model {

    public function conclusion($query)
    {
        $data = [];
        // Conclusion
        if ($query->num_rows) {
            foreach($query->rows as $key => $value):
                $data[$key] = $value;
            endforeach;
        }
        return $data;

    }

    public function getQuery()
    {

    }

    public function insertQuery()
    {

    }

    public function createTable($param)
    {
        $table_name = $param['table_name'];
        $sql = "
            CREATE TABLE IF NOT EXISTS $table_name (
                'id' int(11) NOT NULL AUTO_INCREMENT,
                'date_created' date NOT NULL,
                'date_updated' date NOT NULL,
                PRIMARY KEY ('id')
            ) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;
        ";

        // exec query
        $query = $this->db->query($sql);
        return $this->conclusion($query);

    }

    public function rawquery($sql){
        $query = $this->db->query($sql);
        return $this->conclusion($query);
    }

}
