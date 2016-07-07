console.log("%c%s","color: #000; background: green; font-size: 24px;",
"STARTING LASERWEB")
// colors for the consolelog
var msgcolor = '#000000';
var successcolor = '#00aa00';
var errorcolor = '#cc0000';
var warncolor = '#ff6600';

var debug = false;

var useNumPad;
var activeObject, fileName

// Place all document.ready tasks into functions and ONLY run the functions from doument.ready
$(document).ready(function() {

    // Intialise
    loadSettingsLocal();
    initLocalStorage();
    init3D();
    animate();
    filePrepInit();
    initTabs();
    initJog();
    errorHandlerJS();
    var paperscript = {};
    rasterInit();
    macrosInit();
    svgInit();
    initSocket();
    initTour();
    initSmoothie();


    // Tooltips
    $(document).tooltip();
    $(document).click(function() {
        $(this).tooltip("option", "hide", {
            effect: "clip",
            duration: 500
        }).off("focusin focusout");
    });

    $('#g-open').on('click', function() {
      $('#googledrive').modal('show');
    });
    // Top toolbar Menu

    //File -> Open
    var fileOpen = document.getElementById('file');
    fileOpen.addEventListener('change', readFile, false);

    // Fix for opening same file from http://stackoverflow.com/questions/32916687/uploading-same-file-into-text-box-after-clearing-it-is-not-working-in-chrome?lq=1
    $('#file').bind('click', function() {
      $('#file').val(null);
    });

    // File -> Save
    $('#save').on('click', function() {
        saveFile();
    });

    // View -> reset
    $('#viewReset').on('click', function() {
        resetView();
    });


    $('#savesettings').on('click', function() {
        saveSettingsLocal();
    });

    // Tabs on right side
    $('#drotabtn').on('click', function() {
      $('#drotab').show();
      $('#gcodetab').hide();
      $("#drotabtn").addClass("active");
      $("#gcodetabbtn").removeClass("active");
    });


    $('#gcodetabbtn').on('click', function() {
      $('#drotab').hide();
      $('#gcodetab').show();
      $("#drotabtn").removeClass("active");
      $("#gcodetabbtn").addClass("active");
    });

    // Show/Hide Macro Pad
    $('#toggleviewer').on('click', function() {
      if ($( "#toggleviewer" ).hasClass( "active" )) {

      } else {
        $('#hometab').show();
        $('#camleftcol').hide();
        $('#settingscol').hide();
        $("#toggleviewer").addClass("active");
        $("#togglefile").removeClass("active");
        $("#togglesettings").removeClass("active");
      }
    });

    $('#togglefile').on('click', function() {
      if ($( "#togglefile" ).hasClass( "active" )) {

      } else {
        $('#hometab').hide();
        $('#camleftcol').show();
        $('#settingscol').hide();
        $("#toggleviewer").removeClass("active");
        $("#togglefile").addClass("active");
        $("#togglesettings").removeClass("active");
      }
    });

    $('#togglesettings').on('click', function() {
      if ($( "#togglesettings" ).hasClass( "active" )) {

      } else {
        $('#hometab').hide();
        $('#camleftcol').hide();
        $('#settingscol').show();
        $("#toggleviewer").removeClass("active");
        $("#togglefile").removeClass("active");
        $("#togglesettings").addClass("active");
      }
    });


    // Viewer
    var viewer = document.getElementById('renderArea');


    // Progressbar
    // NProgress.configure({ parent: '#gcode-menu-panel' });
    NProgress.configure({
        showSpinner: false
    });

    checkNumPad();

    checkSettingsLocal();

    // Bind Quote System
    $('.quoteVar').keyup(function(){
      var setupfee = ( parseFloat($("#setupcost").val()) ).toFixed(2);
      var materialcost = ( parseFloat($("#materialcost").val()) * parseFloat($("#materialqty").val()) ).toFixed(2);
      var timecost = ( parseFloat($("#lasertime").val()) * parseFloat($("#lasertimeqty").val()) ).toFixed(2);
      var unitqty = ( parseFloat($("#qtycut").val()) ).toFixed(2);
      var grandtot = (materialcost*unitqty) + (timecost*unitqty) + parseFloat(setupfee);
      var grandtotal = grandtot.toFixed(2);
      $("#quoteprice").empty();
      $("#quoteprice").html('<div class="table-responsive"><table class="table table-condensed"><thead><tr><td class="text-center"><strong>Qty</strong></td><td class="text-center"><strong>Description</strong></td><td class="text-right"><strong>Unit</strong></td><td class="text-right"><strong>Total</strong></td></tr></thead><tbody><tr><td>1</td><td>Setup Cost</td><td class="text-right">'+setupfee+'</td><td class="text-right">'+setupfee+'</td></tr><tr><td>'+unitqty+'</td><td>Material</td><td class="text-right">'+materialcost+'</td><td class="text-right">'+(materialcost*unitqty).toFixed(2)+'</td></tr><tr><td>'+unitqty+'</td><td>Laser Time</td><td class="text-right">'+timecost+'</td><td class="text-right">'+(timecost*unitqty).toFixed(2)+'</td></tr><tr><td class="thick-line"></td><td class="thick"></td><td class="thick-line text-center"><strong>Total</strong></td><td class="thick-line text-right">'+ grandtotal +'</td></tr></tbody></table></div>' );
    });


    $('#controlmachine').hide();
    $('#armmachine').show();
    $('#armpin').pincodeInput({
      // 4 input boxes = code of 4 digits long
      inputs:4,
      // hide digits like password input
      hideDigits:true,
      // keyDown callback
      keydown : function(e){},
      // callback when all inputs are filled in (keyup event)
      complete : function(value, e, errorElement){
      var val = localStorage.getItem(armpin);
      if (val) {

      } else {
        val = "1234"
      }
      if ( value != val ){
      		$("#armerror").html("Code incorrect");
          // $("#armButton").addClass('disabled');
      	} else {
          $("#armerror").html("Code correct");
          $('#controlmachine').show();
          $('#armmachine').hide();
          // $("#armButton").removeClass('disabled');
        }
      }
    });
    $('#setarmpin').pincodeInput({
      // 4 input boxes = code of 4 digits long
      inputs:4,
      // hide digits like password input
      hideDigits:false,
      // keyDown callback
      keydown : function(e){},
      // callback when all inputs are filled in (keyup event)
      complete : function(value, e, errorElement){
        localStorage.setItem(armpin, value);
        $("#setpinmsg").html("<h3>Pin set to "+value+"</h3>");
        setTimeout(function(){ $('#pinresetmodal').modal('hide') }, 500);
        // $('#pinresetmodal').modal('hide');
      }
    });

    cncMode = $('#cncMode').val()
    if (cncMode == "Enable") {
      document.title = "CNCWeb";
    };


}); // End of document.ready




function checkNumPad() {
  useNumPad = $('#useNumPad').val()
  if (useNumPad.indexOf('Enable') == 0) {
    $.fn.numpad.defaults.gridTpl = '<table class="table modal-content"></table>';
    $.fn.numpad.defaults.backgroundTpl = '<div class="modal-backdrop in"></div>';
    $.fn.numpad.defaults.displayTpl = '<input type="text" class="form-control" />';
    $.fn.numpad.defaults.dblCellTpl = '<td colspan="2"></td>',
    $.fn.numpad.defaults.buttonNumberTpl =  '<button type="button" class="btn btn-numpad btn-default" style="width: 100%;"></button>';
    $.fn.numpad.defaults.buttonFunctionTpl = '<button type="button" class="btn  btn-numpad" style="width: 100%;"></button>';
    //$.fn.numpad.defaults.onKeypadCreate = function(){$(this).find('.done').addClass('btn-primary');};
    $('.numpad').numpad({
			decimalSeparator: '.',
      gcode: false,
      textDone: 'OK',
  		textDelete: 'Del',
  		textClear: 'Clear',
  		textCancel: 'Cancel',
      headerText: 'Enter Number',
		});
    $('.numpadgcode').numpad({
      decimalSeparator: '.',
      gcode: true,
      textDone: 'OK',
  		textDelete: 'Del',
  		textClear: 'Clear',
  		textCancel: 'Cancel',
      headerText: 'Enter GCODE',
    });
  }
}

// Error handling
errorHandlerJS = function() {
  window.onerror = function(message, url, line) {
    message = message.replace(/^Uncaught /i, "");
    //alert(message+"\n\n("+url+" line "+line+")");
    console.log(message + "\n\n(" + url + " line " + line + ")");
    if (message.indexOf('updateMatrixWorld') == -1 ) { // Ignoring threejs/google api messages, add more || as discovered
        printLog(message + "\n(" + url + " on line " + line + ")", errorcolor);
    }
  };
};

// Function to execute when opening file (triggered by fileOpen.addEventListener('change', readFile, false); )
function readFile(evt) {
  console.log(evt);
    // Close the menu
    $("#drop1").dropdown("toggle");
    // Filereader
    var f = evt.target.files[0];
    if (f) {
        var r = new FileReader();
        if (f.name.match(/.dxf$/i)) {
            console.log(f.name + " is a DXF file");
            console.log('Reader: ', r)
            r.readAsText(evt.target.files[0]);
            r.onload = function(e) {
                dxf = r.result
                drawDXF(dxf, f.name);
                printLog('DXF Opened', successcolor);
                putFileObjectAtZero();
                resetView()
            };

        } else if (f.name.match(/.svg$/i)) {
            console.log(f.name + " is a SVG file");
            r.readAsText(evt.target.files[0]);
            r.onload = function(event) {
                svg = r.result
                var svgpreview = document.getElementById('svgpreview');
                svgpreview.innerHTML = r.result;
                var svgfile = $('#svgpreview').html();
                svg2three(svgfile, f.name);
                printLog('SVG Opened', successcolor);
                resetView()
            };


        } else if (f.name.match(/.gcode$/i)) {
            r.readAsText(evt.target.files[0]);
            r.onload = function(event) {
                // cleanupThree();
                $("#gcodefile").show();
                document.getElementById('gcodepreview').value = this.result;
                openGCodeFromText();
                printLog('GCODE Opened', successcolor);
                resetView()
            };
        } else if (f.name.match(/.stl$/i)) {
            //r.readAsText(evt.target.files[0]);
            // Remove the UI elements from last run
            var stlloader = new MeshesJS.STLLoader;
            r.onload = function(event) {
                // cleanupThree();
                // Parse ASCII STL
                if (typeof r.result === 'string') {
                    console.log("Inside STL.js Found ASCII");
                    stlloader.loadString(r.result);
                    return;
                }
                // buffer reader
                var view = new DataView(this.result);
                // get faces number
                try {
                    var faces = view.getUint32(80, true);
                } catch (error) {
                    self.onError(error);
                    return;
                }
                // is binary ?
                var binary = view.byteLength == (80 + 4 + 50 * faces);
                if (!binary) {
                    // get the file contents as string
                    // (faster than convert array buffer)
                    r.readAsText(evt.target.files[0]);
                    return;
                }
                // parse binary STL
                console.log("Inside STL.js Binary STL");
                stlloader.loadBinaryData(view, faces, 100, window, evt.target.files[0]);
            };
            // start reading file as array buffer
            r.readAsArrayBuffer(evt.target.files[0]);
            printLog('STL Opened', successcolor);
            $('#stlslice').modal('show')
        } else {
            console.log(f.name + " is probably a Raster");
            $('#origImage').empty();
            r.readAsDataURL(evt.target.files[0]);
            r.onload = function(event) {
                var name = evt.target.files[0].name;
                var data = event.target.result;
                drawRaster(name, data);
            };
        }
    }
    $('#filestatus').hide();
    $('#cam-menu').click();
    if (control) {
        scene.remove(control);
        controls.reset();
    }
    setTimeout(function(){ fillLayerTabs(); }, 300);
};

function saveFile() {
    var textToWrite = prepgcodefile();
    var blob = new Blob([textToWrite], {type: "text/plain"});
    invokeSaveAsDialog(blob, 'file.gcode');

};

/**
 * @param {Blob} file - File or Blob object. This parameter is required.
 * @param {string} fileName - Optional file name e.g. "image.png"
 */
function invokeSaveAsDialog(file, fileName) {
    if (!file) {
        throw 'Blob object is required.';
    }

    if (!file.type) {
        file.type = 'text/plain';
    }

    var fileExtension = file.type.split('/')[1];

    if (fileName && fileName.indexOf('.') !== -1) {
        var splitted = fileName.split('.');
        fileName = splitted[0];
        fileExtension = splitted[1];
    }

    var fileFullName = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + '.' + fileExtension;

    if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
        return navigator.msSaveOrOpenBlob(file, fileFullName);
    } else if (typeof navigator.msSaveBlob !== 'undefined') {
        return navigator.msSaveBlob(file, fileFullName);
    }

    var hyperlink = document.createElement('a');
    hyperlink.href = URL.createObjectURL(file);
    hyperlink.target = '_blank';
    hyperlink.download = fileFullName;

    if (!!navigator.mozGetUserMedia) {
        hyperlink.onclick = function() {
            (document.body || document.documentElement).removeChild(hyperlink);
        };
        (document.body || document.documentElement).appendChild(hyperlink);
    }

    var evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });

    hyperlink.dispatchEvent(evt);

    if (!navigator.mozGetUserMedia) {
        URL.revokeObjectURL(hyperlink.href);
    }
}
function printLog(text, color) {
  if ($('#console p').length > 300) {
    // remove oldest if already at 300 lines
    $('#console p').first().remove();
  }
  $('#console').append('<p class="pf" style="color: ' + color + ';">' + text);
  $('#console').scrollTop($("#console")[0].scrollHeight - $("#console").height());
};


function toggleFullScreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    printLog('Going Fullscreen', successcolor);
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
    printLog('Exiting Fullscreen', successcolor);
  }
}
