create database dcim character set utf8 collate utf8_bin;

CREATE TABLE dcim.OBJECT_KEY (
  LAST_ID INT NOT NULL,
  PRIMARY KEY (LAST_ID)
 )ENGINE = InnoDB  DEFAULT CHARSET=utf8;
 
CREATE TABLE dcim.POSITION_RELATION (
  ID INT NOT NULL,
  OBJECT_TYPE INT NOT NULL,
  NAME varchar(128) NOT NULL,
  PARENT_ID INT,
  PRIMARY KEY (ID)
 )ENGINE = InnoDB  DEFAULT CHARSET=utf8;
 
CREATE TABLE dcim.ADMINISTRATIVE_REGION(
	ID INT NOT NULL,
  	NAME varchar(128) NOT NULL,
  	ABBREVIATION varchar(64) NOT NULL,
  	ZIP_CODE varchar(12) NOT NULL,
  	LONGITUDE FLOAT,
  	LATITUDE FLOAT,
  	ALTITUDE FLOAT
  PRIMARY KEY (ID)
)ENGINE = InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE dcim.BUILDING(
	ID INT NOT NULL,
  	NAME varchar(128) NOT NULL,
  	CODE varchar(32) NOT NULL,
  	PRIMARY KEY (ID)
)ENGINE = InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE dcim.ROOM(
	ID INT NOT NULL,
  	NAME varchar(128) NOT NULL,
  	CODE varchar(32) NOT NULL,
  	ROOM_TYPE INT NOT NULL,
  	PRIMARY KEY (ID)
)ENGINE = InnoDB  DEFAULT CHARSET=utf8;