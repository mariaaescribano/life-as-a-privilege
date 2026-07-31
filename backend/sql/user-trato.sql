-- Cómo prefiere cada persona que se le hable: 'el' | 'ella'.
-- Se pregunta al crear la cuenta (/signIn) y se guarda aquí.
--
-- Es OPCIONAL (puede quedar en null): quien no lo elija no se queda sin poder
-- registrarse, y en los textos se le habla en neutro.
--
-- Ejecútalo una vez en el SQL editor de Supabase.

alter table public."user"
  add column if not exists trato text;

-- El check no admite «if not exists», así que se comprueba antes.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'user_trato_check') then
    alter table public."user"
      add constraint user_trato_check check (trato is null or trato in ('el', 'ella'));
  end if;
end $$;
