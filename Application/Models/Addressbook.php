<?php 

use MVC\Model;

class ModelsAddressbook extends Model {


    public function getAllAddressBookData()
    {
        $return_data = [];

        $contacts = $this->getAllContacts();

        foreach ($contacts as $contact) {
            $return_data[] = [
                'contact' => $contact,
                'contact_info' => $this->getContactInfo($contact['id'])
            ];
        }

        return $return_data;
    }

    public function getAllContacts()
    {
        // sql statement
        $contacts_sql = "SELECT * FROM " . DB_PREFIX . "contacts";
        // exec query
//        $query = $this->db->query($contacts_sql);

        return $this->db->query($contacts_sql)->rows;

//        $data = [];
//        if ($query->num_rows) {
//            foreach($query->rows as $value):
//                $data['contacts'][] = $value;
//            endforeach;
//        }
//
//        return $data;

    }

    public function getContactById($contact_id)
    {
        // sql statement
        $contacts_sql = "SELECT * FROM contacts WHERE id = $contact_id";

        return $this->db->query($contacts_sql)->row;

    }

    public function getContactByPhone($contact_id)
    {
        // sql statement
        $contacts_sql = "SELECT * FROM contacts WHERE id = $contact_id";

        return $this->db->query($contacts_sql)->row;

    }

    public function getContactInfo($contact_id)
    {
        // sql statement
        $contact_info_sql = "SELECT * FROM contact_information WHERE contact_id = $contact_id";

        return $this->db->query($contact_info_sql)->rows;

    }

    public function searchByName($param) {
        $sql = "SELECT * FROM contacts WHERE name LIKE '%" . $this->db->escape($param['name']) . "%'OR surname LIKE '%" . $this->db->escape($param['surname']) . "%'";

        return $this->db->query($sql)->rows;
    }

    public function searchByAddress($param) {
        $sql = "SELECT * 
                FROM contacts as t1 
                LEFT JOIN contact_information as t2 on t1.id = t2.contact_id
                WHERE t2.contact_type = 'address'
                AND t2.contact_value 
                    LIKE '%" . $this->db->escape($param['address']) . "%'";

        return $this->db->query($sql)->rows;
    }

    public function getCountContacts() {
        $query = $this->db->query("SELECT COUNT(*) as total FROM contacts");

        return ($query->num_rows > 0) ? (int) $query->row['total'] : 0;
    }

    public function getCountPhoneNumbers() {
        $query = $this->db->query("SELECT COUNT(*) as total FROM contact_information WHERE contact_type = 'phone'");

        return ($query->num_rows > 0) ? (int) $query->row['total'] : 0;
    }

    public function getCountAddresses() {
        $query = $this->db->query("SELECT COUNT(*) as total FROM contact_information WHERE contact_type = 'address'");

        return ($query->num_rows > 0) ? (int) $query->row['total'] : 0;
    }

    public function newEntry($param)
    {
        $date_created = date('Y-m-d H:i:s');

        $name = $param['name'];
        $surname = $param['surname'];
        $nickname = $param['nickname'];
        $contact_type = $param['contact_type'];
        $contact_value = $param['contact_value'];

        $contact_id = $this->newContact($name,$surname, $nickname, $date_created);
        if ($contact_id === false) {
            return $contact_id;
        } else {
            return $this->newContactInfo($contact_id, $contact_type, $contact_value, $date_created);
        }

    }

    public function newContact($name, $surname, $nickname, $date_created, $date_updated)
    {
        // sql statement
        $sql = "INSERT INTO contacts (name, surname, nickname, date_created, date_updated) VALUES ('$name', '$surname', '$nickname', '$date_created', '$date_updated')";
        return $this->db->query($sql);
    }

    public function newContactInfo($contact_id, $contact_type, $contact_value, $date_created, $date_updated)
    {
        // sql statement
        $sql = "INSERT INTO contact_information (contact_id, contact_type, contact_value, date_created, date_updated) VALUES ('$contact_id', '$contact_type', '$contact_value', '$date_created', '$date_updated')";

        return $this->db->query($sql);

    }

    public function editContact($param)
    {
        $contact_id = $param['id'];
        $name = $param['name'];
        $surname = $param['surname'];
        $nickname = $param['nickname'];
        $last_updated = date('Y-m-d H:i:s');
        // sql statement
        $sql = "UPDATE contacts
                SET name=$name, surname=$surname, nickname=$nickname, last_updated=$last_updated
                WHERE id=$contact_id";

        return $this->db->query($sql)->success;

    }

    public function editContactInfo($param)
    {
        $id = $param['id'];
        $contact_id = $param['contact_id'];
        $contact_type = $param['contact_type'];
        $contact_value = $param['contact_value'];

        // sql statement
        $sql = "UPDATE contact_information
                SET contact_id=$contact_id, contact_type=$contact_type, contact_value=$contact_value
                WHERE id=$id";

        return $this->db->query($sql)->success;

    }

    public function deleteContact($param)
    {
        $id = $param['contact_id'];
        $sql = "DELETE FROM contacts
                WHERE id=$id";

        return $this->db->query($sql)->success;


    }

    public function deleteContactInfo($param)
    {

    }

    public function deleteAllContactInfo($param)
    {

    }





}
