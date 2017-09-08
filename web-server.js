//подключаем модули
var express =  require('express');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var formidable = require('formidable');
var credentials = require('./credentials');

var app = express();

//устанавливаем механизм представлений
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));
//подключаем парсер для POST запросов
app.use(require('body-parser'). urlencoded({ extended: true }));
//подключаем работу с cookie
app.use(require('cookie-parser')(credentials.cookieSecret));

//промежуточное ПО для внедрения данных в res.locals.partials
app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weatherContext = getWeatherData();
    next();
});




//отключаем заголовок в ответе Express
//app.disable('x-powered-by');

//устанавливаем порт приложения
app.set('port', 8080);



//устанавливаем маршруты
//главная страница
app.get('/', function (req, res) {
    res.status(200);
    res.cookie('test cookie', 'test test cokie');
    res.render('home');
    var ip = req.ip;//req.headers['x-forwarded-for'] ||
        //req.connection.remoteAddress ||
        //req.socket.remoteAddress; ||
        //req.connection.socket.remoteAddress;

    console.log(ip);
    for (var name in req.headers){
        console.log(name+':'+req.headers[name]);
    }
});


//страница О...
app.get('/about', function (req, res) {
    res.status(200);
    res.render('about');
});

app.post('/', function (req, res) {

    //console.log (req.body.name);
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (err) return res.redirect('/');
        console.log('Fields:');
        console.log(fields);

        console.log('Files:');
        console.log(files);
    })

    res.redirect(303, '/');

});
//страница 404
app.use(function (req, res) {
   res.status(404);
   res.render('404');
});
//страница 500
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

function getWeatherData(){
    return {
        locations: [
            {
                name: 'Портленд',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                weather: 'Сплошная облачность ',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Бенд',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                weather: 'Малооблачно',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
};


app.listen(app.get('port'), function () {
    console.log('Express is started on http://localhost:' + app.get('port') + ' press Ctrl+C for stop');
});


