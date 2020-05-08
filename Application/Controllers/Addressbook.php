<?php 

use MVC\Controller;
use MVC\View;

class ControllersAddressbook  extends Controller {


    public function view_addressbook()
    {
        $data_list = [];

        $model = $this->model('addressbook');
        $data_list['contacts'] = $model->getAllContacts();

        $model = $this->model('addressbook');
        $data_list['full_contacts'] = $model->getAllAddressBookData();

//        $data = $this->index(), true);
        return View::render('address_book/Home/index', $data_list);

    }

    public function view_new_addressbook()
    {
        $data_list = [];
        return View::render('address_book/add_edit_contact', $data_list);
    }



    public function index() {

        // Connect to database
        $model = $this->model('addressbook');

        // Read All Books And Authors Data
        $data_list = $model->getAllAddressBookData();

        // Send Response
        $this->response->sendStatus(200);
        $this->response->setContent($data_list);

        return $data_list;
    }

    public function getAllContacts() {

        $model = $this->model('addressbook');
        $data_list = $model->getAllContacts();

        // Send Response
        $this->response->sendStatus(200);
        $this->response->setContent($data_list);
    }

    public function searchAddress($param)
    {
        $model = $this->model('addressbook');
        $addresses = $model->searchByAddress($param);
        // Send Response
        $this->response->sendStatus(200);
        $this->response->setContent($addresses);
    }

    public function newEntry($param)
    {
        $model = $this->model('addressbook');
        $contact = $model->newContact($param);

    }

    public function addNewContact($param)
    {

        $query = $this->request->request;
        $name = $query['name'];
        $surname = $query['surname'];
        $nickname = $query['nickname'];
        $date_created = date('Y-m-d H:i:s');
        $date_updated = date('Y-m-d H:i:s');
//        print_r($query);

        $model = $this->model('addressbook');
        $contact = $model->newContact($name,$surname,$nickname,$date_created,$date_updated);
        // Send Response
        $this->response->sendStatus(200);
        $this->response->setContent($contact);

    }

    public function addNewContactInfo()
    {
        $query = $this->request->request;
        $contact_id = $query['contact_id'];
        $contact_type = $query['contact_type'];
        $contact_value = $query['contact_value'];
        $date_created = date('Y-m-d H:i:s');
        $date_updated = date('Y-m-d H:i:s');

        $model = $this->model('addressbook');
        $contact = $model->newContactInfo($contact_id,$contact_type,$contact_value,$date_created,$date_updated);
        // Send Response
        $this->response->sendStatus(200);
        $this->response->setContent($contact);

    }

    public function editContact()
    {

    }

    public function editContactInfo()
    {

    }

}
