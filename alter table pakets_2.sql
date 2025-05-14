alter table pakets
    rename column penerima_nis to santri_nis;
alter table pakets
    add column penerima varchar(100);

create or replace function ftb_set_penerima_pengirim()
returns trigger as $$
begin
    if (TG_OP = 'INSERT') then
        if (NEW.jenis_paket = 'keluar') then
            NEW.pengirim = (select nama from santris where nis = NEW.santri_nis);
        elsif (NEW.jenis_paket = 'masuk') then
            NEW.penerima = (select nama from santris where nis = NEW.santri_nis);
        end if;
    elsif (TG_OP = 'UPDATE') then
        if (NEW.jenis_paket <> OLD.jenis_paket and (NEW.pengirim <> OLD.pengirim or NEW.penerima <> OLD.penerima or NEW.santri_nis <> OLD.santri_nis)) then
            raise exception 'Tidak dapat mengubah jenis paket dan pengirim/penerima sekaligus';
        end if;
        if (NEW.jenis_paket <> OLD.jenis_paket) then
            NEW.penerima = OLD.pengirim;
            NEW.pengirim = OLD.penerima;
        else
            if (NEW.jenis_paket = 'keluar') then
                NEW.pengirim = (select nama from santris where nis = NEW.santri_nis);
            elsif (NEW.jenis_paket = 'masuk') then
                NEW.penerima = (select nama from santris where nis = NEW.santri_nis);
            end if;
        end if;
    end if;
    return NEW;
end;
$$ language plpgsql;

create trigger ftb_set_penerima_pengirim
    before insert or update on pakets
    for each row execute procedure ftb_set_penerima_pengirim();
