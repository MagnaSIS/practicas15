/**  
 *   placeForMe -
 *   Copyright (C) 2015 by Magna SIS <magnasis@magnasis.com>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var model = require('../models/models.js');

exports.encrypt = (function(password){
	var crypto = require('crypto');
	return (crypto.createHash('sha256').update(password).digest('base64'));
});


exports.requiredSecureConection = function (req,res,next){
	var url = "https://"+ req.headers.host + ':'+ process.env.SECUREPORT+req.url;
	console.log("local port= " + process.env.PORT);
	console.log("local Secureport= " + process.env.SECUREPORT);
	console.log("url="+url);
	
	if (!req.secure) {
		 console.log("no secure Connection");
		 res.redirect(url);
	 }else{
		 console.log("Secure Connection");
		 next();
	 }
};

exports.coursesLoader = function(){
	model.Course.create({
		name: 'IS2',
		description: 'Ingenier�a del Software 2 Profesores: A.Go�i - J.Iturrioz Horarios: Martes(9:00-10:30) Miercoles(10:45-12:15) Jueves(12:30-14:00) ',
		specialisation:'IS',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'DCSD',
		description: 'Dise�o y Construcci�n de Sistemas Digitales. Profesores: A. Arruti, C. Amuch�stegui Horario: Martes (10:45-12:15), mi�rcoles (12:30-14:00), viernes (9:00-10:30)',
		specialisation:'IC',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'ASR',
		description: 'Administraci�n de Sistemas y Redes. Profesores: G. Alvarez , A. I. Gonz�lez Horario: Martes (9:00-10:30), mi�rcoles (10:45-12:15), jueves (12:30-14:00)',
		specialisation:'IC',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'CC',
		description: 'Computaci�n Cient�fica. Profesores: J. Zapiain Horario: Martes (9:00-10:30), mi�rcoles (10:45-12:15), jueves (12:30-14:00)',
		specialisation:'C',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'DBD',
		description: 'Dise�o de Base de Datos Profesores: A. Illarramendi Horarios: Lunes(9:00-10:30) Martes(10:45-12:15) Miercoles(12:30:14:00) ',
		specialisation:'IS',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SE',
		description: 'Sistema Eragileak. Irakasleak: I. Alegria, E. Larraza Ordutegia: Astelehena (12:30-14:00), osteguna (9:00-10:30), ostirala (10:45-12:15) ',
		specialisation:'IC',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SDDE',
		description: 'Sistema Digitalen Diseinua eta Eraikuntza. Irakasleak:A. Ibarra, I. Etxeberria Ordutegia: Asteartea (10:45-12:15), asteazkena (12:30-14:00), ostirala (9:00-10:30) ',
		specialisation:'IC',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SSA',
		description: 'Sistemen eta Sareen Administrazioa. Irakasleak: R.Corti�as Ordutegia: Asteartea (9:00-10:30), asteazkena (10:45-12:15), osteguna (12:30-14:00)',
		specialisation:'IC',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'MDD',
		description: 'Miner�a de Datos. Irakasleak: I. Irigoen � I. Inza- J. Hern�ndez Ordutegia: Lunes (12:30-14:00), jueves (9:00-10:30), viernes (10:45-12:15)',
		specialisation:'C',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'MAC',
		description: 'Modelos Abstractos de C�mputo. Profesores: B.Cases Horario: Lunes (10:45-12:15), martes (12:30-14:00), viernes (9:00-10:30)',
		specialisation:'C',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'EHP',
		description: 'Errendimendu Handiko Prozesadoreak. Irakasleak:O.Arregi. Ordutegia: Astelehena (9:00-10:30), asteartea (10:45-12:15), asteazkena (12:30-14:00)',
		specialisation:'IC',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'GC',
		description: 'Gr�ficos por Computador. Profesores: M. Segura Horario: Lunes (9:00-10:30), martes (10:45-12:15). mi�rcoles (12:30-14:00)',
		specialisation:'IC',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SI2',
		description: 'Software Ingenieritza II Irakasleak : J. R. Zubizarreta Ordutegia: Asteartea(9:00-10:30) Asteazkena(10:45-12:15) Osteguna(12:30-14:00)',
		specialisation:'IS',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'DBD',
		description: 'Datu Baseen Diseinua Irakasleak: M. Oronoz�A. Arruarte Ordutegia: Astelehena(9:00-10:30) Asteartea(10:45-12:15) Asteazkena(12:30-14:00)',
		specialisation:'IS',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'WS',
		description: 'Web Sistemak Irakasleak: R. Arruabarrena Ordutegia: Osteguna(9:00-10:30) Ostirala(10:45-12:15) Astelehena(12:30-14:00) ',
		specialisation:'IS',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'PKE',
		description: 'Pertsonen eta Konputagailuen Egitura Irakasleak: I. Usandizaga Ordutegia: Astelehena(10:30-12:15) Asteartea(12:30-14:00) Ostirala(9:00-10:30) ',
		specialisation:'IS',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'IPC',
		description: 'Interacci�n Persona Computador. Profesores: B. Losada Horario: lunes (10:45-12:15), martes (12:30-14:00), viernes (9:00-10:30) ',
		specialisation:'IS',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SW',
		description: 'Sistemas Web Profesores: J.M Blanco, J.A Vadillo Horario: lunes (12:30-14:00), jueves (9:00-10:30), viernes (10:45-12:15) ',
		specialisation:'IS',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'KG',
		description: 'Konputagailu bidezko Grafikoak. Irakasleak: B. Calvo, X. Albizuri Ordutegia: Astelehena (9:00-10:30), asteartea (10:45-12:15), asteazkena (12:30-14:00) ',
		specialisation:'C',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'PAR',
		description: 'Procesadores de Alto Rendimiento. Profesores: C.Rodr�guez Horarios: Lunes(9:00-10:30), martes (10:45-12:15), mi�rcoles (12:30-14:00)',
		specialisation:'IC',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SO',
		description: 'Sistemas Operativos. Profesores: T. Mikelez, I. Morlan Horario: Lunes (12:30-14:00), jueves (9:00-10:30), viernes (10:45-12:15)',
		specialisation:'IS',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'DM',
		description: 'Datu Meatzaritza. Irakasleak: A. Zelaia, B. Sierra Ordutegia: Astelehena (12:30-14:00), osteguna (9:00-10:30), ostirala (10:45-12:15)',
		specialisation:'C',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'KEA',
		description: 'Konputazio Eredu Abstraktuak. Irakasleak: M. Maritxalar Ordutegia: Astelehena (10:45-12:15), asteartea (12:30-14:00), ostirala(9:00-10:30)',
		specialisation:'C',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'ZK',
		description: 'Zientziarako Konputazioa. Irakasleak: A. Murua � J. Makazaga Ordutegia: Asteartea (9:00-10:30), asteazkena (10:45-12:15), osteguna (12:30-14:00)',
		specialisation:'C',
		year:'3�',
		semester:'1�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});

	model.Course.create({
		name: 'DIS',
		description: 'Dise�o Industrial del Software Profesores: T. P�rez Horarios: lunes (12:30-14:00), jueves (9:00-10:30), viernes (10:45-12:15)',
		specialisation:'IS',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'DSE',
		description: 'Dise�o de Sistemas Empotrados. Profesores: Horario: Martes (9:00-10:30), mi�rcoles (10:45-12:15), jueves (12:30-14:00)',
		specialisation:'IC',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'TIR',
		description: 'Tecnolog�as e Infraestructuras de Red. Profesores: J.A. Jim�nez de Vicu�a Horario: Mi�rcoles (9:00-10:30), jueves (10:45-12:15), viernes (12:30-14:00)',
		specialisation:'IC',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SGI',
		description: 'Softwarearen Garapen Industriala. Irakasleak: A.Irastorza Ordutegia: Astelehena (12:30-14:00), osteguna (9:00-10:30), ostirala (10:45-12.15)',
		specialisation:'IS',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'HADS',
		description: 'Herramientas Avanzadas de Desarrollo del Software Profesores: J.A Vadillo Horarios: mi�rcoles (9:00-10:30), jueves (10:45-12:15), viernes (12:30-14:00)',
		specialisation:'IS',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'IA',
		description: 'Inteligencia Artificial. Profesores: B. Cases Horario: martes(9:00-10:30), mi�rcoles(10:45-12:15) jueves (12:30-14:00)',
		specialisation:'C',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'GAI',
		description: 'Gesti�n Avanzada de la Informaci�n Profesores: O. D�az Horarios: martes (9:00-10:30), mi�rcoles (10:45-12:15), jueves (12:30-14:00) ',
		specialisation:'IS',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'STA',
		description: 'Sare Teknologiak eta Azpiegiturak. Irakasleak: M. Arrue Ordutegia: Asteazkena (9:00-10:30), jueves (10:45-12:15), viernes (12:30-14:00)',
		specialisation:'IC',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'KPS',
		description: 'Konputazio Paraleloko Sistemak. Iraskaleak: A. Arruabarrena Ordutegia: Astelehena (9:00-10:30), asteartea (10:45-12:15), asteazkena (12:30-14:00)',
		specialisation:'IC',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'STD',
		description: 'Sistema Txertatuen Diseinua. Irakasleak: T. Ruiz Ordutegia: Asteartea (9:00-10:30), asteazkena (10:45-12:15), osteguna (12:30-14:00)',
		specialisation:'IC',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SIEE',
		description: 'Sist. Informatikoen Errendimenduaren Ebaluazioa. Irakasleak: X. Albizuri Ordutegia: Astelehena (12:30-14:00), osteguna (9:00-10:30), ostirala (10:45-12:15)',
		specialisation:'IC',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SK',
		description: 'Softwarearen Kalitatea. Irakasleak: J.R. Zubizarreta � J. M. Pikatza Ordutegia: Astelehena (9:00-10:30), asteartea (10:45-12:15), asteazkena (12:30-14:00)',
		specialisation:'IS',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'IKA',
		description: 'Informazioaren Kudeaketa Aurreratua. Irakasleak: A.Irastorza Ordutegia: Astelehena (9:00-10:30), asteartea (10:45-12:15), asteazkena (12:30-14:00)',
		specialisation:'IS',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SGTA',
		description: 'Softwarea Garatzeko Tresna Aurreratuak. Irakasleak: X. Artola � B. Zapirain Ordutegia: Asteazkena (9:00-10:30), osteguna (10:45-12:15), ostirala (12:30-14:00)',
		specialisation:'IS',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'DA',
		description: 'Dise�o de Algoritmos. Profesores: J.Berm�dez. Horario: Lunes(9:00-10:30), martes(10:45-12:15), mi�rcoles(12:30-14:00)',
		specialisation:'C',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SCP',
		description: 'Sistemas de C�mputo Paralelo. Profesores: N. Mart�n, O. Arregi Horario: Lunes (9:00-10:30), martes (10:45-12:15), mi�rcoles (12:30-14:00)',
		specialisation:'IC',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'C',
		description: 'Compilaci�n. Profesores:B.Losada Horario: mi�rcoles (9:00-10:30), jueves (10:45-12:15), viernes (12:30-14:00)',
		specialisation:'C',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'AD',
		description: 'Algoritmoen Diseinua. Iraskasleak: R. Arruabarrena � N. Ezeiza Ordutegia: Astelehena (9:00-10:30), asteartea (10:45-12:15), asteazkena (12:30-14:00)',
		specialisation:'C',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'ERSI',
		description: 'Evaluaci�n del Rendimiento de Sist. Inform�ticos. Profesores: J. L. Jim�nez Ordutegia: lunes(12:30-14:00), jueves (9:00-10:30), viernes (10:45-12:15)',
		specialisation:'IC',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'K',
		description: 'Konpilazioa. Irakasleak: E. Agirre � N. Ezeiza Ordutegia: Asteazkena (9:00-10:30), osteguna (10:45-12:15), ostirala(12:30-14:00)',
		specialisation:'C',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'AA',
		description: 'Adimen Artifiziala. Iraskasleak: J.M. Pikatza Ordutegia: Asteartea (9:00-10:30), asteazkena(10:45-12:15), osteguna (12:30-14:00)',
		specialisation:'C',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'VEV',
		description: 'Visualizaci�n y Entornos Virtuales. Profesores: M.Hern�ndez Horario: lunes (12:30-14:00), jueves (9:00-10:30), viernes (10:45-12:15)',
		specialisation:'C',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'BIB',
		description: 'Bistaratzea eta Ingurune Birtualak. Irakasleak: A.Soroa Ordutegia: Astelehena (12:30-14:00), Osteguna (9:00-10:30), ostirala (10:45-12:15)',
		specialisation:'C',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'CS',
		description: 'Calidad del Software Profesores: J.R. Zubizarreta-J.M. Pikatza Horarios: lunes (9:00-10:30), martes (10:45-12:15), mi�rcoles (12:30-14:00)',
		specialisation:'IS',
		year:'3�',
		semester:'2�',
		credits: 6,
		vacancies:25,
		MinimalGrade:0
	});

	model.Course.create({
		name: 'RSA',
		description: 'Rob�tica, Sensores y Actuadores Profesores: J. Abascal Horarios: lunes(15:00-17:00) mi�rcoles(17:15-19:15)',
		specialisation:'IC',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'DPR',
		description: 'Dise�o y Proyectos de Redes Profesores: J.M. Rivadeneyra�M. Arrue Horarios: martes (15:00-17:00) jueves (17:15-19:15)',
		specialisation:'IC',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SGSSI',
		description: 'Sistemas de Gesti�n de Seguridad de Sistemas de Informaci�n Profesores: J.M. Blanco Horarios: lunes(17:15-19:15) jueves(15:00-17:00)',
		specialisation:'IS',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'TAIA',
		description: 'T�cnicas Avanzadas de Inteligencia Artificial Profesores: G. Rigau Horarios: lunes(15:00-17:00)',
		specialisation:'C',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'EATD',
		description: 'Electr�nica Aplicada al Tratamiento de Datos Profesores: J. A. Jim�nez de Vicu�a Horarios: mi�rcoles(15:00-17:00) viernes(17:15-19:15)',
		specialisation:'IC',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'VC',
		description: 'Visi�n por Computador Profesores: M. Gra�a - B. Ayerdi Horarios: martes(17:15-19:15) viernes(15:00-17:00)',
		specialisation:'C',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SD',
		description: 'Sistemas Distribuidos Profesores: A. Lafuente � M. Larrea Horarios: mi�rcoles(15:00-17:00) viernes(17:15-19:15)',
		specialisation:'C',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'IC',
		description: 'Ingenier�a de Control Profesores: I.Baraga�a � J. Zapiain Horarios: lunes(17:15-19:15) jueves(15:00-17:00)',
		specialisation:'C',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SBC',
		description: 'Sistemas Basados en el Conocimiento Profesores: I. Fern�ndez Horarios: mi�rcoles(15:00-17:00) viernes(17:15-19:15)',
		specialisation:'IS',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'PRK',
		description: 'Programazio Konkurrentea Profesores: A. Mayor Horarios: martes(15:00-17:00) jueves(17:15-19:15)',
		specialisation:'IS',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'MFDS',
		description: 'M�todos Formales de Desarrollo de Software Profesores: P. Lucio Horarios: lunes(17:15-19:15) jueves(15:00-17:00)',
		specialisation:'IS',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'RKA',
		description: 'Robotika eta Kontrol Adimenduak Profesores: E. Lazkano � J. Makazaga Horarios: martes(15:00-17:00) jueves(17:15-19:15)',
		specialisation:'IC',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'EAER',
		description: 'Euskararen Arauak eta Erabilera Profesores: I.Pagola Horarios: martes(17:15-19:15) viernes(15:00-17:00)',
		specialisation:'C',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'KMM',
		description: 'Komunikazio Mugikorrak eta Multimediakoak Profesores: J. Rivadeneyra � A. Mendiburu Horarios: lunes(15:00-17:00) mi�rcoles(17:15-19:15)',
		specialisation:'IC',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'IAI',
		description: 'Interfaze Adimendunak eta Irisgarriak Profesores: N. Garay Horarios: viernes(15:00-17:00) martes(17:15-19:15)',
		specialisation:'IC',
		year:'4�',
		semester:'1�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});

	model.Course.create({
		name: 'ABD',
		description: 'Administraci�n de Bases de Datos Profesores: A. S�nchez Horarios: martes(17:15-19:15) mi�rcoles(15:00-17:00) viernes(15:00-17:00)',
		specialisation:'IS',
		year:'4�',
		semester:'2�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'M3D',
		description: 'Modelado 3D Profesores: araga�a � M.C. Hern�ndez Horarios: martes(17:15-19:15) mi�rcoles(15:00-17:00) viernes (15:00-17:00)',
		specialisation:'C',
		year:'4�',
		semester:'2�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'PL',
		description: 'Programaci�n L�gica Profesores: M. Navarro Horarios:lunes(17:15-19:15) martes(15:00-17:00) jueves(17:15-19:15)',
		specialisation:'IS',
		year:'4�',
		semester:'2�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'PDSI',
		description: 'Procesado Digital de Sonido e Imagen Profesores: A. Arruti � A. Ibarra Horarios: lunes(17:15-19:15) martes(15:00-17:00) jueves(17:15-19:15)',
		specialisation:'IC',
		year:'4�',
		semester:'2�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'SRDSI',
		description: 'Seguridad, Rendimiento y Disponibilidad en Servicios e Infraestructuras Profesores: A.I. Gonz�lez Horarios: lunes(15:00-17:00) mi�rcoles(17:15-19:15) jueves(15:00-17:00)',
		specialisation:'IC',
		year:'4�',
		semester:'2�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'HP',
		description: 'Hizkuntzaren Prozesamendua Profesores: K. Sarasola � R. Agerri Horarios: martes(17:15-19:15) mi�rcoles(15:00-17:00) viernes(15:00-17:00)',
		specialisation:'C',
		year:'4�',
		semester:'2�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'HA',
		description: 'Hizkuntzalaritza Aplikatua Profesores: J. M. Arriola Horarios: lunes(15:00-17:00)',
		specialisation:'C',
		year:'4�',
		semester:'2�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	});
	model.Course.create({
		name: 'BH',
		description: 'Bilaketarako Heuristikoak Profesores: B. Calvo Horarios: lunes(17:15-19:15) martes(15:00-17:00) jueves(17:15-19:15)',
		specialisation:'C',
		year:'4�',
		semester:'2�',
		credits: 6,
		vacancies:14,
		MinimalGrade:0
	})
}
