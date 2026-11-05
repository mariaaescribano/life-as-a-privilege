-- «Notas»: el bloc que comparten María y la persona. Cada nota guarda quién la escribió:
-- 'maria' si la escribió María, NULL si la escribió la propia persona.
-- Sin esta columna todo sigue funcionando, pero no se sabe quién escribió cada nota
-- (y la persona podría borrar las de María).
alter table notas add column if not exists autor text;
