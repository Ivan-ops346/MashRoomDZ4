INSERT INTO Korisnik (id_korisnik, email, lozinka, sol, ime, datum_registracije, uloga) VALUES
  (1, 'ivan@example.com', '$2a$12$7RBafoS3G5k3Dq5k.M4pM.HkGEuGkESO1.mlZ4ab7JWsNIHug.7/y', '$2a$12$7RBafoS3G5k3Dq5k', 'Ivan', '2024-01-15', 'osnovni'),
  (2, 'ana@example.com', '$2a$12$XpfGPFtToWtSbIX.WpDJluT24O4K9SP446n90aRLp/vJU5IvTmY8O', '$2a$12$XpfGPFtToWtSbIX', 'Ana', '2024-02-20', 'determinator'),
  (3, 'marko@example.com', '$2a$12$6YlPbDjtib8.C7URf1BaoOBDbrzEtZGdmm0eVej/D.IMrhsE/c.Ju', '$2a$12$6YlPbDjtib8', 'Marko', '2024-03-10', 'determinatorMentor');

INSERT INTO IskusniKorisnik (id_korisnik, determinator) VALUES
  (2, True),
  (3, TRUE);

INSERT INTO VerifikacijaIskustva (id_verifikacije, id_korisnik, tip_dokaza, putanja_dokumenta, status, datum_podnosenja) VALUES
  (1, 2, 'Certifikat',           '/docs/certifikat.pdf',         'odobreno', '2024-04-01'),
  (2, 3, 'Potvrda mentora',      '/docs/potvrda_mentora.pdf',    'odobreno', '2024-05-01');

INSERT INTO Gljiva (id_gljiva, latinski_naziv, hrvatski_naziv, jestiva, opis, slika) VALUES
  (1, 'Amanita muscaria', 'Muhara', False, 'Otrovna i psihotropna gljiva', 'https://upload.wikimedia.org/wikipedia/commons/0/03/Fly_Agaric_mushroom_04.jpg'),
  (2, 'Macrolepiota procera', 'Sunčanica', True, 'Jestiva gljiva s klobukom poput kišobrana', 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Macrolepiota_procera_2013_G1.jpg'),
  (3, 'Agaricus bisporus', 'Šampinjon', True, 'Najpoznatija jestiva gljiva, često korištena u kuhinji.', 'https://upload.wikimedia.org/wikipedia/commons/8/88/Agaricus_bisporus%2C_Agaricaceae_01.jpg'),
  (4, 'Gymnopus dryophilus', 'Hrastova kolibijica', True, 'Česta šumska gljiva, umjereno jestiva, ali lako zamjenjiva s otrovnima.', 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Collybia-platyphylla.jpg'),
  (5, 'Leucocoprinus cepaestipes', 'Lukasta sjenica', False, 'Raste često u staklenicima i kompostu; nejestiva zbog slabih nutritivnih svojstava.', 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Leucocoprinus_cepaestipes_mushroom.jpg'),
  (6, 'Coprinopsis pulchricaerulea', 'Modri tintarač', False, 'Vrlo rijetka i vizualno upečatljiva gljiva; nejestiva.', 'https://upload.wikimedia.org/wikipedia/commons/4/43/Coprinopsis_pulchricaerulea_2.jpg');

INSERT INTO Sezona (id_sezona, naziv_sezone, mjesec_od, mjesec_do) VALUES
  (1, 'Proljeće', 3, 5),
  (2, 'Ljeto', 6, 8),
  (3, 'Jesen', 9, 11),
  (4, 'Zima', 1, 2);

INSERT INTO Gljiva_Sezona (id_sezona, id_gljiva) VALUES
  (1, 1),
  (3, 1),
  (3, 2),
  (1, 3);

INSERT INTO Lokacija (id_lokacija, naziv_lokacije, geo_sirina, geo_duljina, regija) VALUES
  (1, 'Maksimir', 45.8321, 16.0195, 'Zagreb'),
  (2, 'Medvednica', 45.9001, 15.99, 'Zagreb');

INSERT INTO Unos (id_unos, id_gljiva, id_korisnik, id_lokacija, datum_unosa) VALUES
  (1, 1, 1, 1, '2024-03-15'),
  (2, 2, 2, 2, '2024-05-02'),
  (3, 3, 3, 1, '2024-06-10'),
  (4, 4, 1, 2, '2024-07-05'),
  (5, 5, 2, 1, '2024-08-18'),
  (6, 6, 3, 2, '2024-09-22');

INSERT INTO Savjet (id_savjet, naslov, sadrzaj, datum, id_korisnik) VALUES
  (1, 'Prepoznajte otrovnice', 'Obratite pažnju na bijele listiće.', '2024-04-01', 2);

INSERT INTO KategorijaSavjeta (id_kategorija, naziv_kategorije) VALUES
  (1, 'Sigurnost'),
  (2, 'Prehrana');

INSERT INTO Savjet_KategorijaSavjeta (id_kategorija, id_savjet) VALUES
  (1, 1),
  (2, 1);

INSERT INTO Komentar (id_komentar, tekst_komentara, datum_objave, id_nadkomentara, id_korisnik, id_savjet) VALUES
  (1, 'Odličan savjet!', '2024-04-02', NULL, 1, 1),
  (2, 'Hvala!', '2024-04-03', 1, 2, 1);