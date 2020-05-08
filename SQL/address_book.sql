create table contact_information
(
  id            int(10) auto_increment,
  contact_id    int(10)      not null,
  contact_type  varchar(200) not null,
  contact_value varchar(200) not null,
  date_created  varchar(200) not null,
  date_updated  varchar(200) not null,
  primary key (id, contact_id)
);

create table contacts
(
  id           int(10) auto_increment
    primary key,
  name         varchar(200) not null,
  surname      varchar(200) not null,
  nickname     varchar(200) not null,
  date_created varchar(200) not null,
  date_updated varchar(200) not null
);

