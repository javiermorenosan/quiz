var path = require('path');

//Cargar modelo ORM
var Sequelize = require('sequelize');


//Usar BBDD SQLite
//DATABASE_URL = sqlite:///
//DATABASE_STORAGE= quiz.sqlite
//Usar BBDD Postgres:
// DATABASE_URL = postgres://user:passwd@host:port/DATABASE_URL

var url, storage;

if (!process.env.DATABASE_URL) {
	url = "sqlite:///";
	storage = "quiz.sqlite";
} else {
	url = process.env.DATABASE_URL;
	storage = process.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize(url,
								{ storage: storage, 
									omitNull: true
								});

//Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//Importar la definicion de la tabla Comments de comments.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));

//Importar la definicion de la tabla Users de user.js
var User = sequelize.import(path.join(__dirname, 'user'));

//Relaciones 1 a N entre Quiz y Comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Relaciones 1 a N entre User y Quiz
User.hasMany(Quiz, {foreignKey: 'AuthorId'});
Quiz.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});

//Relaciones 1 a N entre User y Comments
User.hasMany(Comment, {foreignKey: 'AuthorName'});
Comment.belongsTo(User, {as: 'Author', foreignKey: 'AuthorName'});

////sequelize.sync() crea e inicializa tabla de preguntas en DB
//sequelize
//.sync()
//.then(function() { // Ya se han creado las tablas necesarias.
//	return Quiz.count()
//			.then(function (c) {
//				if (c === 0) { //la tabla se inicializa solo si esta vacía
//					return Quiz
//							.bulkCreate([ {question: 'Capital de Italia', answer: 'Roma'},
//										  {question: 'Capital de Portugal', answer: 'Lisboa'}
//										])
//							.then(function() {
//								console.log('Base de datos inicializada con datos');
//							});
//				}
//			});
//})
//.catch(function(error){
//	console.log("Error sincronizando las tablas de la BBDD: ", error);
//	process.exit(1);
//});
exports.Quiz = Quiz; //exportar definicion de la tabla Quiz
exports.Comment = Comment; //exportar definicion de la tabla Comment
exports.User = User; //exportar definicion de la tabla User
