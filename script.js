
let beginner_button = document.getElementById("begginer") 
let easy_button = document.getElementById("easy")
let medium_button = document.getElementById("medium")
let advanced_button = document.getElementById("advanced")
let rm = document.getElementById("remaining-mines"); // para poner las minas faltantes
let time = document.getElementById("time"); 
let carita = document.getElementById("recharge-button"); 

let tables = document.getElementById("minesweepers"); 

let row = 0; 
let columns = 0; 
let mines = 0; 
let total_buttons = 0; 
let buttons_mines = {}; 
let buttons_marked = [];
let buttons_clicked = [];

let first_click = true; 
let intervalId = undefined; 

carita.disabled = true;

//notas
// ejemplo del color de los numeros: https://media.vandalsports.com/i/1624x1218/5-2021/2021519181721_1.jpg

beginner_button.addEventListener("click", function() {

  row = 8;
  columns = 10;
  total_buttons = row * columns;
  mines = 7;
  rm.innerHTML = mines;
  carita.disabled = false;
  hideDifficulties();
  generateTable(row, columns);

});

easy_button.addEventListener("click", function() {

  row = 9;
  columns = 14;
  total_buttons = row * columns;
  mines = 15
  rm.innerHTML = mines;
  carita.disabled = false;
  hideDifficulties();
  generateTable(row, columns);

});

medium_button.addEventListener("click", function() {

  row = 15;
  columns = 20;
  total_buttons = row * columns;
  mines = 40
  rm.innerHTML = mines;
  carita.disabled = false;
  hideDifficulties();
  generateTable(row, columns);

});

advanced_button.addEventListener("click", function() {

  row = 20;
  columns = 30;
  total_buttons = row * columns;
  mines = 99
  rm.innerHTML = mines;
  carita.disabled = false;
  hideDifficulties();
  generateTable(row, columns);

});

carita.addEventListener("click", function () {
  // resetear tabla
  //hay un problema, no inicia el temporizador y no se quedan marcados los botones y las minas en el mismo lugar
  buttons_mines = {};
  buttons_marked = [];
  buttons_clicked = [];
  first_click = true;

  time.innerHTML = "0";
  rm.innerHTML = mines;
  carita.innerHTML = '<img src="images/live.jpg" alt="cara feliz">';

  clearInterval(intervalId);

  for (let i = 1; i <= total_buttons; i++) {

    document.getElementById(`bm${i}`).innerHTML = "";
    document.getElementById(`bm${i}`).style = "background-color: transparent; height: 50px; width: 50px; margin: -2px; border: 5px solid; border-left-color: #ffffff; border-top-color: #ffffff; border-bottom-color: #bbbbbb; border-right-color: #bbbbbb;"
    document.getElementById(`bm${i}`).disabled = false;

  }
  for (number of randomNumbers(mines, 1, total_buttons)) {

    buttons_mines[`bm${number}`] = true;

  }

})

function hideDifficulties()  {

  beginner_button.style = 'display: none;'
  easy_button.style = 'display: none;'
  medium_button.style = 'display: none;'
  advanced_button.style = 'display: none;'

}


function generateTable(r, c) {
  
  let actual_buttons = 1;
  let t = '';

  for (let i = 1; i <= r; i++) {

    t += '<tr>'

    for (let e = 1; e <= c; e++) {
      
      t += `<td><button id="bm${actual_buttons}"></button></td>`;
      buttons_mines[`bm${actual_buttons}`] = false;
      actual_buttons++

    }

    t += '</tr>'

  }

  for (number of randomNumbers(mines, 1, total_buttons)) {

    buttons_mines[`bm${number}`] = true;

  }

  tables.innerHTML = t;
  
  let limits_right = [];
  let limits_bottom = [];
  let limits_left = [];
  let limits_top = [];
  
  let asdxd = columns;
  
  for (let i = 1; i <= row; i++) {
    
    limits_right.push(asdxd);
    asdxd += columns;
    
  }
  asdxd = (columns * (row-1)) + 1;
  for (let i = 1; i <= columns; i++) {
    
    limits_bottom.push(asdxd)
    asdxd++
    
  }
  asdxd = 1;
  for (let i = 1; i <= row; i++) {
    
    limits_left.push(asdxd);
    asdxd += columns;
    
  }
 for (let i = 1; i <= columns; i++) {
    
    limits_top.push(i);
    
  }
  
  
//seguir aqui


  for (let i = 1; i <= total_buttons; i++) {

    document.getElementById(`bm${i}`).addEventListener("mouseup", function(e) {

      if (first_click) {

        first_click = false;
        intervalId = setInterval(() => {

            time.innerHTML = parseInt(time.innerHTML)+1

        }, 1000)

      }

      if (e.button === 0) { //click izquierdo
        // hacer que deshabilite el boton
        if (buttons_marked.includes(i)) return;

        // document.getElementById(`bm${i}`).style = "border: 2px solid #bbbbbb;"
        click(i)

        if (buttons_mines[`bm${i}`]) { // game over

          var audio = document.getElementById("audio");
          audio.play();

          
          document.body.style = "background-color: red;";
          document.getElementById(`bm${i}`).style = "background-color: red; border-color: red;"
          setTimeout(() => { document.body.style = "background-color: #cccccc;" }, 100);
          clearInterval(intervalId);
          carita.innerHTML = '<img src="images/diedd.jpg" alt="cara muerta DX">'
          for (let a = 1; a <= total_buttons; a++) {

            if (buttons_mines[`bm${a}`]) {

              if (!buttons_marked.includes(a)) {

                document.getElementById(`bm${a}`).innerHTML = '<img src="images/mine.png">';

              }

            }

            document.getElementById(`bm${a}`).disabled = true;

          }

          buttons_marked.forEach((number) => {

            if (!buttons_mines[`bm${number}`]) {

              document.getElementById(`bm${number}`).style = 'border-color: red;'

            }

          })
  
        } else {
  
          let minas_alrededor = minesAround(i);
  
          if (minas_alrededor >= 1) {
  
            document.getElementById(`bm${i}`).innerHTML = minas_alrededor;
  
          } else {
            //dolor de cabeza hacer el algoritmo este

            // console.log('ejecutando floodfill')
            floodFill(i);
            // No esta terminado el floodFill

          }
  
        }

      } else if (e.button === 2) { // click derecho

        if (!buttons_marked.includes(i)) {

          document.getElementById(`bm${i}`).innerHTML = '<img src="images/flag.png" alt="bandera">'
          buttons_marked.push(i);
          rm.innerHTML = parseInt(rm.innerHTML)-1;

        } else {

          buttons_marked = buttons_marked.filter(button => button!=i); //para quitar lo de que esta marcado
          document.getElementById(`bm${i}`).innerHTML = "";
          rm.innerHTML = parseInt(rm.innerHTML)+1;

        }
        
      }

    })

  }

  
}

function randomNumbers(cantidad, min, max) {

  let numbers = [];
  for (let i = 1; i <= cantidad; i++) {
    
    let number = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!numbers.includes(number)) {
      
      numbers.push(number);
      
    } else {
      
      i--
      
    }

  }
  return numbers

}

function infoButton(boton) {
  let info = {};

  info.on_limits = {};
  info.mines_around = {};
  info.mines_around.total = 0;
  info.marked = undefined;
  info.isMine = undefined;
  // info.clicked = false;

  let limits_right = [];
  let limits_bottom = [];
  let limits_left = [];
  let limits_top = [];

  let asdxd = columns;
  for (let i = 1; i <= row; i++) {
    
    limits_right.push(asdxd);
    asdxd += columns;
    
  }
  asdxd = (columns * (row-1)) + 1;
  for (let i = 1; i <= columns; i++) {
    
    limits_bottom.push(asdxd)
    asdxd++
    
  }
  asdxd = 1;
  for (let i = 1; i <= row; i++) {
    
    limits_left.push(asdxd);
    asdxd += columns;
    
  }
 for (let i = 1; i <= columns; i++) {
    
    limits_top.push(i);
    
  }

  if (limits_top.includes(boton)) {

    info.on_limits.top = true;

  } else {

    info.on_limits.top = false;

  }
  if (limits_right.includes(boton)) {

    info.on_limits.right = true;

  } else {

    info.on_limits.right = false;

  }
  if (limits_bottom.includes(boton)) {

    info.on_limits.bottom = true;

  } else {

    info.on_limits.bottom = false;

  }
  if (limits_left.includes(boton)) {

    info.on_limits.left = true;

  } else {

    info.on_limits.left = false;

  }




  if (!limits_top.includes(boton)) {

    if (buttons_mines[`bm${boton-columns}`]) {

      info.mines_around.total += 1;
      info.mines_around.top = true;

    } else {
      
      info.mines_around.top = false;

    }

  }
  if (!limits_right.includes(boton)) {

    if (buttons_mines[`bm${boton+1}`]) {
      
      info.mines_around.total += 1;
      info.mines_around.right = true;
      
    } else {
      
      info.mines_around.right = false;

    }

  }
  if (!limits_bottom.includes(boton)) {

    if (buttons_mines[`bm${boton+columns}`]) {

      info.mines_around.total += 1;
      info.mines_around.bottom = true;
      
    } else {
      
      info.mines_around.bottom = false;

    }

  }
  if (!limits_left.includes(boton)) {

      if (buttons_mines[`bm${boton-1}`]) {
        
        info.mines_around.total += 1;
        info.mines_around.left = true;
        
      } else {
        
        info.mines_around.left = false;

      }

  }
  if (!limits_bottom.includes(boton) && !limits_left.includes(boton)) {

    if (buttons_mines[`bm${boton+columns - 1}`]) {

    info.mines_around.total += 1;
    info.mines_around.bottom_left = true;
    
    } else {
      
      info.mines_around.bottom_left = false;

    }

  }
  if (!limits_bottom.includes(boton) && !limits_right.includes(boton)) {

    if (buttons_mines[`bm${boton+columns + 1}`]) {
  
      info.mines_around.total += 1;
      info.mines_around.bottom_right = true;
      
    } else {
      
      info.mines_around.bottom_right = false;

    }

  }
  if (!limits_top.includes(boton) && !limits_left.includes(boton)) {

    if (buttons_mines[`bm${boton-columns - 1}`]) {
      
      info.mines_around.total += 1;
      info.mines_around.top_left = true;

    } else {
      
      info.mines_around.top_left = false;

    }

  }
  if (!limits_top.includes(boton) && !limits_right.includes(boton)) {

    if (buttons_mines[`bm${boton-columns + 1}`]) {
      
      info.mines_around.total += 1;
      info.mines_around.top_right = true;

    } else {
      
      info.mines_around.top_right = false;

    }
    
  }

  return info;

}

function minesAround(bm) {
  
  let mines_around = 0;
  if (!infoButton(bm).on_limits.top) {

    if (buttons_mines[`bm${bm-columns}`]) {

      mines_around += 1

    }

  }
  if (!infoButton(bm).on_limits.right) {

    if (buttons_mines[`bm${bm+1}`]) {
      
      mines_around += 1
      
    }

  }
  if (!infoButton(bm).on_limits.bottom) {

    if (buttons_mines[`bm${bm+columns}`]) {

      mines_around += 1
      
    }

  }
  if (!infoButton(bm).on_limits.left) {

      if (buttons_mines[`bm${bm-1}`]) {
        
        mines_around += 1
        
      }

  }
  if (!infoButton(bm).on_limits.bottom && !infoButton(bm).on_limits.left) {

    if (buttons_mines[`bm${bm+columns - 1}`]) {

    mines_around += 1
    
    }

  }
  if (!infoButton(bm).on_limits.bottom && !infoButton(bm).on_limits.right) {

    if (buttons_mines[`bm${bm+columns + 1}`]) {
  
      mines_around += 1
      
    }

  }
  if (!infoButton(bm).on_limits.top && !infoButton(bm).on_limits.left) {

    if (buttons_mines[`bm${bm-columns - 1}`]) {
      
      mines_around += 1

    }

  }
  if (!infoButton(bm).on_limits.top && !infoButton(bm).on_limits.right) {

    if (buttons_mines[`bm${bm-columns + 1}`]) {
      
      mines_around += 1

    }
    
  }

  return mines_around;

}

function floodFill(startPoint) {
  
  let columns_busy = [];
  let columns_busy_for_click = [];
  let flagLeft = undefined;
  let flagRight = undefined;
  let pixelStack = [startPoint];
  let actualPointer = pixelStack.pop();
  let pixelVisit = [];

  let up = undefined;
  let bottom = true;

  let ejecutar = true;

  while (ejecutar) {

    if (!infoButton(actualPointer).mines_around.total) {

      click(actualPointer);
      
    } else if (!columns_busy_for_click.includes(actualPointer)) { // no es perfecto esto, pero algo es algo
      
      click(actualPointer)

      columns_busy_for_click.push(actualPointer-columns)
      columns_busy_for_click.push(actualPointer-columns+1)
      columns_busy_for_click.push(actualPointer-columns-1)
      columns_busy_for_click.push(actualPointer+1)
      columns_busy_for_click.push(actualPointer-1)
      columns_busy_for_click.push(actualPointer+columns)
      columns_busy_for_click.push(actualPointer+columns+1)
      columns_busy_for_click.push(actualPointer+columns-1)
      
    }

    if (infoButton(actualPointer).on_limits.top) {
        
      up = false;

    } else if (buttons_mines[`bm${actualPointer-columns}`]) {

      up = false;
      
    } else if (columns_busy.includes(actualPointer-columns)) {

      up = false;

    } else {

      up = true;

    }

    if (up) {

      actualPointer -= columns;

    } else {

      if (infoButton(actualPointer).on_limits.left) {

        flagLeft = false;

      } else if (buttons_mines[`bm${actualPointer-1}`]) {

        flagLeft = false;

      } else if (columns_busy.includes(actualPointer-1)) {

        flagLeft = false;

      }  else {

        flagLeft = true;

      }
      if (infoButton(actualPointer).on_limits.right) {

        flagRight = false;

      } else if (buttons_mines[`bm${actualPointer+1}`]) {

        flagRight = false;

      } else if (columns_busy.includes(actualPointer+1)) {

        flagRight = false;

      } else {

        flagRight = true;

      }

      
      if (flagLeft) {

        pixelStack.push(actualPointer-1);

        let terminar = false;
        let actual = actualPointer-1;
        while (!terminar) {
      
          if (buttons_mines[`bm${actual}`]) {
      
            terminar = true;
      
          } else {
      
            columns_busy.push(actual);
      
          }
      
            
          if (infoButton(actual).on_limits.bottom) { 
            
            terminar = true;
            
          } else {
            
            actual += columns;
      
          }
      
        }

      }

      if (flagRight) {

        pixelStack.push(actualPointer+1);

        let terminar = false;
        let actual = actualPointer+1;
        while (!terminar) {
      
          if (buttons_mines[`bm${actual}`]) {
      
            terminar = true;
      
          } else {
      
            columns_busy.push(actual);
      
          }
      
            
          if (infoButton(actual).on_limits.bottom) { 
            
            terminar = true;
            
          } else {
            
            actual += columns;
      
          }
      
        }

      }

      if (infoButton(actualPointer).on_limits.bottom) {
        
        bottom = false;
  
      } else if (buttons_mines[`bm${actualPointer+columns}`]) {
  
        bottom = false;
        
      } else {
  
        bottom = true;
  
      }

      if (bottom) {

        columns_busy.push(actualPointer)
        actualPointer += columns;

      } else {

        if(pixelStack.length > 0) {

          actualPointer = pixelStack.pop();

        } else {

          ejecutar = false;

        }

      }

    }

  }
  
  
  

}

function click(button_number) {

  if (buttons_mines[`bm${button_number}`]) {

    console.error('No se puede clickear aquí: Hay una mina');
    return 'xd';

  }

  if (!buttons_clicked.includes(button_number)) {

    document.getElementById(`bm${button_number}`).style = "border: 2px solid #bbbbbb;"
    if (minesAround(button_number) >= 1) {

      document.getElementById(`bm${button_number}`).innerHTML = minesAround(button_number);

    } else {
      
      document.getElementById(`bm${button_number}`).innerHTML = "⠀";

    }

    buttons_clicked.push(button_number)

  }

  if (buttons_clicked.length === total_buttons-mines) { // entonces ganaste

    clearInterval(intervalId);

    for (let i = 1; i <= total_buttons; i++) {

      document.getElementById(`bm${i}`).disabled = true;

      if (buttons_mines[`bm${i}`]) {

        if (!buttons_marked.includes(i)) {

          document.getElementById(`bm${i}`).innerHTML = '<img src="images/flag.png">';

        }

      }

    }

    alert('¡Has completado el buscaminas!')

  }

}

// sacado de gugul para que no salga nada cuando se oprima el click derecho XD
function disableIE() {
  if (document.all) {
      return false;
  }
}
function disableNS(e) {
  if (document.layers || (document.getElementById && !document.all)) {
      if (e.which==2 || e.which==3) {
          return false;
      }
  }
}
if (document.layers) {
  document.captureEvents(Event.MOUSEDOWN);
  document.onmousedown = disableNS;
} 
else {
  document.onmouseup = disableNS;
  document.oncontextmenu = disableIE;
}
document.oncontextmenu=new Function("return false");

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
   if ((new Date().getTime() - start) > milliseconds) {
    break;
   }
  }
 }