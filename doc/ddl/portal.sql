create database portal character set utf8 collate utf8_bin;

CREATE TABLE portal.DEPARTMENT (
  ID INT NOT NULL AUTO_INCREMENT,
  NAME varchar(64) NOT NULL,
  DESCRIPTION varchar(255),
  PRIMARY KEY (ID)
 )ENGINE = InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE portal.ROLE(
 ID INT NOT NULL  AUTO_INCREMENT,
 NAME  varchar(64) NOT NULL,
 DESCRIPTION varchar(255),
 PRIMARY KEY (ID)
)ENGINE = InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE portal.ROLE_RIGHT(
	ROLE_ID INT NOT NULL,
	RIGHT_ID INT NOT NULL,
	PRIMARY KEY (ROLE_ID,RIGHT_ID),
	FOREIGN KEY (ROLE_ID) REFERENCES portal.ROLE (ID) on delete CASCADE
 )ENGINE = InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE portal.PERSONNEL_CFG (
  ID INT NOT NULL AUTO_INCREMENT,
  NAME varchar(64) NOT NULL,
  JOB_NUMBER varchar(64),
  E_MAIL varchar(64),
  TEL varchar(64),
  DEPARTMENT INT NOT NULL,
  ENABLE TINYINT(1) NOT NULL default 1,
  CREATE_TIME datetime,
  PRIMARY KEY (ID),
  UNIQUE KEY(NAME),
  UNIQUE KEY(JOB_NUMBER),
  FOREIGN KEY (DEPARTMENT) REFERENCES portal.DEPARTMENT (ID)
 )ENGINE = InnoDB  DEFAULT CHARSET=utf8;

 CREATE TABLE portal.ACCOUNT(
	ID INT NOT NULL,
	ACCOUNT varchar(64) NOT NULL,
	LOGIN_PASSWORD varchar(64) NOT NULL default '123456',
	PASSWORD_TIME datetime NOT NULL,
	DEFAULT_THEME varchar(64),
	IS_GOD TINYINT(1) NOT NULL default 0,
	ENABLE TINYINT(1) NOT NULL default 1,
	HOME_PAGE INT,
	PRIMARY KEY (ID),
	UNIQUE KEY(ACCOUNT),
	FOREIGN KEY (ID) REFERENCES portal.PERSONNEL_CFG (ID)
 )ENGINE = InnoDB  DEFAULT CHARSET=utf8;
 
  CREATE TABLE portal.ACCOUNT_ROLE(
	ACCOUNT_ID INT NOT NULL,
	ROLE_ID INT NOT NULL,
	PRIMARY KEY (ACCOUNT_ID,ROLE_ID),
	FOREIGN KEY (ACCOUNT_ID) REFERENCES portal.ACCOUNT (ID),
    FOREIGN KEY (ROLE_ID) REFERENCES portal.ROLE (ID)
 )ENGINE = InnoDB  DEFAULT CHARSET=utf8;
 
 CREATE TABLE portal.DASHBOARD(
	ACCOUNT_ID INT NOT NULL,
	ITEM_ID INT NOT NULL,
	COLUMN_INDEX INT NOT NULL,
	PRIMARY KEY (ACCOUNT_ID,ITEM_ID),
	FOREIGN KEY (ACCOUNT_ID) REFERENCES portal.ACCOUNT (ID) on delete CASCADE
 )ENGINE = InnoDB  DEFAULT CHARSET=utf8;
 
  CREATE TABLE portal.ACCOUNT_PASSWORD_LOG(
    SEQUENCE INT NOT NULL AUTO_INCREMENT,
	ACCOUNT_ID INT NOT NULL,
	CHANGE_TIME datetime NOT NULL,
	NEW_PASSWORD varchar(64),
	OLD_PASSWORD varchar(64),
	PRIMARY KEY (SEQUENCE)
  )ENGINE = InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO portal.DEPARTMENT(NAME)VALUES('测试');

INSERT INTO portal.PERSONNEL_CFG(NAME,JOB_NUMBER,DEPARTMENT,ENABLE,CREATE_TIME)
VALUES('奥特曼','123456', LAST_INSERT_ID(),1,sysdate());

INSERT INTO portal.ACCOUNT(ID,ACCOUNT,LOGIN_PASSWORD,PASSWORD_TIME,DEFAULT_THEME,ENABLE,IS_GOD)
VALUES(LAST_INSERT_ID(),'admin','123456',sysdate(),'default',1,1);


