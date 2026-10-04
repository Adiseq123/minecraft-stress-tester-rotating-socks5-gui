# 🎮 Minecraft Server Stress Tester GUI (Rotating SOCKS5 Backconnect Proxy)

Zaawansowana aplikacja oparta na **Electron + Node.js + Mineflayer**, przeznaczona do kontrolowanego testowania wydajności i stabilności serwerów Minecraft z wykorzystaniem **rotacyjnego proxy SOCKS5 typu Backconnect**.

Zamiast zarządzania dużą listą pojedynczych proxy aplikacja korzysta z jednego punktu dostępowego proxy, który może przydzielać różne adresy IP dla kolejnych połączeń.

---

## 🌟 Funkcje aplikacji

- 🖥️ **Nowoczesne GUI** — przejrzysty panel sterowania, konfiguracja testu i konsola zdarzeń w czasie rzeczywistym.
- 🔄 **Rotacyjne SOCKS5 Backconnect** — obsługa jednego endpointu SOCKS5, z którego dostawca może przydzielać zmienne adresy IP.
- 🤖 **Symulacja gracza** — ruch, sprint, skakanie, kucanie, rozglądanie się i interakcje.
- 🔐 **Auto-Rejestracja / Auto-Logowanie** — wykrywanie komunikatów `/register` oraz `/login` i automatyczna obsługa autoryzacji.
- ⏱️ **Human Typing Delay** — konfigurowalne opóźnienia przed wykonywaniem komend.
- 💬 **Aktywność na czacie** — możliwość skonfigurowania wiadomości i komend wysyłanych przez boty.
- ♻️ **Auto-Reconnect** — automatyczna próba ponownego połączenia po rozłączeniu.
- 🌐 **DNS SRV Resolver** — automatyczne rozwiązywanie rekordów `_minecraft._tcp`.
- 📋 **Real-Time Logs** — informacje o statusie botów, połączeniach, rozłączeniach i błędach.

---

## 🔄 Jak działa Rotating SOCKS5 Backconnect?

W przypadku klasycznej listy proxy każdy adres IP jest konfigurowany osobno.

Backconnect Proxy działa inaczej — aplikacja łączy się z jednym skonfigurowanym endpointem SOCKS5, a dostawca proxy może przydzielić połączeniu adres IP z własnej puli.

### Główne zalety

- **Jeden endpoint zamiast dużej listy proxy**
- **Automatyczna zmiana adresów IP zgodnie z konfiguracją dostawcy**
- **Brak potrzeby ręcznego zarządzania tysiącami adresów**
- **Prostsza konfiguracja po stronie aplikacji**
- **Możliwość wykorzystania własnej usługi proxy z rotacją IP**

> ℹ️ Sposób oraz częstotliwość zmiany adresu IP zależy od konfiguracji i zasad dostawcy proxy.

---

## 🛠 DNS SRV Resolver

Aplikacja obsługuje automatyczne rozwiązywanie rekordów:

`_minecraft._tcp`

Pozwala to na poprawne odnajdywanie docelowego hosta oraz portu dla serwerów Minecraft korzystających z konfiguracji SRV.

---

## 🤖 Symulacja zachowania gracza

Boty mogą wykonywać różne akcje imitujące podstawową aktywność gracza:

- chodzenie,
- sprint,
- skakanie,
- kucanie,
- rozglądanie się,
- machanie ręką,
- wiadomości na czacie,
- wykonywanie skonfigurowanych komend.

Dostępne są również konfigurowalne opóźnienia pomiędzy poszczególnymi akcjami.

---

## 🔐 Automatyczna autoryzacja

Aplikacja może wykrywać komunikaty serwera wymagające:

`/register`

lub:

`/login`

Po wykryciu odpowiedniego komunikatu bot może wykonać skonfigurowaną komendę z ustawionym opóźnieniem.

---

## ♻️ Auto-Reconnect

Po utracie połączenia aplikacja może automatycznie spróbować połączyć bota ponownie.

W przypadku korzystania z rotacyjnego endpointu SOCKS5 kolejne połączenie może zostać obsłużone zgodnie z aktualną konfiguracją rotacji dostawcy.

---

## ⚙️ Konfiguracja

Przed uruchomieniem testu możesz skonfigurować m.in.:

| Parametr | Opis |
| :--- | :--- |
| **IP / Domena** | Adres testowanego serwera Minecraft. |
| **Port** | Port serwera Minecraft. |
| **DNS SRV** | Automatyczne rozwiązywanie `_minecraft._tcp`. |
| **Proxy Host** | Adres endpointu SOCKS5 Backconnect. |
| **Proxy Port** | Port usługi SOCKS5. |
| **Proxy Login** | Nazwa użytkownika usługi proxy, jeśli jest wymagana. |
| **Proxy Password** | Hasło usługi proxy, jeśli jest wymagane. |
| **Wersja Minecraft** | Wersja używana przez boty. |
| **Liczba botów** | Liczba klientów uruchamianych podczas testu. |
| **Timingi** | Opóźnienia ruchu, czatu, autoryzacji i reconnectu. |

---

## 🌐 Zużycie transferu

Usługi rotacyjnego proxy mogą rozliczać transfer na podstawie wykorzystanych danych.

Boty Minecraft wysyłają i odbierają dane podczas połączenia, dlatego przy większej liczbie klientów zużycie transferu może wzrosnąć.

**Przed rozpoczęciem testów sprawdź limity oraz zasady rozliczania u swojego dostawcy proxy.**

---

## ⚠️ Ważne ostrzeżenie

**Używasz tego narzędzia na własne ryzyko.**

Autor projektu nie ponosi odpowiedzialności za szkody, problemy z serwerem, utratę danych, blokady kont, adresów IP ani inne konsekwencje wynikające z niewłaściwego użycia aplikacji.

Projekt jest przeznaczony **wyłącznie do testowania własnych serwerów Minecraft lub środowisk, na których przeprowadzenie testów obciążeniowych zostało wyraźnie autoryzowane**.

Nie używaj aplikacji do zakłócania działania cudzych serwerów ani obchodzenia ich zabezpieczeń.

---

## 🛠 Podstawowe wymagania

- **Node.js 18+**
- **npm**
- **Mineflayer**
- **Socks**
- Dostęp do skonfigurowanej usługi SOCKS5

---

## 📥 Instalacja i uruchomienie

### 1. Zainstaluj zależności

```bash
npm install
```

### 2. Uruchom aplikację

```bash
npm start
```

---

## 🏗 Kompilacja

### Windows

```bash
npm run dist:win
```

### Linux

```bash
npm run dist:linux
```

Gotowe pliki zostaną zapisane w katalogu:

`dist/`

---

## 📜 Licencja

Projekt jest udostępniany na licencji **GNU General Public License v3.0 (GPL-3.0)**.

**Korzystasz z projektu na własne ryzyko i ponosisz odpowiedzialność za sposób jego wykorzystania.**