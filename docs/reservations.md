# Rezerwacje

## Co działa

- Formularz PL/EN, kalendarz miesięczny, wybór godziny i 1–7 gości.
- Zgłoszenia w D1 ze statusem `pending`. Obsługa podejmuje decyzję w `/admin/`.
- Kalendarz obsługi pokazuje liczbę oczekujących i potwierdzonych wizyt na dzień.
- Potwierdzanie, odrzucanie, anulowanie i przywracanie zgłoszeń.
- Nie ma automatycznego wysyłania wiadomości. Obsługa kontaktuje się z gościem przez
  telefon lub e-mail; panel wyraźnie przypomina o tym przed zmianą statusu.
- Zabezpieczenie Turnstile w produkcji, limit prób, kontrola danych na serwerze,
  idempotencja wysyłania i ochrona przed nadpisaniem zmian innej osoby.
- Klucz panelu jest tylko w pamięci karty. Odświeżenie wymaga ponownego logowania.
  API weryfikuje klucz po stronie serwera; samo ukrycie panelu nie jest ochroną.
- Cron usuwa zgłoszenia starsze niż 90 dni po wizycie i wygasłe liczniki prób.
  Dane gości nie trafiają do logów aplikacji. Kopie zapasowe D1 podlegają retencji Cloudflare.

## Zasady startowe

Terminy do 90 dni naprzód, co 30 minut, zgodnie z godzinami w `src/content/site.ts`.
Poniedziałki zamknięte. Minimum godzina wyprzedzenia, ostatnie rozpoczęcie wizyty
na godzinę przed zamknięciem. Wszystko w `Europe/Warsaw`, również przy zmianie czasu.
To reguły przyjmowania próśb, nie deklaracja dostępności stolików. Brak automatycznego
przydzielania stolików i limitowania potwierdzonych gości — obsługa sprawdza dostępność.
Grupy od 8 osób kontaktują się telefonicznie. Wyjątki świąteczne obsługa uzgadnia z gościem.

## Lokalny podgląd

1. Utwórz `.dev.vars.local` (ignorowany przez Git) z `ADMIN_TOKEN="własny-klucz-lokalny"`.
2. `npm run dev:worker` buduje stronę, wykonuje migracje lokalnie i uruchamia Workers
   na `http://127.0.0.1:8788/`.
3. Formularz: `/#reserve`, panel: `/admin/`. Użyj klucza z `.dev.vars.local`.
4. Opcjonalnie `npm run dev` dla HMR. Vite przekazuje `/api` do lokalnego Workera.
   Worker musi działać jednocześnie. Po zmianie statycznego panelu w podglądzie Workers
   zatrzymaj i ponownie uruchom `npm run dev:worker`; w Vite wystarczy zapis pliku.

Lokalna baza jest oddzielna od produkcyjnej. Turnstile pomijamy tylko z flagą
`LOCAL_DEVELOPMENT=true` **i** hostem `localhost` lub `127.0.0.1`.
Nigdy nie przenoś flagi ani lokalnego klucza do produkcji.

## Aktywacja produkcji na istniejącym Workerze `abyssinia`

Potrzebne jest zalogowane konto Cloudflare. Wykonaj:

```sh
npx wrangler login
npx wrangler d1 create abyssinia-reservations --jurisdiction eu --binding DB --update-config --env ""
npx wrangler d1 migrations apply DB --remote --env ""
```

Polecenie `create` doda rzeczywisty identyfikator bazy do głównej konfiguracji.
Jeśli baza już istnieje, użyj jej identyfikatora i dodaj główne `d1_databases`
z `binding: "DB"`, `database_name`, `database_id`, `migrations_dir: "migrations"`.
Nie używaj lokalnego identyfikatora z `env.local` w produkcji.

W Cloudflare Turnstile utwórz widget Managed dla wszystkich domen, na których
ma działać rezerwacja (domena restauracji i ewentualny adres workers.dev).
Dodaj publiczny klucz jako główne `vars.TURNSTILE_SITE_KEY` w `wrangler.jsonc`.
Sekrety ustaw interaktywnie, bez zapisywania ich w repozytorium:

```sh
npx wrangler secret put TURNSTILE_SECRET_KEY --env ""
npx wrangler secret put ADMIN_TOKEN --env ""
```

`ADMIN_TOKEN` powinien być losowym kluczem co najmniej 32-znakowym, przechowywanym
w menedżerze haseł obsługi. Główna konfiguracja celowo nie zawiera fikcyjnego DB ID
ani kluczy. Formularz jest wyłączony do ich podłączenia.

```sh
npm run check:cloudflare
npm run test:booking
npm run deploy
```

Zapisz aktualizację `wrangler.jsonc` (DB ID i publiczny site key) w repozytorium,
aby kolejne automatyczne wdrożenia zachowały powiązanie. Sekretów nie commituj.
Dla przyszłych zmian bazy uruchom migracje przed wdrożeniem kodu, który ich wymaga.

## Sprawdzenie po wdrożeniu

Wyślij własną testową rezerwację, sprawdź pojawienie się w panelu i zmianę statusu.
Sprawdź, że `/api/admin/reservations?month=2026-09` bez klucza zwraca 401
oraz że Turnstile działa na rzeczywistej domenie. Sprawdź Cron Triggers i retencję.
Obsługa powinna regularnie sprawdzać panel — ten wariant nie wysyła powiadomień.

## Testy

`npm run test:booking` uruchamia odizolowany emulator Workers z tymczasowym D1.
Weryfikuje zapis, błędne dane i godziny, poniedziałki, przeszłe daty, autoryzację,
obce originy, duplikaty i równoległe wysyłanie, konflikty statusów, limity prób,
czas letni/zimowy, izolację lokalnego obejścia Turnstile oraz routing.
Dane testowe nie trafiają do produkcji i są usuwane po zakończeniu testów.
