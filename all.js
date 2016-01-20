// Varibles
var USER_API = 'http://assist4office.com/api.php?fnc=table&table=user&id',//3-2f902e8 1-c834fb7;
	TABLE_API = 'http://assist4office.com/api.php?fnc=table' //table=pos', // user bbook pos dep role
	HI_API = 'http://assist4office.com/api.php?hi', // 1
	FORM_API = 'http://assist4office.com/api.php?',
	DATA = $('form').serialize();

// Main.js
$(function (){
	// Call ajax func
	if ( UID == 0 ) { // если идентификатор пользователя равер нулю

		$( '.middle_container' ).html( login_form() ); // вывести форму для логина

	} else {

		ajax(); // выдать функцию отрисовки всей главной страницы

	}
	// Кнопка отправки данных оормы
	$('.send_login').click(function() {

		var this_form = $( '#form_login' ).serialize(); // малидизировать данные формы

		$.getJSON( FORM_API , this_form , function ( data ){ // отправить запрос на API

			router( data ); // Закинуть их в функцию роутер для обработки

		});

	});

	// on window resize
	$( window ).resize(function() { // Проверка размера окна

		var wind_heig = $( window ).outerHeight(),
			nav_heig = $( 'nav' ).outerHeight();

		if ( wind_heig <= '492' ) { // Проверяет высоту монитора и если она меньше или равна высоте 492 ( ~ высота навигации )

			$( '.bug_container' ).addClass('absolute') // Добавить класс absolute (top: 410px)

		} else {

			$( '.bug_container' ).removeClass('absolute') // Иначе убрать (top: 410px и вернуть как было)

		}

	});
	// Вешает на .ajax обработчик событий по клику на настройки
	$( 'a.ajax' ).live( 'click' , function () {
		// В переменной хранится этот элемент с data-send 
		var data_send = $( this ).data( 'send' ),
			ret_ = data_send.split( '&' )[ 3 ].split( '=' )[ 1 ];

		$( '.overall' ).remove();

		ret( ret_ );
		// Отправка запроса
		$.getJSON( data_send , function( data ) {
			// Отрисовка запроса
			router( data );

		});

	});
	// слушает сласс iso на клик по боковому меню
	$( 'a.iso' ).live( 'click' , function() {
		// этот элемент a class= iso
		var iso_frlt = $( this ).data( 'filter' ),
			data_send = $( this ).data( 'send' );

		$( '.overall' ).remove();

		$.getJSON( data_send , function( data ) {

			router( data );
			// сортируем по атрибуду data-filter
			iso( iso_frlt );

		});

	});
	// переход по ссылка в профиле пользователя и компании дополнительному меню
	$( 'a.data_split' ).live( 'click' , function () {
		// ссылка на профайл пльзователя / компании
		var this_href = $( this ).data( 'split' );
		// запос
		$.getJSON( this_href , function ( data ) {
			// отрисовка
			router( data );

		});

	});
	// слушает нажание на кнопку выхода
	$( 'a.logout' ).live( 'click' , function () {
		// ссылка на выход
		var data_send = $(this).data( 'send' );
		// запрос
		$.getJSON( data_send , function( data ) { // оправдляет запрос по указаной ссылке
			// отрисовка формы входа
			$( '#main_container' ).html( login_form() ); // отрисовать форму логина

		});

	});
	// Смотрим есть ли изменение хеша в адресной строке
	window.addEventListener( 'hashchange' , function () {
		// Пушим имя документа и место
		history.pushState( '' , document.title , window.location.pathname );

	});

});
// Login form
function login_form () {

	var form = '';

	form += '<form action="POST" target="null" name="frm_frm" enctype="multipart/form-data" id="form_login" method="post">';

		form += '<figure class="top_logo"><img src="http://assist4office.com/admin/tpl/img/assist.jpg" alt="assist"></figure>';

		form += '<h2>Вход в систему <br> <span class="wrong"> Не правильный логин или пароль </span></h2>';

		form += '<input type="hidden" name="mod" value="user"><input type="hidden" name="act" value="login"><input type="hidden" name="fnc" value="login"><input type="hidden" name="hide" value="0"><input type="hidden" name="opr" value="parse_login"><input type="hidden" name="navigator" value="" id="navigator">';

		form += '<input type="email" name="login" id="user" placeholder="Электронная почта" required>';

		form += '<input type="password" name="pass" id="pass" placeholder="Пароль" required>';

		form += '<input type="submit" value="Войти" class="send_login"> <br>';

		form += '<figure class="social">';

			form += '<h2>Войти через социальные сети</h2>';

			form += '<a href="#VK"><img src="http://assist4office.com/admin/tpl/img/sn-vk.png" alt="VK"></a>';

			form += '<a href="#FB"><img src="http://assist4office.com/admin/tpl/img/sn-fb.png" alt="Facebook"></a>';

			form += '<a href="#GP"><img src="http://assist4office.com/admin/tpl/img/sn-gp.png" alt="Google-plus"></a>';

			form += '<a href="#OK"><img src="http://assist4office.com/admin/tpl/img/sn-ok.png" alt="Odnoklasniki"></a>';

		form += '</figure>';

		form += '<a href="#" class="forgot">Забыли пароль?</a>';

		form += '<a href="#" class="forgot">Новый пользователь</a><span> / </span><a href="#" class="forgot">Новая компания</a>';

	form += '</form>'

	form += '<iframe id="null" name="null" style="display: none;"></iframe>';

	return form;

}
// Функция запроса данных с API
function ajax () {

	$.getJSON( HI_API, //TABLE_API HI_API USER_API FORM_API

	function( data ){ 
		// После готовности запускает функцию router с аргентом data
		router( data ),
		// Сортировка по тегу assist
		iso( 'assist' );

	});

}
// Получение и обрабтка результата обращения
function router ( data ){ // Принимает данные с API

	var echo = '', view = '', _tb = '', _mid = '.middle_container';

	for (var key in data){ 

		var a2 = data[ key ];

		for (var key2 in a2){

			var a2_key2 = a2[ key2 ];

			//прописовка бокового меню
			if ( key2 == 'hi' ) $( '#main_container' ).append( hi( a2[ key2 ] ) );
			//проpисовка плиток
			// if ( key2 == 'module' ) view += middle( a2[ key2 ] );
			if ( key2 == 'profile' ) {

				$( _mid ).before( profile( a2[ key2 ] ) );

				view += overall();

			}
			// прорисовка table
			if ( key2 == 'table' ) {
				// прорисовка профиля пользователя
				if ( a2_key2['param!']['alias'] == 'user' ) view += user_profile( a2[ key2 ] );
				// прорисовка таблиц
				else if ( a2_key2['param!']['alias'] != 'user' ) _tb += table( a2[ key2 ] );
				// прорисовка таблиц пользователей
				else echo += users( a2[ key2 ] );

			}

		}

	}

	$( _mid ).html( echo );

	ret();

	$( _mid ).html( view );

	$( _mid ).append( _tb );

	iso( 'assist' );

}

function ret ( ret_key ) {

	// if ( ret_key != '' ) $( '.overall' ).after( '<section class="overall_center table"></sectoin>');

	// else $( '.middle_container' ).html( '<aside class="overall"></aside>' );

	return ret_key;

}
 // Главный экран
function hi( arr ){
	// Отрисовка пользоателя
	var echo = '<section class="left_menu allways_show"><div id="dmn_admin">'; // Создание левого блока пользователя

		echo += '<div id="ufoto"><a data-send="' + USER_API + '=' + arr[ 'uid' ] + '-' + arr[ 'md5' ] + '&ret=user_profile" href="#user_profile" class="ajax">' + usrpic( arr[ 'pic' ] , arr[ 'name' ] ); // Отрисовка аватарки

			echo += '</a></div>' // Закрытие a_profile, ufoto
			// ' + USER_API + arr[ 'uid' ] + '
			echo += '<section class="icons"><a class="logout" href="#" data-send="' + FORM_API + 'fnc=logout"><i class="fa fa-sign-out"></i></a> <a href="#"><i class="fa fa-angle-up"></i></a> <a href="#" class="a_profile ajax" data-send="' + FORM_API + 'fnc=profile&mod=company&id' +  '=' + arr[ 'uid' ] + '-' + arr[ 'md5' ] + '&ret=company_menu"><i class="fa fa-gear"></i></a></section>';

		echo += '</div>' // Закрытие dmn_admin

	echo += '<div id="msub"><nav>'; // Создание навигации

	// Компания. Если у компании индекс 0 - ее нет
	if( arr[ "org" ] > 0 ){

		// Assist
		echo += '<a data-filter=".assist" href="#main_page" class="ass iso" id="m_assist" data-send="' + FORM_API + 'fnc=module">' + orgpic( "_assist.jpg" , "Assist" ) + '<span>Assist</span></a>';
	
		// Center
		if( arr[ 'cntr' ] > 0 ){

			echo += '<a data-filter=.center href="#main_page" class="cntr iso" id="m_center" data-send="' + FORM_API + 'fnc=module">' + orgpic( arr[ 'clogo' ] , arr[ 'cname' ] ) + '<span>Center</span></a>';

		}

		// Если центр не выбран
		else{}

		// Firm
		echo += '<a data-filter=".home" href="#main_page" class="home iso" id="m_home" data-send="' + FORM_API + 'fnc=module">' + orgpic( arr[ 'ologo' ] , arr[ 'oname' ] ) + '<span>Firm</span></a>';

	}
		else{} // Подключить компанию
		// Вывод ссылки на Feedback в панельке
	var bug_tracker = '<figure class="bug_container"> <a href="http://assist4office.com/ru/admin" target="_blank">'; // Создание кнопки BUG TRACKER

		bug_tracker += '<img class="bug_tracker" src="http://assist4office.com/load/1/bug.svg"> </a> </figure>'; // Создание кнопки BUG TRACKER

	echo += '</nav></div>' + bug_tracker + '</section>'; // Вывод bug_tracker и закрытие nav, msub, left_menu

	echo += '<section class="right_container">' // Создание контейнера для CRM

		echo += '<h2>' + arr[ 'name' ] + '</h2>'; // Вывод имени компании

		echo += '<a href="http://somelink/' + arr[ 'link' ] + '">Company profile</a>'; // Вывод ссылки на компанию

		echo += '<section class="right_btns">' // Создание блока кнопок

			echo += '<button>CRM</button><button>info</button><button>Marks</button><button>X</button>' // Кнопки CRM, Info, Marks

		echo += '</section>'; // Закрытие right_btns

		echo += '<section class="right_content">'; // Вывод контента кнопок

			echo += 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur nesciunt iste iure natus nisi saepe inventore autem voluptatem enim eius libero vitae magni neque soluta maxime, facere voluptate, sunt. Ut.'// Вывод инфы в right_content

		echo += '</section>' // Закрытие right_content

	echo += '</section>' // Закрытие right_container

	return echo;

}
 // Отрисовка центра
function middle ( val ) {
	// Создание центрального контейнера
	var midd = '';
	// Создание списака плиток
	midd += '<ul class="wrap_container grid" data-filter="home" id="#main_page">';

	for ( var a3 in val ) { // Перепор результатов выдачи

		var val_a3 = val[ a3 ];

		midd += '<li class="box_container grid-item ' + val_a3[ 'type' ] + '"data-filter="' + val_a3[ 'type' ] + '">'; // Создание плитки
			// Создание головы плитки
			midd += '<header class="header" style="background-image: url(http://assist4office.com/load/1/modul/' + val_a3[ 'bg' ] + ')">'; 
				// Голова плитки
				midd += '<img class="move_bg" src="http://assist4office.com/load/1/modul/' + val_a3[ 'bg2' ] + '"><div class="header_overlay"></div>'; 

				midd += '<div class="icon">' + mudulpic( val_a3[ 'ico' ] ) + '</div>' // Иконка компании

				midd += '<h2>' + val_a3[ 'name' ] + '</h2></header>'; // Имя компании и закрытие header

			midd += '<section class="body_container">'; // Создание тела плитки

				midd += '<div class="alrt-inf">Для начала выберите компанию к которой хотите подключится</div>'; // Блок с текстом подключения

				midd += '<div class="alrt-deal">'; // Создание блока для приглашение
					// Ссылка на пиглашение
					midd += '<a href="//assist4office.com/ru/admin/home/company/referrals/" class="a">Пригласить в Assist</a>'; 

				midd += ' компанию с которой Вы уже работаете</div>' // Закрытие alrt-deal
				// Ссылка на приглашение, закрытие fl
				midd += '<div class="alrt-green"><div class="fl">Ваша компания оказывает такие услуги?</div>'; 
					// Собственное подключение компании
					midd += '<a class="o sb green m0" data-send="company&amp;opr=add&amp;t=water&amp;id=0&amp;self=1" href="#">Мы тоже это можем!</a>'; 

				midd += '<div class="cls"></div></div>'; // Закрытие alrt-green, cls

		midd += '</section></li>'; // Закрытие body_container, box_container 

	}

	midd += '</ul>'; // Закрытие wrap_container

	return midd;

}
 // Отрисовка менишки пользователя и компании
function profile ( data ) {

	var prof = '';
		// Начало бокового блока
		prof += '<aside class="overall">';
			// Имя пользователя
			prof += '<h2>' + 'NAME' + '</h2>';
			// Аватарка пользователя
			prof += '<figure>' + '<img src="http://placehold.it/180x180&text=img">' + '</figure>';
			// Менюшка
				prof += '<div class="menu">';

				for ( var profil in data ) {

					var data_prof = data[ profil ];

					for ( var pro in data_prof ) {

						var data_pro = data_prof[ pro ],
							data_split = data_pro.split( '{-}' );
					// Вывод значений меню
					prof += '<a href="javascript:void(0)" data-split="' + FORM_API + 'fnc=' + data_split[ 1 ] + '&table=' + data_split[ 2 ] + '&ret=' + ret( 'company_table' ) + '" class="data_split" title="' + data_split[ 0 ] + '">' + data_split[ 0 ] + '</a>';

					}

				}
			// Менюшка закрывается
			prof += '</div>';
		// Боковая панель закрывается
		prof += '</aside>';

	return prof;

}
 // центральный болок table
function overall () {

	var over = '';

	// Центральная область
	over += '<section class="overall_center table">';
		// Приветствие, тут также должны быть такблицы
		over += '<h3>Добро пожаловать в Assist4office!</h3>';

		over += '<p>Теперь Вы можете принимать на работу <a href="#">необходимых Вам сотрудников</a></p>';

		over += '<p>Вы можете управлять персоналом в разделе <a href="#">HR</a></p>';

		over += '<p>В <a href="#">Вы</a> можете заполнить всю необходимую информацию о вашей компании</p>';

		over += '<p><a href="#">Приглашайте</a> своих клиентов и начанайте принимать заказы в assist</p>';
	// Закрытие центральной области
	over += '</section>';

	return over;

}
 // Функция отрисовки таблиц
function table ( opt ) {

	var arr = new Array,
		tbl = '';

		tbl += '<section class="layout">';

			tbl += '<table border="0">'; // Блок все пользователи

					tbl += '<tr class="tbl_header">'

					tbl += '<th class="add_btn"><button class="add_tbl"> Добавить </button></th>';

				for ( var a3 in opt ) {

					var opt_a3 = opt[ a3 ];

					arr.push( opt_a3 );

				}

				tbl += '<th>' + arr[1]['header'] + '</th><th class="dynamic">' + val_of_arr( arr ) + '</th></tr>';

				for ( var a4 in opt ) {

					var opt_a4 = opt[a4];

					if (a4 == 'param!' || a4 == 'types!' || a4 == 'headers!') continue;

					for ( var a5 in opt_a4 ) {

						var opt_a5 = opt_a4[a5];

						if ( a5 == 'header' ) tbl += '<tr class="tbl_body"><td class="edt_line">' + edit_table( 'Delete' , 'Edit' , 'Off') + '</td><td class="header_parametr">' + opt_a5 + '</td>';

						else if ( a5 == 'photo' ) tbl += '<td class="val_type"><a href="http://assist4office.com/ru/admin/user/' + a4 + '/">' + usrpic( opt_a5 , opt_a4['header'] ) + '</a></td></tr>';

						else if ( a5 == 'file' ) tbl += '<td class="val_type"><a href="http://assist4office.com/load/1/brandbook/' + opt_a5 + '" target="_blank">' + file_ext ( opt_a5 ) + '</a></td></tr>';

						else if ( a5 == 'text' ) tbl += '<td class="val_type">' + opt_a5 + '</td></tr>';

					}

				}

			tbl += '</table>';

		tbl += '</section>';

	return tbl; // Вернуть users

}
 // Функция отрисовки пользователей
function users ( pos ) { 

	var usr = '<section class="middle_container">'

			usr = '<section class="users">'; // Блок все пользователи

			for ( var a3 in pos ) { // Перебирает значения в data

				var pos_a3 = pos[ a3 ];

					if (a4 == 'param!' || a4 == 'types!' || a4 == 'headers!') continue; // Если имя таблицы param! types! headers! пропустить их и дальше отрисовывать

					usr += '<section class="user">'; // Блок прользователь

						usr += '<figure>' + usrpic( pos_a3[ 'photo' ] , pos_a3[ 'header' ] ) + ''; // Аватарка пользователя

							usr += '<a class="profile_link" href="http://assist4office.com/ru/admin/user/' + a3 + '/">Профиль</a>'; // Ссвлка на пользователя

						usr += '</figure>'; // Закрытин ссылки и картинки на пользователя

						usr += '<article class="user_desc">'; // Имя и должость пользователя

							usr += '<h2> ' + pos_a3[ 'header' ] + '</h2>'; // Имя пользователя

							usr += '<h3>text</h3>'; // Должность

						usr += '</article>'; // Закрытие user_desc

					usr += '</section>'; // Закрытие user

			}

		usr += '</section>'; // закрытие users

	usr += '</section>'

	return usr; // Вернуть users

}
 // Отрисовка юзера
function user_profile ( user_data ) {

	var section = '<section class="middle_container">';

		section = '<section class="user_container" id="user_profile">'; // Открытие контейнера для пользователя

			for ( var user_info in user_data ) {

				var user_data_info = user_data[ user_info ];

					if (user_info == 'param!' || user_info == 'types!' || user_info == 'headers!') continue; // Пропустить выдачу значений

					section += '<h2>' + user_data_info[ 'header' ] + '</h2>'; // Имя пользователя

					section += '<aside class="left_container">'; // Отрисовка левого контейнера

						section += '<figure>' + usrpic( user_data_info[ 'photo' ] , user_data_info[ 'header' ] ) + '</figure>'; // Аватарка в левом контейнере

						section += '<nav class="aside_nav">'; // Навигация

							section += '<a href="#">Заказы</a>';

							section += '<a href="#">Мои заказы</a>';

							section += '<a href="#">Профиль</a>';

							section += '<a href="#" class="active">Настойки</a>';

						section += '</nav>'; // Закрытие навигации

					section += '</aside>'; // Закрытие левого контейнера

					section += '<section class="center_container">' // Создание центрального контейнера

						section += '<section class="button_container">'; // Открытие контейнера для кнопок

							section += '<button>Оформление</button> <button>Приватность</button> <button class="active">Профиль</button>' // Кнопки

						section += '</section>' // Закрытие Контейнера для кнопок

						section += '<ul class="user_pref">'; // Профайлы пользователя

							section += '<label for="user_name">Имя пользователя</label><br>';

							section += '<input id="user_name" value="' + user_data_info[ 'header' ] + '">';

							section += '<li class="user_ava"> Аватарка <br>' + usrpic( user_data_info[ 'photo' ] , user_data_info[ 'header' ] ) + ' </li>'; // Имя пользователя

							section += '<li class="user_vk"> Связь с VK <br>'; // Контейнер для соц сети ВК

								section += '<img src="' + user_social_ava ( '' , user_data_info[ 'vk' ] ) + '">'; // Аватарка пользователя

								section += '<a href="https://vk.com/id' + user_social ( '' , user_data_info[ 'vk' ] ) + '">' + user_data_info['vk'].split('{-}')[0] + '</a>'; // Имя пользователя

							section += '</li>'

							section += '<li class="user_fb"> Связь с Facebook <br>'; // Контейнер для соц сети ФБ

								section += '<img src="' + user_social_ava ( '' , user_data_info[ 'fb' ] ) + '">';// Аватарка пользователя

								section += '<a href="https://www.facebook.com/' + user_social ( '' , user_data_info[ 'fb' ] ) + '">' + user_data_info['fb'].split('{-}')[0] + '</a>';// Имя пользователя

							section += '</li>'

							section += '<li class="user_gp"> Связь с Google+ <br>'; // Контейнер для соц сети Гугл

								section += '<img src="' + user_social_ava ( '' , user_data_info[ 'gp' ] ) + '">';// Аватарка пользователя

								section += ' <a href="https://plus.google.com/' + user_social ( '' , user_data_info[ 'gp' ] ) + '">' + user_data_info['gp'].split('{-}')[0] + '</a>';// Имя пользователя

							section += '</li>'

							section += '<li class="user_ok"> Связь с Однокласники <br>'; // Контейнер для соц сети Од

								section += '<img src="' + user_social_ava ( '' , user_data_info[ 'ok' ] ) + '">';// Аватарка пользователя

								section += '<a href="http://ok.ru/' + user_social ( '' , user_data_info[ 'ok' ] ) + '">' + user_data_info['ok'].split('{-}')[0] + '</a>';// Имя пользователя

							section += '</li>'

							section += '<label for="user_mail">Электронная почта ( логин )</label><br>'; // Текст для почты

							section += '<input id="user_mail" value="' + user_data_info[ 'mail' ] + '">'; // Ввод почты

							section += '<label for="user_pass">Пароль ( если не меняете, оставьте поле свободным )</label><br>'; // Текст для пароля

							section += '<input id="user_pass" type="password">'; // Ввод пароля

						section += '</ul>' // Закрытие отрисовки блока пользователя

						section += '<button class="user_save">Сохранить</button>' // Сохранить данные

					section += '</section>' // Закрытие пользовательского контейнера 

			}

		section += '</section>'; // Закрытие контейнера

	section += '</section>'

	return section;

}
 // перебор картинок пользователя
function usrpic( p , h ){

	if( p == "" ){ 
		// Если аргумант P пустой - выдать персую букву слова и дать под нее фон
		var img = "<div title=\""+h+"\" class=\"img no_photo\" style=\"background:#"+(str_RGB( h ))+"\">"+h.charAt(0)+"</div>"; 

	}

	else{ 
		// Иначе добавить картинку
		var img = "<div title=\""+h+"\" class=\"img no_photo\" style=\"background-image: url(http://assist4office.com/load/1/user/"+(p)+");\"></div>"; 
	
	}
	
	return img;

}
 // перебор картинок компании
function orgpic( p , h ){

	if( p == "" ){ 
		// Если аргумант P пустой - выдать персую букву слова и дать под нее фон
		var img = "<div title=\""+h+"\" class=org_pic style=\"background:#"+(str_RGB( h ))+"\">"+h.charAt(0)+"</div>"; 

	}

	else{ 
		// Если аргумант P пустой - выдать персую букву слова и дать под нее фон
		var img = "<div title=\""+h+"\" class=org_pic style=\"background-image: url(http://assist4office.com/load/1/company/"+(p)+");\"></div>"; 

	}

	return img;

}
// Отрисовка иконки услуги
function mudulpic( p , h ){

	if( p == "" ){ 
		// Если аргумант P пустой - выдать персую букву слова и дать под нее фон
		var img = "<div title=\""+h+"\" class=img style=\"background:#"+(str_RGB( h ))+"\">"+h.charAt(0)+"</div>"; 

	}

	else{ 
		// Если аргумант P пустой - выдать персую букву слова и дать под нее фон
		var img = "<div class=figure_img style=\"background-image: url(http://assist4office.com/load/1/modul/"+(p)+");\"></div>"; 

	}

	return img;

}
// Цветовой фон под буквой
function str_RGB( str ){

	var hash = 0;

	for ( var i = 0; i < str.length; i++ ) {

		hash = str.charCodeAt( i ) + ( ( hash << 5 ) - hash);

	}  

	var c = ( hash & 0x00FFFFFF ).toString( 16 );

	return "00000".substring( 0, 6 - c.length ) + c;

}
// Изотоп
function iso ( fltr ) {
	// Настройки изотопа
	var sort_link = '#msub nav a';

	$('.grid').isotope({

		itemSelector: '.grid-item', // .box_container

		transitionDuration: '0.2s', // transition of duration

		percentPosition: false // space between blocks

	});

	$( sort_link ).click( function () {

		var sortValue = $( this ).attr( 'data-filter' );

		$( '.grid' ).isotope({ filter: sortValue });

	})

	if( fltr == "" ) fltr = $(".wrap_container").attr("data-filter");

	$(".wrap_container").attr("data-filter", fltr).isotope({

		filter: '.' + fltr

	});

}
 // перебор ссылок на профиль пользователя
function user_social ( x , z ) { // Принимает значения

	var user_arr = z.split( '{-}' ),
		no_ava = 'http://orig03.deviantart.net/e354/f/2012/071/b/7/my_joker_default_avatar_by_harleymk-d4skv1m.jpg',
		user_arr_link;

	if ( z == '' ) { // Если пустое нарисовать иконку 

		var user_arr_link = no_ava;

	} else { // если не пустое - вывести

		var user_arr_link = user_arr[2];

	}

	return user_arr_link;

}
 // перебор социальных аватарок
function user_social_ava ( x , y ) { // Принимает значения

	var user_arr = y.split( '{-}' ),
		no_ava = 'http://orig03.deviantart.net/e354/f/2012/071/b/7/my_joker_default_avatar_by_harleymk-d4skv1m.jpg',
		user_arr_link;

	if ( y == '' ) { // Если пустое нарисовать иконку 

		var user_arr_link = no_ava;

	} else { // если не пустое - вывести

		var user_arr_link = user_arr[3];

	}

	return user_arr_link;

}
 // Функция отрисвоки кнопок Delete, Edit, On/Off
function edit_table ( a , b , c ) { 

	var edit_img = '<span class="edit_img" style="background: #F44336" title="'+ a + '">'+ a.charAt(0) +'</span><span class="edit_img" style="background: #8BC34A" title="'+ b + '">' + b.charAt(0) + '</span><span class="edit_img" style="background: #448AFF" title="'+ c + '">' + c.charAt(0) + '</span>'

	return edit_img;

}
 // Функция написания текста в 3й колонке
function val_of_arr ( arr ){ 

	for ( var arr_val in arr[ 2 ] ){

		var arr_val_type = arr[ 2 ][ arr_val ],
			arr_type;

		switch ( arr_val_type ) { // Проверка на тип файла

			case 'text' : // Если текст

				arr_type = arr[ 1 ][ 'text' ] // Вывод того, что в кейсе текст

				break;

			case 'file' : // Если файл

				arr_type = arr[ 1 ][ 'file' ] // Вывод того, что в файде

				break;

			case 'pic' : // Если картинка

				arr_type = arr[ 1 ][ 'photo' ] // Вывод того, что в картинке

				break;

			default:  // Иначе

		}

	}

	return arr_type ; 

}
 // Функция распознования расширения файла
function file_ext ( opt_a5 ) { 

	var ext = opt_a5.split( '.' ), // Разделяем на массив полученое значение (расширение файлов)
		opt_ext;

	if ( $.inArray( bust_ext( ext[ 1 ] ) , ext ) == -1 ) { // Проверяем на расширение (-1 не подходит)

		opt_ext = 'There is no such extention' // Если не подходит выводим "Нет такого расширения"

	} else {

		opt_ext = '<img class="extention" src="icon/' + ext[ 1 ] + '.svg" title="' + opt_a5 + '" alt="' + opt_a5 + '">'; // Подходит - вывод расширения файла в картинке

	}

	function bust_ext ( ext ) { // Функция перебора расширений

		return ext;

	}

	return opt_ext;

}