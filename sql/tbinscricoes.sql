create table tbinscricoes (
    id serial primary key,
    nome varchar(150) not null,
    email varchar(100) not null,
    idatividade int not null,
    foreign key(idatividade) references tbatividades(id)
);