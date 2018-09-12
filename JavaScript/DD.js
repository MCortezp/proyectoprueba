/**************************Drag Drop****************************/

var precio;
var NProducto;
var total;
var PCantidad;
var Pro_ID;


$(document).on('ready', function () {
	$('#ListaArticulos li').draggable({
		helper: 'clone'
	});

	$('#carrito').droppable({
		drop: eventoDrop
	});


	function eventoDrop(evento, ui) {

		PCantidad = prompt("Cantidad del Producto:", "1");
		var draggable = ui.draggable;
		precio = parseFloat(draggable.children('.precio').text());
		NProducto = draggable.data('articulo');
		Pro_ID = draggable.data('pid');
		total = parseFloat($('#total').text());
		total = total + (precio * PCantidad);
		
		$('#total').text(total);

		var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

		db.transaction(function (tx) {
			/*tx.executeSql('DROP TABLE if exists ARTICULOS');*/

			tx.executeSql('CREATE TABLE IF NOT EXISTS ARTICULOS (ID UNIQUE, NomPro, Precio, Cantidad)');


			tx.executeSql('SELECT * FROM ARTICULOS WHERE ID = ?', [Pro_ID], function (tx, results) {

				var len = results.rows.length, i;

				if (len == 0) {
					tx.executeSql('INSERT INTO ARTICULOS (ID, NomPro, Precio, Cantidad) VALUES (?, ?, ?, ?)', [Pro_ID, NProducto, precio, PCantidad]);
				} else if (len == 1) {
					var ncant = parseInt(results.rows.item(i).Cantidad) + parseInt(PCantidad);
					tx.executeSql('UPDATE ARTICULOS SET CANTIDAD = ? WHERE ID = ?', [ncant, Pro_ID]);
				}

			}, null);

		});

	}

});

/***************************FUNCIONES DE BOTONES******************************/

function FunEliminar(Var_Id) {
	VAL = Var_Id;


	var r = confirm("Seguro que quiere eliminar el registro?");
	if (r == true) {
		db.transaction(function (tx) {
			tx.executeSql('DELETE FROM ARTICULOS WHERE ID=?', [VAL]);
			location.href = "ConfirmacionCompra.html";
			alert("Eliminado Producto ID: " + VAL);
		});
	} else {

	}

}

function FunModificar(Var_Id) {
	var CanT;
	CanT = prompt("Nueva Cantidad:", "1");
	if (CanT === null) {
	} else {
		db.transaction(function (tx) {
			tx.executeSql('UPDATE ARTICULOS SET Cantidad=? WHERE id=?', [CanT, Var_Id]);
			alert("Modificado producto con ID: " + Var_Id + " Nueva cantidad: " + CanT);
			location.href = "ConfirmacionCompra.html";
		});
	}

}