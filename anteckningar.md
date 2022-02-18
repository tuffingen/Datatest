mysql> ALTER TABLE users ADD name VARCHAR (140) NOT NULL;
mysql> INSERT INTO users (name) VALUES ('isac');
mysql> SELECT name FROM users;
mysql> use te19
mysql> CREATE TABLE tablename (id INT UNSIGNED AUTO_INCREMENT, PRIMARY KEY(id)) ENGINE = innodb character set 'utf8mb4';
mysql> delete from tasks where id = 5;
mysql> select * from tasks;
mysql> alter table tasks add created_at timestamp default now() not null;
mysql> update tasks SET task = 'ändra tasken', updated_at=now() where id=6;
mysql -u username -p för att logga in