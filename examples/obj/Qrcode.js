var Qrcode = function () {

	THREE.Geometry.call( this );

	var scope = this;

	var color1 = new THREE.Color( 0x000000 );
	var color2 = new THREE.Color( 0xc0c0c0 );

	v(-54,134,58);
	v(-54,146,58);
	v(-42,146,58);
	v(-42,134,58);
	v(-42,158,58);
	v(-18,158,58);
	v(-18,146,58);
	v(-66,-57,58);
	v(-66,-141,58);
	v(-150,-141,58);
	v(-150,-57,58);
	v(-138,-129,58);
	v(-78,-129,58);
	v(-78,-69,58);
	v(-138,-69,58);
	v(-90,-81,58);
	v(-90,-117,58);
	v(-126,-117,58);
	v(-126,-81,58);
	v(-6,146,58);
	v(-6,122,58);
	v(-18,122,58);
	v(6,146,58);
	v(6,158,58);
	v(-6,158,58);
	v(6,122,58);
	v(6,74,58);
	v(-6,74,58);
	v(-6,86,58);
	v(-18,86,58);
	v(-18,74,58);
	v(-30,74,58);
	v(-30,86,58);
	v(-42,86,58);
	v(-42,98,58);
	v(-30,98,58);
	v(-30,122,58);
	v(-18,98,58);
	v(-6,98,58);
	v(18,74,58);
	v(18,2,58);
	v(30,2,58);
	v(30,50,58);
	v(42,50,58);
	v(42,38,58);
	v(54,38,58);
	v(54,26,58);
	v(66,26,58);
	v(66,38,58);
	v(78,38,58);
	v(78,2,58);
	v(66,2,58);
	v(66,14,58);
	v(54,14,58);
	v(54,-9,58);
	v(66,-9,58);
	v(66,-33,58);
	v(78,-33,58);
	v(78,-21,58);
	v(90,-21,58);
	v(90,-33,58);
	v(102,-33,58);
	v(102,-57,58);
	v(114,-57,58);
	v(114,-69,58);
	v(102,-69,58);
	v(102,-81,58);
	v(114,-81,58);
	v(114,-105,58);
	v(102,-105,58);
	v(102,-93,58);
	v(78,-93,58);
	v(78,-105,58);
	v(66,-105,58);
	v(66,-117,58);
	v(54,-117,58);
	v(54,-93,58);
	v(30,-93,58);
	v(30,-105,58);
	v(18,-105,58);
	v(18,-69,58);
	v(30,-69,58);
	v(30,-81,58);
	v(42,-81,58);
	v(42,-33,58);
	v(54,-33,58);
	v(54,-21,58);
	v(42,-21,58);
	v(30,-33,58);
	v(30,-9,58);
	v(-18,-9,58);
	v(-18,-21,58);
	v(-30,-21,58);
	v(-30,-33,58);
	v(-42,-33,58);
	v(-42,-21,58);
	v(-54,-21,58);
	v(-54,2,58);
	v(-42,2,58);
	v(-42,-9,58);
	v(-30,-9,58);
	v(-30,2,58);
	v(-6,2,58);
	v(-6,14,58);
	v(6,14,58);
	v(18,86,58);
	v(30,86,58);
	v(30,74,58);
	v(42,74,58);
	v(42,86,58);
	v(54,86,58);
	v(54,62,58);
	v(78,62,58);
	v(78,50,58);
	v(42,62,58);
	v(30,62,58);
	v(90,50,58);
	v(90,62,58);
	v(114,62,58);
	v(114,50,58);
	v(126,50,58);
	v(126,62,58);
	v(138,62,58);
	v(138,38,58);
	v(114,38,58);
	v(114,26,58);
	v(138,26,58);
	v(150,38,58);
	v(150,2,58);
	v(138,2,58);
	v(138,14,58);
	v(102,14,58);
	v(102,38,58);
	v(138,-9,58);
	v(150,-9,58);
	v(150,-33,58);
	v(138,-33,58);
	v(138,-21,58);
	v(126,-21,58);
	v(126,-33,58);
	v(138,-57,58);
	v(126,-57,58);
	v(126,-45,58);
	v(114,-45,58);
	v(114,-21,58);
	v(102,-21,58);
	v(102,-9,58);
	v(126,-9,58);
	v(126,2,58);
	v(150,-57,58);
	v(150,-141,58);
	v(138,-141,58);
	v(138,-129,58);
	v(114,-129,58);
	v(126,-105,58);
	v(126,-93,58);
	v(138,-93,58);
	v(138,-81,58);
	v(126,-81,58);
	v(126,-69,58);
	v(138,-69,58);
	v(114,-141,58);
	v(102,-141,58);
	v(102,-129,58);
	v(78,-129,58);
	v(90,-9,58);
	v(90,2,58);
	v(102,2,58);
	v(30,-117,58);
	v(42,-117,58);
	v(42,-105,58);
	v(30,-141,58);
	v(6,-141,58);
	v(6,-129,58);
	v(18,-129,58);
	v(18,-117,58);
	v(6,-69,58);
	v(6,-81,58);
	v(-18,-81,58);
	v(-18,-69,58);
	v(-6,-69,58);
	v(-6,-57,58);
	v(18,-57,58);
	v(-18,-93,58);
	v(-30,-93,58);
	v(-30,-117,58);
	v(-42,-117,58);
	v(-42,-105,58);
	v(-54,-105,58);
	v(-54,-69,58);
	v(-42,-69,58);
	v(-42,-57,58);
	v(-54,-57,58);
	v(-54,-45,58);
	v(-30,-45,58);
	v(-30,-81,58);
	v(-18,-117,58);
	v(-6,-117,58);
	v(-6,-129,58);
	v(-18,-129,58);
	v(-6,-105,58);
	v(6,-105,58);
	v(6,-117,58);
	v(-78,-45,58);
	v(-78,-33,58);
	v(-66,-33,58);
	v(-66,-21,58);
	v(-78,-21,58);
	v(-78,-9,58);
	v(-66,-9,58);
	v(-90,-9,58);
	v(-90,-21,58);
	v(-114,-21,58);
	v(-114,-9,58);
	v(-102,-9,58);
	v(-102,14,58);
	v(-114,14,58);
	v(-114,2,58);
	v(-126,2,58);
	v(-126,26,58);
	v(-138,26,58);
	v(-138,38,58);
	v(-90,38,58);
	v(-90,26,58);
	v(-78,26,58);
	v(-78,14,58);
	v(-90,14,58);
	v(-90,2,58);
	v(-78,2,58);
	v(-126,-9,58);
	v(-138,-9,58);
	v(-138,2,58);
	v(-150,2,58);
	v(-150,14,58);
	v(-138,14,58);
	v(-90,50,58);
	v(-114,50,58);
	v(-114,62,58);
	v(-66,62,58);
	v(-66,50,58);
	v(-78,50,58);
	v(-78,38,58);
	v(-54,50,58);
	v(-54,86,58);
	v(-42,74,58);
	v(-30,50,58);
	v(-42,50,58);
	v(-42,38,58);
	v(-54,38,58);
	v(-54,26,58);
	v(-66,26,58);
	v(-66,38,58);
	v(-18,26,58);
	v(-18,14,58);
	v(-30,14,58);
	v(-42,14,58);
	v(-54,14,58);
	v(-18,-57,58);
	v(-18,-33,58);
	v(-6,-33,58);
	v(-6,-21,58);
	v(18,-21,58);
	v(18,-33,58);
	v(30,-57,58);
	v(18,-45,58);
	v(6,-45,58);
	v(6,-33,58);
	v(-18,62,58);
	v(-6,62,58);
	v(-30,134,58);
	v(-42,122,58);
	v(54,158,58);
	v(54,134,58);
	v(42,134,58);
	v(42,146,58);
	v(18,146,58);
	v(18,158,58);
	v(42,122,58);
	v(54,122,58);
	v(54,98,58);
	v(42,98,58);
	v(42,110,58);
	v(30,110,58);
	v(30,134,58);
	v(30,98,58);
	v(18,98,58);
	v(18,110,58);
	v(150,158,58);
	v(150,74,58);
	v(66,74,58);
	v(66,158,58);
	v(78,86,58);
	v(138,86,58);
	v(138,146,58);
	v(78,146,58);
	v(126,134,58);
	v(126,98,58);
	v(90,98,58);
	v(90,134,58);
	v(54,-81,58);
	v(90,-81,58);
	v(90,-45,58);
	v(54,-45,58);
	v(78,-57,58);
	v(78,-69,58);
	v(66,-69,58);
	v(66,-57,58);
	v(54,-129,58);
	v(54,-141,58);
	v(42,-141,58);
	v(42,-129,58);
	v(-66,158,58);
	v(-66,74,58);
	v(-150,74,58);
	v(-150,158,58);
	v(-138,86,58);
	v(-78,86,58);
	v(-78,146,58);
	v(-138,146,58);
	v(-126,134,58);
	v(-90,134,58);
	v(-90,98,58);
	v(-126,98,58);
	v(-126,-21,58);
	v(-126,-45,58);
	v(-138,-45,58);
	v(-138,-21,58);
	v(-126,62,58);
	v(-126,50,58);
	v(-138,50,58);
	v(-138,62,58);
	v(-90,-33,58);
	v(-90,-45,58);
	v(-114,-45,58);
	v(-114,-33,58);
	v(-42,-129,58);
	v(-54,-129,58);
	v(-54,-117,58);
	v(-18,-141,58);
	v(-42,-141,58);
	v(-54,98,58);
	v(-54,122,58);
	v(-54,134,-41);
	v(-54,146,-41);
	v(-42,146,-41);
	v(-42,134,-41);
	v(-42,158,-41);
	v(-18,158,-41);
	v(-18,146,-41);
	v(-66,-57,-41);
	v(-66,-141,-41);
	v(-150,-141,-41);
	v(-150,-57,-41);
	v(-138,-129,-41);
	v(-78,-129,-41);
	v(-78,-69,-41);
	v(-138,-69,-41);
	v(-90,-81,-41);
	v(-90,-117,-41);
	v(-126,-117,-41);
	v(-126,-81,-41);
	v(-6,146,-41);
	v(-6,122,-41);
	v(-18,122,-41);
	v(6,146,-41);
	v(6,158,-41);
	v(-6,158,-41);
	v(6,122,-41);
	v(6,74,-41);
	v(-6,74,-41);
	v(-6,86,-41);
	v(-18,86,-41);
	v(-18,74,-41);
	v(-30,74,-41);
	v(-30,86,-41);
	v(-42,86,-41);
	v(-42,98,-41);
	v(-30,98,-41);
	v(-30,122,-41);
	v(-18,98,-41);
	v(-6,98,-41);
	v(18,74,-41);
	v(18,2,-41);
	v(30,2,-41);
	v(30,50,-41);
	v(42,50,-41);
	v(42,38,-41);
	v(54,38,-41);
	v(54,26,-41);
	v(66,26,-41);
	v(66,38,-41);
	v(78,38,-41);
	v(78,2,-41);
	v(66,2,-41);
	v(66,14,-41);
	v(54,14,-41);
	v(54,-9,-41);
	v(66,-9,-41);
	v(66,-33,-41);
	v(78,-33,-41);
	v(78,-21,-41);
	v(90,-21,-41);
	v(90,-33,-41);
	v(102,-33,-41);
	v(102,-57,-41);
	v(114,-57,-41);
	v(114,-69,-41);
	v(102,-69,-41);
	v(102,-81,-41);
	v(114,-81,-41);
	v(114,-105,-41);
	v(102,-105,-41);
	v(102,-93,-41);
	v(78,-93,-41);
	v(78,-105,-41);
	v(66,-105,-41);
	v(66,-117,-41);
	v(54,-117,-41);
	v(54,-93,-41);
	v(30,-93,-41);
	v(30,-105,-41);
	v(18,-105,-41);
	v(18,-69,-41);
	v(30,-69,-41);
	v(30,-81,-41);
	v(42,-81,-41);
	v(42,-33,-41);
	v(54,-33,-41);
	v(54,-21,-41);
	v(42,-21,-41);
	v(30,-33,-41);
	v(30,-9,-41);
	v(-18,-9,-41);
	v(-18,-21,-41);
	v(-30,-21,-41);
	v(-30,-33,-41);
	v(-42,-33,-41);
	v(-42,-21,-41);
	v(-54,-21,-41);
	v(-54,2,-41);
	v(-42,2,-41);
	v(-42,-9,-41);
	v(-30,-9,-41);
	v(-30,2,-41);
	v(-6,2,-41);
	v(-6,14,-41);
	v(6,14,-41);
	v(18,86,-41);
	v(30,86,-41);
	v(30,74,-41);
	v(42,74,-41);
	v(42,86,-41);
	v(54,86,-41);
	v(54,62,-41);
	v(78,62,-41);
	v(78,50,-41);
	v(42,62,-41);
	v(30,62,-41);
	v(90,50,-41);
	v(90,62,-41);
	v(114,62,-41);
	v(114,50,-41);
	v(126,50,-41);
	v(126,62,-41);
	v(138,62,-41);
	v(138,38,-41);
	v(114,38,-41);
	v(114,26,-41);
	v(138,26,-41);
	v(150,38,-41);
	v(150,2,-41);
	v(138,2,-41);
	v(138,14,-41);
	v(102,14,-41);
	v(102,38,-41);
	v(138,-9,-41);
	v(150,-9,-41);
	v(150,-33,-41);
	v(138,-33,-41);
	v(138,-21,-41);
	v(126,-21,-41);
	v(126,-33,-41);
	v(138,-57,-41);
	v(126,-57,-41);
	v(126,-45,-41);
	v(114,-45,-41);
	v(114,-21,-41);
	v(102,-21,-41);
	v(102,-9,-41);
	v(126,-9,-41);
	v(126,2,-41);
	v(150,-57,-41);
	v(150,-141,-41);
	v(138,-141,-41);
	v(138,-129,-41);
	v(114,-129,-41);
	v(126,-105,-41);
	v(126,-93,-41);
	v(138,-93,-41);
	v(138,-81,-41);
	v(126,-81,-41);
	v(126,-69,-41);
	v(138,-69,-41);
	v(114,-141,-41);
	v(102,-141,-41);
	v(102,-129,-41);
	v(78,-129,-41);
	v(90,-9,-41);
	v(90,2,-41);
	v(102,2,-41);
	v(30,-117,-41);
	v(42,-117,-41);
	v(42,-105,-41);
	v(30,-141,-41);
	v(6,-141,-41);
	v(6,-129,-41);
	v(18,-129,-41);
	v(18,-117,-41);
	v(6,-69,-41);
	v(6,-81,-41);
	v(-18,-81,-41);
	v(-18,-69,-41);
	v(-6,-69,-41);
	v(-6,-57,-41);
	v(18,-57,-41);
	v(-18,-93,-41);
	v(-30,-93,-41);
	v(-30,-117,-41);
	v(-42,-117,-41);
	v(-42,-105,-41);
	v(-54,-105,-41);
	v(-54,-69,-41);
	v(-42,-69,-41);
	v(-42,-57,-41);
	v(-54,-57,-41);
	v(-54,-45,-41);
	v(-30,-45,-41);
	v(-30,-81,-41);
	v(-18,-117,-41);
	v(-6,-117,-41);
	v(-6,-129,-41);
	v(-18,-129,-41);
	v(-6,-105,-41);
	v(6,-105,-41);
	v(6,-117,-41);
	v(-78,-45,-41);
	v(-78,-33,-41);
	v(-66,-33,-41);
	v(-66,-21,-41);
	v(-78,-21,-41);
	v(-78,-9,-41);
	v(-66,-9,-41);
	v(-90,-9,-41);
	v(-90,-21,-41);
	v(-114,-21,-41);
	v(-114,-9,-41);
	v(-102,-9,-41);
	v(-102,14,-41);
	v(-114,14,-41);
	v(-114,2,-41);
	v(-126,2,-41);
	v(-126,26,-41);
	v(-138,26,-41);
	v(-138,38,-41);
	v(-90,38,-41);
	v(-90,26,-41);
	v(-78,26,-41);
	v(-78,14,-41);
	v(-90,14,-41);
	v(-90,2,-41);
	v(-78,2,-41);
	v(-126,-9,-41);
	v(-138,-9,-41);
	v(-138,2,-41);
	v(-150,2,-41);
	v(-150,14,-41);
	v(-138,14,-41);
	v(-90,50,-41);
	v(-114,50,-41);
	v(-114,62,-41);
	v(-66,62,-41);
	v(-66,50,-41);
	v(-78,50,-41);
	v(-78,38,-41);
	v(-54,50,-41);
	v(-54,86,-41);
	v(-42,74,-41);
	v(-30,50,-41);
	v(-42,50,-41);
	v(-42,38,-41);
	v(-54,38,-41);
	v(-54,26,-41);
	v(-66,26,-41);
	v(-66,38,-41);
	v(-18,26,-41);
	v(-18,14,-41);
	v(-30,14,-41);
	v(-42,14,-41);
	v(-54,14,-41);
	v(-18,-57,-41);
	v(-18,-33,-41);
	v(-6,-33,-41);
	v(-6,-21,-41);
	v(18,-21,-41);
	v(18,-33,-41);
	v(30,-57,-41);
	v(18,-45,-41);
	v(6,-45,-41);
	v(6,-33,-41);
	v(-18,62,-41);
	v(-6,62,-41);
	v(-30,134,-41);
	v(-42,122,-41);
	v(54,158,-41);
	v(54,134,-41);
	v(42,134,-41);
	v(42,146,-41);
	v(18,146,-41);
	v(18,158,-41);
	v(42,122,-41);
	v(54,122,-41);
	v(54,98,-41);
	v(42,98,-41);
	v(42,110,-41);
	v(30,110,-41);
	v(30,134,-41);
	v(30,98,-41);
	v(18,98,-41);
	v(18,110,-41);
	v(150,158,-41);
	v(150,74,-41);
	v(66,74,-41);
	v(66,158,-41);
	v(78,86,-41);
	v(138,86,-41);
	v(138,146,-41);
	v(78,146,-41);
	v(126,134,-41);
	v(126,98,-41);
	v(90,98,-41);
	v(90,134,-41);
	v(54,-81,-41);
	v(90,-81,-41);
	v(90,-45,-41);
	v(54,-45,-41);
	v(78,-57,-41);
	v(78,-69,-41);
	v(66,-69,-41);
	v(66,-57,-41);
	v(54,-129,-41);
	v(54,-141,-41);
	v(42,-141,-41);
	v(42,-129,-41);
	v(-66,158,-41);
	v(-66,74,-41);
	v(-150,74,-41);
	v(-150,158,-41);
	v(-138,86,-41);
	v(-78,86,-41);
	v(-78,146,-41);
	v(-138,146,-41);
	v(-126,134,-41);
	v(-90,134,-41);
	v(-90,98,-41);
	v(-126,98,-41);
	v(-126,-21,-41);
	v(-126,-45,-41);
	v(-138,-45,-41);
	v(-138,-21,-41);
	v(-126,62,-41);
	v(-126,50,-41);
	v(-138,50,-41);
	v(-138,62,-41);
	v(-90,-33,-41);
	v(-90,-45,-41);
	v(-114,-45,-41);
	v(-114,-33,-41);
	v(-42,-129,-41);
	v(-54,-129,-41);
	v(-54,-117,-41);
	v(-18,-141,-41);
	v(-42,-141,-41);
	v(-54,98,-41);
	v(-54,122,-41);

	f3(151,150,152,color1);
	f3(644,398,399,color1);
	f3(493,494,492,color1);
	f3(301,65,62,color1);
	f3(585,375,586,color1);
	f3(243,244,33,color1);
	f3(156,149,157,color1);
	f3(498,499,491,color1);
	f3(532,537,526,color1);
	f3(102,90,40,color1);
	f3(302,57,56,color1);
	f3(526,529,530,color1);
	f3(215,219,216,color1);
	f3(642,413,641,color1);
	f3(382,432,444,color1);
	f3(71,300,299,color1);
	f3(489,480,486,color1);
	f3(144,138,147,color1);
	f3(80,182,176,color1);
	f3(262,261,266,color1);
	f3(422,518,524,color1);
	f3(604,608,603,color1);
	f3(387,388,386,color1);
	f3(45,44,46,color1);
	f3(605,524,606,color1);
	f3(569,552,556,color1);
	f3(555,556,554,color1);
	f3(521,522,520,color1);
	f3(482,483,484,color1);
	f3(481,484,485,color1);
	f3(479,475,476,color1);
	f3(385,456,453,color1);
	f3(451,452,450,color1);
	f3(441,437,438,color1);
	f3(424,425,419,color1);
	f3(413,414,415,color1);
	f3(412,408,409,color1);
	f3(643,404,407,color1);
	f3(428,396,397,color1);
	f3(264,182,263,color1);
	f3(226,223,215,color1);
	f3(214,210,227,color1);
	f3(213,212,214,color1);
	f3(179,178,180,color1);
	f3(142,141,140,color1);
	f3(143,142,139,color1);
	f3(134,133,137,color1);
	f3(43,111,114,color1);
	f3(109,108,110,color1);
	f3(96,95,99,color1);
	f3(82,77,83,color1);
	f3(73,72,71,color1);
	f3(67,66,70,color1);
	f3(55,54,86,color1);
	f4(85,56,55,86,color1);
	f4(69,68,67,70,color1);
	f4(299,76,73,71,color1);
	f4(84,302,56,85,color1);
	f4(114,111,110,108,color1);
	f4(136,135,134,137,color1);
	f4(280,279,278,281,color1);
	f4(427,428,397,398,color1);
	f4(408,642,643,407,color1);
	f4(411,412,409,410,color1);
	f4(641,413,415,418,color1);
	f4(426,427,398,644,color1);
	f4(456,450,452,453,color1);
	f4(478,479,476,477,color1);
	f4(622,623,620,621,color1);
	f4(604,430,605,606,color1);
	f4(481,478,482,484,color1);
	f4(262,264,263,88,color1);
	f4(139,142,140,136,color1);
	f4(43,42,41,44,color1);
	f4(98,97,96,99,color1);
	f4(138,144,143,139,color1);
	f4(178,177,176,180,color1);
	f4(210,214,212,211,color1);
	f4(226,215,214,227,color1);
	f4(278,277,282,281,color1);
	f4(385,386,383,384,color1);
	f4(440,441,438,439,color1);
	f4(480,481,485,486,color1);
	f4(520,522,518,519,color1);
	f4(552,553,554,556,color1);
	f4(568,569,556,557,color1);
	f4(620,623,624,619,color1);
	f4(615,619,624,625,color1);
	f4(273,283,282,277,color1);
	f4(46,44,41,53,color1);
	f4(182,181,180,176,color1);
	f4(524,518,522,523,color1);
	f4(558,565,568,557,color1);
	f4(601,602,603,608,color1);
	f4(259,266,261,260,color1);
	f4(145,144,147,146,color1);
	f4(383,431,432,382,color1);
	f4(487,488,489,486,color1);
	f4(299,83,77,76,color1);
	f4(641,418,419,425,color1);
	f4(388,395,383,386,color1);
	f4(223,222,219,215,color1);
	f4(19,22,23,24,color1);
	f4(39,107,106,105,color1);
	f4(147,133,129,148,color1);
	f4(162,161,153,163,color1);
	f4(164,163,69,72,color1);
	f4(197,202,201,200,color1);
	f4(230,229,218,231,color1);
	f4(222,241,240,235,color1);
	f4(98,101,254,255,color1);
	f4(267,268,27,30,color1);
	f4(285,284,282,286,color1);
	f4(336,335,186,337,color1);
	f4(365,364,361,366,color1);
	f4(448,449,381,447,color1);
	f4(471,475,489,490,color1);
	f4(495,503,504,505,color1);
	f4(411,505,506,414,color1);
	f4(543,544,539,542,color1);
	f4(560,571,572,573,color1);
	f4(582,583,564,577,color1);
	f4(596,443,440,597,color1);
	f4(369,610,609,372,color1);
	f4(624,626,627,628,color1);
	f4(528,677,678,679,color1);
	f4(669,670,671,672,color1);
	f4(661,662,663,664,color1);
	f4(649,650,651,652,color1);
	f4(645,646,647,648,color1);
	f4(640,637,638,639,color1);
	f4(576,573,574,575,color1);
	f4(551,548,549,550,color1);
	f4(539,540,541,538,color1);
	f4(512,511,510,420,color1);
	f4(509,488,507,508,color1);
	f4(502,499,500,501,color1);
	f4(434,435,436,437,color1);
	f4(405,406,407,404,color1);
	f4(401,402,399,400,color1);
	f4(371,372,373,374,color1);
	f4(360,357,358,359,color1);
	f4(329,328,327,330,color1);
	f4(319,322,321,320,color1);
	f4(309,308,307,310,color1);
	f4(305,304,303,306,color1);
	f4(298,297,296,295,color1);
	f4(232,231,234,233,color1);
	f4(207,206,209,208,color1);
	f4(199,198,197,196,color1);
	f4(168,169,170,78,color1);
	f4(165,146,167,166,color1);
	f4(158,157,160,159,color1);
	f4(94,93,92,95,color1);
	f4(65,64,63,62,color1);
	f4(57,60,59,58,color1);
	f4(31,30,29,32,color1);
	f4(18,17,16,15,color1);
	f4(183,178,195,184,color1);
	f4(525,526,537,520,color1);
	f4(608,604,606,607,color1);
	f4(449,450,456,457,color1);
	f4(394,395,388,389,color1);
	f4(266,265,264,262,color1);
	f4(107,115,114,108,color1);
	f4(52,47,46,53,color1);
	f4(250,249,248,251,color1);
	f4(590,591,592,593,color1);
	f4(584,588,589,590,color1);
	f4(569,570,550,552,color1);
	f4(379,371,374,377,color1);
	f4(247,246,242,248,color1);
	f4(208,228,227,210,color1);
	f4(32,29,37,35,color1);
	f4(251,241,224,250,color1);
	f4(566,583,593,592,color1);
	f4(593,581,584,590,color1);
	f4(375,376,377,374,color1);
	f4(380,370,371,379,color1);
	f4(242,239,251,248,color1);
	f4(35,34,33,32,color1);
	f4(29,28,38,37,color1);
	f4(489,475,479,480,color1);
	f4(441,442,434,437,color1);
	f4(147,138,137,133,color1);
	f4(99,95,92,100,color1);
	f4(568,565,566,567,color1);
	f4(434,442,432,433,color1);
	f4(226,225,224,223,color1);
	f4(92,91,90,100,color1);
	f4(195,190,187,184,color1);
	f4(565,558,561,564,color1);
	f4(532,526,530,531,color1);
	f4(413,642,408,412,color1);
	f4(66,300,71,70,color1);
	f4(595,596,591,594,color1);
	f4(581,582,577,580,color1);
	f4(249,254,253,252,color1);
	f4(239,238,235,240,color1);
	f4(444,432,442,443,color1);
	f4(187,190,189,188,color1);
	f4(100,90,102,101,color1);
	f4(90,89,41,40,color1);
	f4(116,132,124,119,color1);
	f4(458,461,466,474,color1);
	f4(598,591,596,597,color1);
	f4(578,579,580,577,color1);
	f4(562,563,564,561,color1);
	f4(465,466,461,462,color1);
	f4(402,643,644,399,color1);
	f4(256,255,254,249,color1);
	f4(236,235,238,237,color1);
	f4(220,219,222,221,color1);
	f4(123,120,119,124,color1);
	f4(60,57,302,301,color1);
	f4(43,113,112,111,color1);
	f4(454,455,385,453,color1);
	f4(613,616,617,618,color1);
	f4(588,586,373,587,color1);
	f4(536,533,534,535,color1);
	f4(532,533,536,537,color1);
	f4(468,472,473,467,color1);
	f4(466,467,473,474,color1);
	f4(423,424,421,422,color1);
	f4(275,274,271,276,color1);
	f4(31,244,246,245,color1);
	f4(192,191,194,193,color1);
	f4(131,130,126,125,color1);
	f4(131,125,124,132,color1);
	f4(79,82,81,80,color1);
	f4(2,6,5,4,color1);
	f4(35,37,21,36,color1);
	f4(113,49,132,116,color1);
	f4(175,174,171,168,color1);
	f4(206,205,193,96,color1);
	f4(228,97,256,225,color1);
	f4(339,338,199,335,color1);
	f4(270,341,340,34,color1);
	f4(347,348,344,346,color1);
	f4(363,379,377,378,color1);
	f4(455,458,474,391,color1);
	f4(517,510,513,516,color1);
	f4(548,438,535,547,color1);
	f4(598,439,570,567,color1);
	f4(541,680,681,677,color1);
	f4(612,376,682,683,color1);
	f4(673,674,675,676,color1);
	f4(665,666,667,668,color1);
	f4(660,657,655,656,color1);
	f4(658,654,655,657,color1);
	f4(654,658,659,653,color1);
	f4(653,659,660,656,color1);
	f4(636,633,631,632,color1);
	f4(634,630,631,633,color1);
	f4(630,634,635,629,color1);
	f4(629,635,636,632,color1);
	f4(613,614,615,616,color1);
	f4(345,611,378,612,color1);
	f4(601,523,599,600,color1);
	f4(585,586,588,584,color1);
	f4(561,558,559,560,color1);
	f4(546,547,535,545,color1);
	f4(526,527,528,529,color1);
	f4(515,516,513,514,color1);
	f4(497,498,494,496,color1);
	f4(410,496,494,495,color1);
	f4(494,498,491,492,color1);
	f4(482,491,499,502,color1);
	f4(471,472,469,470,color1);
	f4(465,469,472,468,color1);
	f4(463,464,465,462,color1);
	f4(460,461,458,459,color1);
	f4(445,446,382,444,color1);
	f4(431,429,426,430,color1);
	f4(641,425,426,644,color1);
	f4(420,421,424,419,color1);
	f4(418,415,416,417,color1);
	f4(404,643,402,403,color1);
	f4(431,396,428,429,color1);
	f4(393,394,391,392,color1);
	f4(390,391,394,389,color1);
	f4(395,396,431,383,color1);
	f4(368,381,382,446,color1);
	f4(380,368,369,370,color1);
	f4(362,367,368,380,color1);
	f4(348,361,362,363,color1);
	f4(356,353,351,352,color1);
	f4(354,350,351,353,color1);
	f4(350,354,355,349,color1);
	f4(349,355,356,352,color1);
	f4(344,345,342,343,color1);
	f4(333,332,331,334,color1);
	f4(325,324,323,326,color1);
	f4(313,315,318,314,color1);
	f4(313,312,316,315,color1);
	f4(317,316,312,311,color1);
	f4(318,317,311,314,color1);
	f4(289,291,294,290,color1);
	f4(289,288,292,291,color1);
	f4(293,292,288,287,color1);
	f4(294,293,287,290,color1);
	f4(271,274,273,272,color1);
	f4(3,270,36,269,color1);
	f4(257,181,259,258,color1);
	f4(243,242,246,244,color1);
	f4(219,218,217,216,color1);
	f4(204,203,193,205,color1);
	f4(191,190,195,194,color1);
	f4(184,187,186,185,color1);
	f4(173,172,171,174,color1);
	f4(155,154,152,156,color1);
	f4(68,153,152,154,color1);
	f4(152,150,149,156,color1);
	f4(140,160,157,149,color1);
	f4(126,130,129,128,color1);
	f4(123,126,128,127,color1);
	f4(121,120,123,122,color1);
	f4(116,119,118,117,color1);
	f4(103,102,40,104,color1);
	f4(89,88,84,87,color1);
	f4(299,302,84,83,color1);
	f4(82,79,78,77,color1);
	f4(76,75,74,73,color1);
	f4(66,65,301,300,color1);
	f4(62,61,60,301,color1);
	f4(89,87,86,54,color1);
	f4(47,52,51,50,color1);
	f4(48,47,50,49,color1);
	f4(53,41,89,54,color1);
	f4(26,104,40,39,color1);
	f4(38,28,27,26,color1);
	f4(20,38,26,25,color1);
	f4(6,21,20,19,color1);
	f4(9,11,14,10,color1);
	f4(9,8,12,11,color1);
	f4(13,12,8,7,color1);
	f4(14,13,7,10,color1);
	f4(0,3,2,1,color1);
	f4(2,4,346,344,color2);
	f4(6,2,344,348,color2);
	f4(5,6,348,347,color2);
	f4(4,5,347,346,color2);
	f4(319,661,664,322,color2);
	f4(322,664,663,321,color2);
	f4(321,663,662,320,color2);
	f4(320,662,661,319,color2);
	f4(318,315,657,660,color2);
	f4(317,318,660,659,color2);
	f4(316,317,659,658,color2);
	f4(315,316,658,657,color2);
	f4(311,653,656,314,color2);
	f4(314,656,655,313,color2);
	f4(313,655,654,312,color2);
	f4(312,654,653,311,color2);
	f4(310,307,649,652,color2);
	f4(309,310,652,651,color2);
	f4(308,309,651,650,color2);
	f4(307,308,650,649,color2);
	f4(15,357,360,18,color2);
	f4(18,360,359,17,color2);
	f4(17,359,358,16,color2);
	f4(16,358,357,15,color2);
	f4(14,11,353,356,color2);
	f4(13,14,356,355,color2);
	f4(12,13,355,354,color2);
	f4(11,12,354,353,color2);
	f4(306,303,645,648,color2);
	f4(305,306,648,647,color2);
	f4(304,305,647,646,color2);
	f4(303,304,646,645,color2);
	f4(7,349,352,10,color2);
	f4(10,352,351,9,color2);
	f4(9,351,350,8,color2);
	f4(8,350,349,7,color2);
	f4(299,641,644,302,color2);
	f4(302,644,643,301,color2);
	f4(301,643,642,300,color2);
	f4(300,642,641,299,color2);
	f4(334,331,673,676,color2);
	f4(333,334,676,675,color2);
	f4(332,333,675,674,color2);
	f4(331,332,674,673,color2);
	f4(326,323,665,668,color2);
	f4(325,326,668,667,color2);
	f4(324,325,667,666,color2);
	f4(323,324,666,665,color2);
	f4(330,327,669,672,color2);
	f4(329,330,672,671,color2);
	f4(328,329,671,670,color2);
	f4(327,328,670,669,color2);
	f4(295,637,640,298,color2);
	f4(298,640,639,297,color2);
	f4(297,639,638,296,color2);
	f4(296,638,637,295,color2);
	f4(294,291,633,636,color2);
	f4(293,294,636,635,color2);
	f4(292,293,635,634,color2);
	f4(291,292,634,633,color2);
	f4(287,629,632,290,color2);
	f4(290,632,631,289,color2);
	f4(289,631,630,288,color2);
	f4(288,630,629,287,color2);
	f4(282,284,626,624,color2);
	f4(286,282,624,628,color2);
	f4(285,286,628,627,color2);
	f4(284,285,627,626,color2);
	f4(273,277,619,615,color2);
	f4(283,273,615,625,color2);
	f4(282,283,625,624,color2);
	f4(281,282,624,623,color2);
	f4(280,281,623,622,color2);
	f4(279,280,622,621,color2);
	f4(278,279,621,620,color2);
	f4(277,278,620,619,color2);
	f4(271,613,618,276,color2);
	f4(275,276,618,617,color2);
	f4(274,275,617,616,color2);
	f4(273,274,616,615,color2);
	f4(272,273,615,614,color2);
	f4(271,272,614,613,color2);
	f4(3,0,342,345,color2);
	f4(2,3,345,344,color2);
	f4(1,2,344,343,color2);
	f4(0,1,343,342,color2);
	f4(270,3,345,612,color2);
	f4(36,270,612,378,color2);
	f4(269,36,378,611,color2);
	f4(3,269,611,345,color2);
	f4(34,340,682,376,color2);
	f4(270,34,376,612,color2);
	f4(341,270,612,683,color2);
	f4(340,341,683,682,color2);
	f4(268,610,369,27,color2);
	f4(267,609,610,268,color2);
	f4(30,372,609,267,color2);
	f4(27,369,372,30,color2);
	f4(259,260,602,601,color2);
	f4(266,259,601,608,color2);
	f4(265,266,608,607,color2);
	f4(264,265,607,606,color2);
	f4(182,264,606,524,color2);
	f4(263,182,524,605,color2);
	f4(88,263,605,430,color2);
	f4(262,88,430,604,color2);
	f4(261,262,604,603,color2);
	f4(260,261,603,602,color2);
	f4(181,257,599,523,color2);
	f4(259,181,523,601,color2);
	f4(258,259,601,600,color2);
	f4(257,258,600,599,color2);
	f4(256,97,439,598,color2);
	f4(225,256,598,567,color2);
	f4(228,225,567,570,color2);
	f4(97,228,570,439,color2);
	f4(252,594,591,249,color2);
	f4(256,249,591,598,color2);
	f4(255,256,598,597,color2);
	f4(98,255,597,440,color2);
	f4(101,98,440,443,color2);
	f4(254,101,443,596,color2);
	f4(253,254,596,595,color2);
	f4(252,253,595,594,color2);
	f4(239,242,584,581,color2);
	f4(251,239,581,593,color2);
	f4(241,251,593,583,color2);
	f4(224,241,583,566,color2);
	f4(250,224,566,592,color2);
	f4(249,250,592,591,color2);
	f4(248,249,591,590,color2);
	f4(247,248,590,589,color2);
	f4(246,247,589,588,color2);
	f4(245,246,588,587,color2);
	f4(31,245,587,373,color2);
	f4(244,31,373,586,color2);
	f4(33,244,586,375,color2);
	f4(243,33,375,585,color2);
	f4(243,585,584,242,color2);
	f4(222,235,577,564,color2);
	f4(241,222,564,583,color2);
	f4(240,241,583,582,color2);
	f4(239,240,582,581,color2);
	f4(238,239,581,580,color2);
	f4(238,580,579,237,color2);
	f4(236,237,579,578,color2);
	f4(235,236,578,577,color2);
	f4(231,232,574,573,color2);
	f4(234,231,573,576,color2);
	f4(233,234,576,575,color2);
	f4(232,233,575,574,color2);
	f4(218,229,571,560,color2);
	f4(231,218,560,573,color2);
	f4(230,231,573,572,color2);
	f4(229,230,572,571,color2);
	f4(208,210,552,550,color2);
	f4(228,208,550,570,color2);
	f4(227,228,570,569,color2);
	f4(226,227,569,568,color2);
	f4(225,226,568,567,color2);
	f4(224,225,567,566,color2);
	f4(223,224,566,565,color2);
	f4(222,223,565,564,color2);
	f4(222,564,563,221,color2);
	f4(220,221,563,562,color2);
	f4(219,220,562,561,color2);
	f4(218,219,561,560,color2);
	f4(217,218,560,559,color2);
	f4(216,217,559,558,color2);
	f4(215,216,558,557,color2);
	f4(214,215,557,556,color2);
	f4(213,214,556,555,color2);
	f4(212,213,555,554,color2);
	f4(211,212,554,553,color2);
	f4(210,211,553,552,color2);
	f4(206,207,549,548,color2);
	f4(209,206,548,551,color2);
	f4(208,209,551,550,color2);
	f4(207,208,550,549,color2);
	f4(193,203,545,535,color2);
	f4(96,193,535,438,color2);
	f4(206,96,438,548,color2);
	f4(205,206,548,547,color2);
	f4(204,205,547,546,color2);
	f4(203,204,546,545,color2);
	f4(197,200,542,539,color2);
	f4(202,197,539,544,color2);
	f4(201,202,544,543,color2);
	f4(200,201,543,542,color2);
	f4(199,196,538,541,color2);
	f4(198,199,541,540,color2);
	f4(197,198,540,539,color2);
	f4(196,197,539,538,color2);
	f4(335,199,541,677,color2);
	f4(339,335,677,681,color2);
	f4(338,339,681,680,color2);
	f4(199,338,680,541,color2);
	f4(186,335,677,528,color2);
	f4(337,186,528,679,color2);
	f4(336,337,679,678,color2);
	f4(335,336,678,677,color2);
	f4(178,183,525,520,color2);
	f4(195,178,520,537,color2);
	f4(195,537,536,194,color2);
	f4(193,194,536,535,color2);
	f4(192,193,535,534,color2);
	f4(191,192,534,533,color2);
	f4(190,191,533,532,color2);
	f4(189,190,532,531,color2);
	f4(189,531,530,188,color2);
	f4(187,188,530,529,color2);
	f4(186,187,529,528,color2);
	f4(185,186,528,527,color2);
	f4(184,185,527,526,color2);
	f4(183,184,526,525,color2);
	f4(80,176,518,422,color2);
	f4(182,80,422,524,color2);
	f4(181,182,524,523,color2);
	f4(180,181,523,522,color2);
	f4(179,180,522,521,color2);
	f4(178,179,521,520,color2);
	f4(177,178,520,519,color2);
	f4(176,177,519,518,color2);
	f4(168,171,513,510,color2);
	f4(175,168,510,517,color2);
	f4(174,175,517,516,color2);
	f4(173,174,516,515,color2);
	f4(172,173,515,514,color2);
	f4(171,172,514,513,color2);
	f4(170,512,420,78,color2);
	f4(169,511,512,170,color2);
	f4(168,510,511,169,color2);
	f4(78,420,510,168,color2);
	f4(146,165,507,488,color2);
	f4(167,146,488,509,color2);
	f4(166,167,509,508,color2);
	f4(165,166,508,507,color2);
	f4(163,164,506,505,color2);
	f4(69,163,505,411,color2);
	f4(72,69,411,414,color2);
	f4(164,72,414,506,color2);
	f4(153,161,503,495,color2);
	f4(163,153,495,505,color2);
	f4(162,163,505,504,color2);
	f4(161,162,504,503,color2);
	f4(140,149,491,482,color2);
	f4(160,140,482,502,color2);
	f4(159,160,502,501,color2);
	f4(158,159,501,500,color2);
	f4(157,158,500,499,color2);
	f4(156,157,499,498,color2);
	f4(155,156,498,497,color2);
	f4(154,155,497,496,color2);
	f4(68,154,496,410,color2);
	f4(153,68,410,495,color2);
	f4(152,153,495,494,color2);
	f4(151,152,494,493,color2);
	f4(150,151,493,492,color2);
	f4(150,492,491,149,color2);
	f4(129,133,475,471,color2);
	f4(148,129,471,490,color2);
	f4(147,148,490,489,color2);
	f4(146,147,489,488,color2);
	f4(145,146,488,487,color2);
	f4(144,145,487,486,color2);
	f4(143,144,486,485,color2);
	f4(142,143,485,484,color2);
	f4(141,142,484,483,color2);
	f4(140,141,483,482,color2);
	f4(136,140,482,478,color2);
	f4(139,136,478,481,color2);
	f4(138,139,481,480,color2);
	f4(137,138,480,479,color2);
	f4(136,137,479,478,color2);
	f4(135,136,478,477,color2);
	f4(134,135,477,476,color2);
	f4(133,134,476,475,color2);
	f4(113,116,458,455,color2);
	f4(49,113,455,391,color2);
	f4(132,49,391,474,color2);
	f4(131,132,474,473,color2);
	f4(131,473,472,130,color2);
	f4(129,130,472,471,color2);
	f4(128,129,471,470,color2);
	f4(128,470,469,127,color2);
	f4(123,127,469,465,color2);
	f4(126,123,465,468,color2);
	f4(125,126,468,467,color2);
	f4(124,125,467,466,color2);
	f4(123,124,466,465,color2);
	f4(122,123,465,464,color2);
	f4(121,122,464,463,color2);
	f4(120,121,463,462,color2);
	f4(119,120,462,461,color2);
	f4(118,119,461,460,color2);
	f4(117,118,460,459,color2);
	f4(116,117,459,458,color2);
	f4(107,108,450,449,color2);
	f4(115,107,449,457,color2);
	f4(114,115,457,456,color2);
	f4(43,114,456,385,color2);
	f4(43,385,455,113,color2);
	f4(112,113,455,454,color2);
	f4(111,112,454,453,color2);
	f4(110,111,453,452,color2);
	f4(109,110,452,451,color2);
	f4(108,109,451,450,color2);
	f4(39,105,447,381,color2);
	f4(107,39,381,449,color2);
	f4(106,107,449,448,color2);
	f4(105,106,448,447,color2);
	f4(26,39,381,368,color2);
	f4(104,26,368,446,color2);
	f4(103,104,446,445,color2);
	f4(102,103,445,444,color2);
	f4(101,102,444,443,color2);
	f4(100,101,443,442,color2);
	f4(99,100,442,441,color2);
	f4(98,99,441,440,color2);
	f4(97,98,440,439,color2);
	f4(96,97,439,438,color2);
	f4(95,96,438,437,color2);
	f4(94,95,437,436,color2);
	f4(93,94,436,435,color2);
	f4(92,93,435,434,color2);
	f4(91,92,434,433,color2);
	f4(90,91,433,432,color2);
	f4(90,432,431,89,color2);
	f4(88,89,431,430,color2);
	f4(84,88,430,426,color2);
	f4(87,84,426,429,color2);
	f4(86,87,429,428,color2);
	f4(85,86,428,427,color2);
	f4(84,85,427,426,color2);
	f4(84,426,425,83,color2);
	f4(82,83,425,424,color2);
	f4(81,82,424,423,color2);
	f4(80,81,423,422,color2);
	f4(80,422,421,79,color2);
	f4(78,79,421,420,color2);
	f4(77,78,420,419,color2);
	f4(76,77,419,418,color2);
	f4(75,76,418,417,color2);
	f4(74,75,417,416,color2);
	f4(73,74,416,415,color2);
	f4(72,73,415,414,color2);
	f4(71,72,414,413,color2);
	f4(70,71,413,412,color2);
	f4(69,70,412,411,color2);
	f4(68,69,411,410,color2);
	f4(67,68,410,409,color2);
	f4(66,67,409,408,color2);
	f4(65,66,408,407,color2);
	f4(64,65,407,406,color2);
	f4(63,64,406,405,color2);
	f4(62,63,405,404,color2);
	f4(61,62,404,403,color2);
	f4(60,61,403,402,color2);
	f4(59,60,402,401,color2);
	f4(58,59,401,400,color2);
	f4(57,58,400,399,color2);
	f4(56,57,399,398,color2);
	f4(55,56,398,397,color2);
	f4(54,55,397,396,color2);
	f4(53,54,396,395,color2);
	f4(52,53,395,394,color2);
	f4(51,52,394,393,color2);
	f4(50,51,393,392,color2);
	f4(50,392,391,49,color2);
	f4(48,49,391,390,color2);
	f4(47,48,390,389,color2);
	f4(46,47,389,388,color2);
	f4(45,46,388,387,color2);
	f4(44,45,387,386,color2);
	f4(43,44,386,385,color2);
	f4(42,43,385,384,color2);
	f4(42,384,383,41,color2);
	f4(40,41,383,382,color2);
	f4(40,382,381,39,color2);
	f4(20,25,367,362,color2);
	f4(38,20,362,380,color2);
	f4(37,38,380,379,color2);
	f4(21,37,379,363,color2);
	f4(36,21,363,378,color2);
	f4(35,36,378,377,color2);
	f4(34,35,377,376,color2);
	f4(33,34,376,375,color2);
	f4(32,33,375,374,color2);
	f4(31,32,374,373,color2);
	f4(30,31,373,372,color2);
	f4(29,30,372,371,color2);
	f4(28,29,371,370,color2);
	f4(27,28,370,369,color2);
	f4(26,27,369,368,color2);
	f4(26,368,367,25,color2);
	f4(24,366,361,19,color2);
	f4(23,365,366,24,color2);
	f4(22,364,365,23,color2);
	f4(19,361,364,22,color2);
	f4(6,19,361,348,color2);
	f4(21,6,348,363,color2);
	f4(20,21,363,362,color2);
	f4(19,20,362,361,color2);

	this.computeFaceNormals();

	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vector3( x, y, z ) );

	}

	function f3( a, b, c, color ) {

		scope.faces.push( new THREE.Face3( a, b, c, undefined, color ) );

	}

	function f4( a, b, c, d, color ) {

		scope.faces.push( new THREE.Face3( a, b, d, undefined, color ) );
		scope.faces.push( new THREE.Face3( b, c, d, undefined, color ) );

	}

}

Qrcode.prototype = Object.create( THREE.Geometry.prototype );
