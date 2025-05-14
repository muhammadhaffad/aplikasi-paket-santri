create table asramas (
    id serial primary key,
    nama varchar(100),
    gedung varchar(100),
    created_at timestamp(0),
    updated_at timestamp(0),
    deleted_at timestamp(0)
);

create table santris (
    nis varchar(100) primary key,
    asrama_id int references asramas(id) on update cascade on delete restrict,
    nama varchar(100),
    alamat varchar(100),
    total_paket int,
    created_at timestamp(0),
    updated_at timestamp(0),
    deleted_at timestamp(0)    
);
create table paket_kategoris (
    id serial primary key,
    nama varchar(100),
    created_at timestamp(0),
    updated_at timestamp(0),
    deleted_at timestamp(0)
);
create table pakets (
    id serial primary key,
    kategori_id int references paket_kategoris(id) on update cascade on delete restrict,
    penerima_nis varchar(100) references santris(nis) on update cascade on delete restrict,
    asrama_id int references asramas(id) on update cascade on delete restrict,
    nama varchar(100),
    pengirim varchar(100),
    tanggal_diterima timestamp(0),
    keterangan_disita varchar(200),
    status varchar(50),
    created_at timestamp(0),
    updated_at timestamp(0),
    deleted_at timestamp(0)
);
create table permissions (
    id serial primary key,
    nama varchar(100),
    created_at timestamp(0),
    updated_at timestamp(0),
    deleted_at timestamp(0)
);
create table menus (
    id serial primary key,
    nama varchar(100),
    route_name varchar(100),
    route_active varchar(100),
    created_at timestamp(0),
    updated_at timestamp(0),
    deleted_at timestamp(0)
);
create table menu_permissions (
    menu_id int references menus(id) on update cascade on delete restrict,
    permission_id int references permissions(id) on update cascade on delete restrict,
    created_at timestamp(0),
    updated_at timestamp(0),
    deleted_at timestamp(0)
);
create table roles (
    id serial primary key,
    nama varchar(100),
    created_at timestamp(0),
    updated_at timestamp(0),
    deleted_at timestamp(0)
);
create table role_permissions (
    role_id int references roles(id) on update cascade on delete restrict,
    permission_id int references permissions(id) on update cascade on delete restrict,
    created_at timestamp(0),
    updated_at timestamp(0),
    deleted_at timestamp(0)
);

alter table users add column role_id int references roles(id) on update cascade on delete restrict;