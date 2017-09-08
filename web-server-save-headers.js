/*
* При попытке подключения к корневой странице сохраняем заголовки, полученые от клиента.
*
* Устанавливаем клинту cookie для подсчета количества входов
*
* На главной странице ссылка для формы авторизации: собираем логины и пароли, которые будут вытаться ввести роботы или
* пользователи.
*
*
*
* Just for fun. Учимся работать с node.js и Express
* */

// подключаем необходимые модули

var express = require('express');
var handlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Модели данных

var countOfVisitModel = require('./dbModels/countOfVisit');
var headerModel = require('./dbModels/header');
var accountModel = require('./dbModels/account');

//Константы
var PORT = 8080; // порт приложения
var MONGO_CONNECT_STRING = 'mongodb://localhost/web-server-save-headers'; // строка подключения к БД
var Schema = mongoose.Schema;

var ID_CLIENT = 'IDC'; //название cookie, содержащего ID клиента для статистики
var ID_CLIENT_EXPIRES = 1000*60*60*24*7; //как долго живет cookie для ID клиента

//настраиваем Express
var app = express();
app.set('port', PORT);

//включаем ПО для работы с cookie
app.use(cookieParser());

//устанавливаем механизм представлений

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//настройка Mongo
mongoose.connect(MONGO_CONNECT_STRING, {useMongoClient:true});

app.use(bodyParser.urlencoded({extended:true}));

//промежуточное ПО для сохранения количества посещений
app.use(function (req, res, next) {
    var count =1;
    var id = req.cookies[ID_CLIENT];

    if (id){
        countOfVisitModel.findById(id, function (err, visit) {
            count = 1;
            if (visit){
                count = visit.countOfVisit+1;
                visit.countOfVisit = count;
                visit.save();
                res.cookie(ID_CLIENT, id, {expires: new Date(Date.now()+ID_CLIENT_EXPIRES)});
                res.locals.countOfVisit = count;
                next();
            }
            else{

                var newVisit = new countOfVisitModel({countOfVisit: count});
                id = newVisit._id;
                newVisit.save();
                res.cookie(ID_CLIENT, id, {expires: new Date(Date.now()+ID_CLIENT_EXPIRES)});
                res.locals.countOfVisit = count;
                next();
            }
        });
    }
    else{
        count = 1;
        var newVisit = new countOfVisitModel({countOfVisit: count});
        id = newVisit._id;
        newVisit.save();
        res.cookie(ID_CLIENT, id, {expires: new Date(Date.now()+ID_CLIENT_EXPIRES)});
        res.locals.countOfVisit = count;
        next();
    }
});

//промежуточное ПО для сохранения заголовков
app.use(function (req, res, next) {
    new headerModel({
        requestUrl: req.url,
        requestMethod: req.method,
        remoteAddress: req.ip,
        userAgent: req.headers['user-agent'],
        host: req.headers['host'],
        cookies: req.headers['cookie'],
    }).save();

    next();
});

//маршруты

//корень
app.get('/', function (req, res) {
    res.status(200);
    res.render('home');
});

app.get('/admin', function (req,res) {
    res.status(200);
    res.render('admin');
})

app.post('/admin', function (req, res) {
    console.log(req.body.login+'    '+ req.body.password);
    var newAccount = new accountModel({
                login: req.body.login,
                password: req.body.password,
                date: new Date()
        }
    ).save();

    res.redirect(303, '/admin');
})

//страница 500
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

//страница 404
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

 //запуск сервера
app.listen(app.get('port'), function () {
    console.log('Express is started on http://localhost:' + app.get('port') + ' press Ctrl+C for stop');
});
