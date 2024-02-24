-- Initial Data

-- !Ups

CREATE TABLE Facilitators (
    id BIGSERIAL NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- 教師A,B,Cをインサート
INSERT INTO Facilitators (name) VALUES ('教師A'), ('教師B'), ('教師C');

CREATE TABLE Classrooms (
    id BIGSERIAL NOT NULL,
    name VARCHAR(255) NOT NULL,
    facilitatorId BIGINT,
    PRIMARY KEY (id),
    FOREIGN KEY (facilitatorId) REFERENCES Facilitators(id) ON DELETE CASCADE
);

-- クラスA,B,Cをインサート
INSERT INTO Classrooms (name, facilitatorId) VALUES ('クラスA', 1), ('クラスB', 2), ('クラスC', 3);

CREATE TABLE Students (
    id BIGSERIAL NOT NULL,
    name VARCHAR(255) NOT NULL,
    loginId VARCHAR(255) NOT NULL,
    classroomId BIGINT,
    PRIMARY KEY (id),
    FOREIGN KEY (classroomId) REFERENCES Classrooms(id) ON DELETE CASCADE
);

-- 各クラスに生徒を40人ずつインサート（nameは架空の人物名とする）
INSERT INTO Students (name, loginId, classroomId) VALUES
('なおき', 'student27', 1), ('まい', 'student32', 1), ('りょう', 'student15', 1), ('はるか', 'student21', 1),
('ゆうた', 'student03', 1), ('さくら', 'student29', 1), ('たいが', 'student14', 1), ('こうき', 'student09', 1),
('あいり', 'student35', 1), ('ひなた', 'student02', 1), ('そうすけ', 'student23', 1), ('かなこ', 'student40', 1),
('たかし', 'student06', 1), ('ゆうき', 'student18', 1), ('みずき', 'student11', 1), ('ともか', 'student25', 1),
('あかり', 'student34', 1), ('けいた', 'student12', 1), ('りこ', 'student28', 1), ('のぞみ', 'student07', 1),
('はると', 'student19', 1), ('こころ', 'student05', 1), ('さとし', 'student22', 1), ('みなみ', 'student38', 1),
('えいたろう', 'student31', 1), ('おさむ', 'student10', 1), ('きょうすけ', 'student17', 1), ('じゅん', 'student04', 1),
('ちか', 'student30', 1), ('ふみや', 'student13', 1), ('ひろし', 'student20', 1), ('まさと', 'student37', 1),
('いくお', 'student16', 1), ('たつや', 'student26', 1), ('なな', 'student01', 1), ('れいか', 'student36', 1),
('ゆい', 'student33', 1), ('しょうた', 'student24', 1), ('たいせい', 'student08', 1), ('わかな', 'student39', 1);
INSERT INTO Students (name, loginId, classroomId) VALUES
('あおい', 'student42', 2), ('かずや', 'student47', 2), ('さおり', 'student55', 2), ('たけし', 'student41', 2),
('なおと', 'student59', 2), ('はるな', 'student56', 2), ('まゆみ', 'student54', 2), ('りょうこ', 'student43', 2),
('あきら', 'student50', 2), ('きみこ', 'student46', 2), ('さとみ', 'student60', 2), ('たつみ', 'student58', 2),
('のぞむ', 'student49', 2), ('ひろみ', 'student44', 2), ('みちお', 'student45', 2), ('れん', 'student48', 2),
('いさお', 'student57', 2), ('くみこ', 'student53', 2), ('しゅん', 'student52', 2), ('としお', 'student51', 2),
('やすこ', 'student61', 2), ('ゆかり', 'student62', 2), ('よしき', 'student64', 2), ('あいこ', 'student63', 2),
('えりか', 'student65', 2), ('おさむ', 'student68', 2), ('かなえ', 'student67', 2), ('こうたろう', 'student66', 2),
('さちこ', 'student69', 2), ('たかお', 'student72', 2), ('ななこ', 'student71', 2), ('ひでお', 'student70', 2),
('まさひろ', 'student73', 2), ('りく', 'student76', 2), ('わかば', 'student75', 2), ('ゆうたろう', 'student74', 2),
('あゆむ', 'student77', 2), ('けんじ', 'student80', 2), ('そういちろう', 'student79', 2), ('つぐみ', 'student78', 2);
INSERT INTO Students (name, loginId, classroomId) VALUES
('あさみ', 'student82', 3), ('いずみ', 'student87', 3), ('うたこ', 'student95', 3), ('えりな', 'student81', 3),
('おとは', 'student99', 3), ('かいと', 'student96', 3), ('きらら', 'student83', 3), ('くれあ', 'student100', 3),
('けんと', 'student88', 3), ('こはる', 'student94', 3), ('さくや', 'student89', 3), ('しおり', 'student98', 3),
('じゅんや', 'student84', 3), ('すみれ', 'student97', 3), ('せいや', 'student85', 3), ('たいよう', 'student101', 3),
('つきの', 'student102', 3), ('てるみ', 'student108', 3), ('とわ', 'student86', 3), ('なおと', 'student103', 3),
('にこる', 'student109', 3), ('ぬのか', 'student104', 3), ('ねむ', 'student110', 3), ('のあ', 'student93', 3),
('はると', 'student105', 3), ('ひかる', 'student111', 3), ('ふうか', 'student92', 3), ('へきる', 'student106', 3),
('ほたる', 'student112', 3), ('まあや', 'student107', 3), ('みつき', 'student91', 3), ('むつみ', 'student90', 3),
('めいこ', 'student113', 3), ('ももか', 'student118', 3), ('やえ', 'student114', 3), ('ゆいか', 'student115', 3),
('よしき', 'student116', 3), ('りくと', 'student117', 3), ('れんげ', 'student119', 3), ('ろあ', 'student120', 3);


-- !Downs

DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Classrooms;
DROP TABLE IF EXISTS Facilitators;
