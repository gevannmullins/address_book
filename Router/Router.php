<?php

/**
 * The Web View/Interface Routes
 */
//$router->get('/', 'Web@index');

// address book
$router->get('/', 'Addressbook@view_addressbook');
$router->get('/address_book/add_new_view', 'Addressbook@view_new_addressbook');

/**
 * The address book data interface
 */
$router->get('/api/address_book', 'Addressbook@index');


$router->post('/api/address_book/add_new_contact', 'Addressbook@addNewContact');
$router->post('/api/address_book/add_new_contact_info', 'Addressbook@addNewContactInfo');
