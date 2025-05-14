alter table menus 
    add column order_number int,
    add column parent_id int references menus(id) on update cascade on delete restrict,
    drop column deleted_at;

create or replace function ftb_add_menu()
returns trigger as $$
begin
    if new.parent_id is null then
        new.order_number = (select coalesce(max(order_number), 0) from menus) + 1;
    else
        new.order_number = (select coalesce(max(order_number), 0) from menus where parent_id = new.parent_id) + 1;
    end if;
    return new;
end;
$$ language plpgsql;

create trigger tb_add_menu
    before insert on menus
    for each row
    execute procedure ftb_add_menu();

create or replace function f_delete_menu(p_menu_id int)
returns void as $$
declare
    v_parent_id INTEGER;
    v_current_position INTEGER;
begin
    -- Validasi menu ID
    if not exists (select 1 from menus where id = p_menu_id) then
        raise exception 'Menu dengan ID % tidak ditemukan', p_menu_id;
    end if;

    -- Dapatkan parent_id dan posisi menu yang akan dihapus
    select parent_id, order_number 
    into v_parent_id, v_current_position
    from menus 
    where id = p_menu_id;

    begin
        -- Update parent_id untuk child menu menjadi parent dari menu yang dihapus
        update menus
        set parent_id = v_parent_id
        where parent_id = p_menu_id;

        -- Hapus menu
        delete from menus where id = p_menu_id;

        -- Re-arrange urutan menu yang tersisa
        update menus
        set order_number = order_number - 1
        where parent_id is not distinct from v_parent_id
        and order_number > v_current_position;

    exception when others then
        raise exception 'Gagal menghapus menu: %', sqlerrm;
    end;
end;
$$
    language plpgsql;

create or replace function update_menu_order_number(
    p_menu_id int,
    p_new_position int,
    p_new_parent_id int default null
) returns void as 
$$
declare
    v_old_parent_id int;
    v_max_position int;
    v_current_position int;
begin
    -- Validasi menu ID
    if not exists (select 1 from menus where id = p_menu_id) then
        raise exception 'Menu dengan ID % tidak ditemukan', p_menu_id;
    end if;

    -- Dapatkan parent_id lama
    select parent_id, order_number 
    into v_old_parent_id, v_current_position
    from menus 
    where id = p_menu_id;

    -- Validasi parent_id baru
    if p_new_parent_id is not null then
        if not exists (select 1 from menus where id = p_new_parent_id) then
            raise exception 'Parent menu dengan ID % tidak ditemukan', p_new_parent_id;
        end if;
        
        -- Cek untuk mencegah menu menjadi child dari submenu-nya sendiri
        if exists (
            with recursive submenu as (
                select id, parent_id from menus where id = p_menu_id
                union all
                select m.id, m.parent_id 
                from menus m
                join submenu s on m.parent_id = s.id
            )
            select 1 from submenu where id = p_new_parent_id
        ) then
            raise exception 'Tidak dapat memindahkan menu ke submenu-nya sendiri';
        end if;
    end if;

    -- Dapatkan posisi maksimum di parent yang dituju
    select coalesce(max(order_number), 0)
    into v_max_position
    from menus
    where parent_id is not distinct from coalesce(p_new_parent_id, v_old_parent_id);

    -- Validasi posisi baru
    if p_new_position < 1 then
        raise exception 'Posisi tidak boleh kurang dari 1';
    end if;
    
    if p_new_position > v_max_position + 1 then
        raise exception 'Posisi % melebihi jumlah menu yang ada (max: %)', 
            p_new_position, v_max_position + 1;
    end if;

    -- Mulai proses update
    begin
        -- Update parent_id jika berubah
        if p_new_parent_id is not distinct from v_old_parent_id then
            -- Jika dalam parent yang sama
            if p_new_position < v_current_position then
                -- Geser naik: semua menu antara posisi baru dan posisi lama digeser ke bawah
                update menus
                set order_number = order_number + 1
                where parent_id is not distinct from v_old_parent_id
                and order_number >= p_new_position
                and order_number < v_current_position;
            elsif p_new_position > v_current_position then
                -- Geser turun: semua menu antara posisi lama dan posisi baru digeser ke atas
                update menus
                set order_number = order_number - 1
                where parent_id is not distinct from v_old_parent_id
                and order_number > v_current_position
                and order_number <= p_new_position;
            end if;
        else
            -- Jika pindah ke parent berbeda
            -- Geser menu di parent lama
            update menus
            set order_number = order_number - 1
            where parent_id is not distinct from v_old_parent_id
            and order_number > v_current_position;

            -- Geser menu di parent baru
            update menus
            set order_number = order_number + 1
            where parent_id is not distinct from p_new_parent_id
            and order_number >= p_new_position;

            -- Update parent_id
            update menus
            set parent_id = p_new_parent_id
            where id = p_menu_id;
        end if;

        -- Update posisi menu yang dipindahkan
        update menus
        set order_number = p_new_position
        where id = p_menu_id;

    exception when others then
        raise exception 'Gagal mengupdate posisi menu: %', sqlerrm;
    end;
end;
$$
language plpgsql;

insert into menus (nama, route_name, route_active, parent_id) values 
('Dashboard', 'dashboard', 'dashboard', null),
('Santri', 'santris.index', 'santris.*', null),
('Paket', 'pakets.index', 'pakets.*', null),
('Laporan', 'laporan.index', 'laporan.*', null),
('Master Data', 'master-data.index', 'master-data.*', null),
('User', 'users.index', 'users.*', null),
('Access Control', 'access-control.index', 'access-control.*', null);