const fixture = require('../../scripts/fixture.js');
const startServer = require('../../server/src/index.js');
const BookModels = require('../../server/src/models/book.js');

let BASE_URL;
let server;

before(async (browser, done) => {
    server = await startServer();

    BASE_URL = `http://localhost:${server.address().port}`;
    done();
});

beforeEach(async (browser, done) => {
    await BookModels.Book.sync({ force: true });
    await fixture.initBooks();
    done();
});

after(() => {
    server.close();
});


//-----------------------------------------------------------------------------------

describe('Home Test', () => {
    test('Deberia tener de titulo Bookli', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .assert.titleContains('Bookli');
    });

    test('Deberia mostrar el logo de Bookli', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('.brand__logo')
            .assert.attributeContains(
                '.brand__logo',
                'src',
                '/assets/logo.svg'
            );
    });



test('Deberia verificar que el input de búsqueda tenga placeholder', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('.search__input')
            .assert.attributeContains(
                '.search__input',
                
                'placeholder', 'nombre,autor,editorial...'
            );
    });

    test('Deberia mostrar la lista de libros', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('.booklist .book')
            .assert.elementPresent('.booklist .book');
    });



/* INICIO TEST VERIFICAR VISIBILIDAD DEL ISBN */

    test('Deberia mostrar el ISBN del libro', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('body > main > div > div.book__body')
            .pause(400)
            .assert.elementPresent('body > main > div > div.book__body > div > p:nth-child(1)');
    });

/* FIN TEST VERIFICAR VISIBILIDAD DEL ISBN */


    test('Deberia indicar si se aplica opacity al pasar sobre una card', browser => {

browser
.url(BASE_URL)
.waitForElementVisible('body')
.waitForElementVisible('.booklist .book')
.moveToElement('body>main > div > div.books-container > div > a:nth-child(1) > div', 10, 10,)
.assert.cssProperty('body > main > div > div.books-container > div > a:nth-child(1) > div', 'opacity', '0.5');});


test('Verifica que las cards tienenborde rojo', browser => {
browser
.url(BASE_URL)
.waitForElementVisible('body')
.waitForElementVisible('.booklist .book')

.assert.cssProperty('a.book-link:nth-child(1) > div:nth-child(1)', 'border-color', 'rgb(255, 0, 0)');});
	


	test('Deberia poder encontrar un libro por titulo', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('.booklist .book')
            .click('.search__input')
            .keys('Operaci')
            .pause(400)
            .expect.elements('.booklist .book')
            .count.to.equal(1);
    });

    test('Deberia mostrar un mensaje cuando no se encuentra un libro', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('.booklist .book')
            .click('.search__input')
            .keys('No existe')
            .pause(400);

        browser.expect.elements('.booklist .book').count.to.equal(0);
        browser.expect.element('.booklist.booklist--empty p')
               .text.to.equal('Hmmm... Parece que no tenemos el libro que buscas.\nProba con otra busqueda.');
    });
});

 

//----------------------------------------------------------------------------------------------

describe('Detail view', () => {
    test('Deberia mostrar boton para agregar a lista de lectura', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__actions [data-ref=addToList]');

        browser.expect
            .element('.book__actions [data-ref=addToList]')
            .text.to.equal('Empezar a leer');
    });

    //------------------ Testeo Feature 3 By Nico ------------------------------

      test('Deberia volver a la pantalla principal (home) haciendo click  ', browser => {
        browser
           .url(BASE_URL + '/detail/1')
           .waitForElementVisible('body')
           .waitForElementVisible('button.btn:nth-child(2)')
           .click('button.btn:nth-child(2)')          
           .assert.urlEquals(BASE_URL+ '/' );  
        
             });
  
   //-------------------- fin del test Feature ---------------------------------




 //------------------ Testeo Feature 1 ------------------------------


     test('Deberia volver a la pagina home principal haciendo click en el logo ', browser => {
        browser
           .url(BASE_URL + '/' )
           .waitForElementVisible('body')
           .waitForElementVisible('.brand__logo')
           .click('.brand__logo')
           .assert.urlEquals(BASE_URL + '/');
                                   });

   //-------------------- fin del test Feature 1 ---------------------------------

test('Deberia mostrar boton para remover libro de la lista de lectura si el libro es parte de la lista de lectura', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible(' .book__actions [data-ref=addToList]');

        browser
            .click('.book__actions [data-ref=addToList]')
            .pause(1000)
            .waitForElementVisible('.book__actions [data-ref=removeFromList]');

        browser.expect
            .element('.book__actions [data-ref=removeFromList]')
            .text.to.equal('Dejar de leer');
    });

    test('Deberia poder remover libro de la lista de lectura', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__actions [data-ref=addToList]');

        browser
            .click('.book__actions [data-ref=addToList]')
            .pause(400)
            .waitForElementVisible('.book__actions [data-ref=removeFromList]');

        browser.expect
            .element('.book__actions [data-ref=removeFromList]')
            .text.to.equal('Dejar de leer');

        browser
            .click('.book__actions [data-ref=removeFromList]')
            .pause(400)
            .waitForElementVisible('.book__actions [data-ref=addToList]');

        browser.expect
            .element('.book__actions [data-ref=addToList]')
            .text.to.equal('Empezar a leer');
    });

    test('Deberia poder finalizar un libro de la lista de lectura', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__actions [data-ref=addToList]');

        browser
            .click('.book__actions [data-ref=addToList]')
            .pause(400)
            .waitForElementVisible('.book__actions [data-ref=removeFromList]');

        browser.expect
            .element('.book__actions [data-ref=addToFinish]')
            .text.to.equal('Lo termine!');

        browser
            .click('.book__actions [data-ref=addToFinish]')
            .pause(400)
            .waitForElementVisible(
                '.book__actions [data-ref=removeFromFinish]'
            );

        browser.expect
            .element('.book__actions [data-ref=removeFromFinish]')
            .text.to.equal('Volver a leer');
    });


    test('Deberia mostrar boton comprar y dirigir a amazon', browser => {browser
 			.url(BASE_URL + '/' )
           .waitForElementVisible('body')
           .waitForElementVisible('.comprar')
           .waitForElementVisible('body > main > div > div.books-container > div > a:nth-child(2) > div > div.book__body > p:nth-child(2) > button')
           .click('body > main > div > div.books-container > div > a:nth-child(2) > div > div.book__body > p:nth-child(2) > button')          
           .assert.urlEquals(BASE_URL + '/detail/2'); 


            });

});
