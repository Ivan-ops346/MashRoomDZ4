CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(500) NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_option CHAR(1) NOT NULL, -- 'A', 'B', 'C' ili 'D'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO Pitanje (tekst_pitanja, odgovor_a, odgovor_b, odgovor_c, odgovor_d, tocan_odgovor)
VALUES (
    'Koja gljiva je smrtonosno otrovna? ',
    'Šampinjon',
    'Lisičarka',
    'Zeleni pupovac',
    'Vrganj',
    'C'
);

INSERT INTO Pitanje (tekst_pitanja, odgovor_a, odgovor_b, odgovor_c, odgovor_d, tocan_odgovor)
VALUES (
    'Koja od navedenih gljiva je smrtonosno otrovna?',
    'Šampinjon',
    'Lisičarka',
    'Zeleni pupavac',
    'Vrganj',
    'C'
);

INSERT INTO Pitanje (tekst_pitanja, odgovor_a, odgovor_b, odgovor_c, odgovor_d, tocan_odgovor)
VALUES (
    'Što je mikoriza?',
    'Bolest gljiva',
    'Simbiotski odnos između gljiva i biljaka',
    'Podzemna struktura gljiva',
    'Vrsta gljivične infekcije',
    'B'
);

INSERT INTO Pitanje (tekst_pitanja, odgovor_a, odgovor_b, odgovor_c, odgovor_d, tocan_odgovor)
VALUES (
    'Kako se zove gljivično tkivo koje raste ispod zemlje? ',
    'Klobuk',
    'Micelij',
    'List',
    'Spore',
    'B'
);

INSERT INTO Pitanje (tekst_pitanja, odgovor_a, odgovor_b, odgovor_c, odgovor_d, tocan_odgovor)
VALUES (
    'Što gljive koriste za reprodukciju?',
    'Sjeme',
    'Cvijet',
    'Spore',
    'Korijen',
    'C'
);

INSERT INTO Pitanje (tekst_pitanja, odgovor_a, odgovor_b, odgovor_c, odgovor_d, tocan_odgovor)
VALUES (
    'Koliko otprilike vrsta gljiva postoji? ',
    'Točan broj nije poznat, ali preko 2 milijuna ',
    'Oko 1 000 000',
    'Oko 150 000',
    'Oko 50 000',
    'A'
);

INSERT INTO Pitanje (tekst_pitanja, odgovor_a, odgovor_b, odgovor_c, odgovor_d, tocan_odgovor)
VALUES (
    'Koja od navedenih gljiva je parazit?',
    'Tartuf',
    'Šampinjon',
    'Vrganj',
    'Gljiva kukacovka',
    'D'
);

INSERT INTO Pitanje (tekst_pitanja, odgovor_a, odgovor_b, odgovor_c, odgovor_d, tocan_odgovor)
VALUES (
    'Što je "psilocibin"?',
    'Otrov u zelenom pupavcu',
    'Gljivična bolest vinove loze',
    'Psihootrovna tvar u halucinogenim gljivama',
    'Pigment u šampinjonima',
    'C'
);

INSERT INTO Pitanje (tekst_pitanja, odgovor_a, odgovor_b, odgovor_c, odgovor_d, tocan_odgovor)
VALUES (
    'Kako gljive dobivaju hranjive tvari?',
    'Apsorpcijom iz okoliša (razgradnjom organskih tvari)',
    'Isključivo preko korijena',
    'Spore',
    'izravnim unosom krvi (poput parazita)',
    'B'
);

INSERT INTO Pitanje (tekst_pitanja, odgovor_a, odgovor_b, odgovor_c, odgovor_d, tocan_odgovor)
VALUES (
    'Zašto se ne smiju brati mlade "jaje" gljive zelenog pupavca?',
    'Jer su bez okusa',
    'Jer su bez mirisa',
    'Jer ih ptice jedu',
    'Jer izgledaju slično jestivim gljivama u toj fazi',
    'D'
);


